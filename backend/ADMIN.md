# Admin Operations Guide

## Setup

1. **Set ADMIN_KEY in Railway**:
   - Go to Railway → Variables
   - Add: `ADMIN_KEY` = (generate a strong random key)
   - Example: `my-secret-admin-key-2026`

2. **Add PostgreSQL Database**:
   - Railway dashboard → "New" → "Database" → "Add PostgreSQL"
   - Railway auto-creates `DATABASE_URL` variable
   - Redeploy (tables auto-created)

## Admin Endpoints

All admin endpoints require `X-Admin-Key` header.

### 1. Seed Database (First-time setup)

```bash
curl -X POST https://api.votoescalonadocr.org/admin/seed \
  -H "X-Admin-Key: your-admin-key-here"
```

Response:
```json
{
  "message": "Successfully seeded 20 parties",
  "seeded": true
}
```

### 2. Reset All Votes (Keep candidates)

```bash
curl -X DELETE https://api.votoescalonadocr.org/admin/reset-votes \
  -H "X-Admin-Key: your-admin-key-here"
```

Response:
```json
{
  "message": "All votes deleted",
  "deleted_votes": 150,
  "candidates_preserved": 20
}
```

### 3. Export All Data (Backup)

```bash
curl https://api.votoescalonadocr.org/admin/export-data \
  -H "X-Admin-Key: your-admin-key-here" \
  > backup-$(date +%Y%m%d).json
```

Response:
```json
{
  "export_timestamp": "2026-01-31",
  "total_votes": 150,
  "parties": [...],
  "ballots": [...]
}
```

### 4. Toggle Voting (Enable/Disable)

**Disable voting** (closes the poll):
```bash
curl -X POST https://api.votoescalonadocr.org/admin/toggle-voting \
  -H "X-Admin-Key: your-admin-key-here" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

**Enable voting** (reopens the poll):
```bash
curl -X POST https://api.votoescalonadocr.org/admin/toggle-voting \
  -H "X-Admin-Key: your-admin-key-here" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

Response:
```json
{
  "success": true,
  "voting_enabled": false,
  "message": "Voting has been disabled"
}
```

**What happens when voting is disabled:**
- Users see "Este sondeo ya ha terminado" instead of "Ir a votar"
- Vote button is grayed out and non-clickable
- A notice appears: "La votación para este ciclo electoral ha finalizado..."
- `/api/ballot` endpoint rejects new submissions

### 5. Check Voting Status (Public endpoint, no auth)

```bash
curl https://api.votoescalonadocr.org/api/config/voting-enabled
```

Response:
```json
{
  "voting_enabled": true
}
```

## Deployment Workflow

**After code changes:**
1. Push to GitHub
2. Railway auto-deploys
3. Database **persists** (PostgreSQL is not wiped)
4. No need to re-seed

**First deployment only:**
1. Deploy code
2. Add PostgreSQL database
3. Set `ADMIN_KEY` variable
4. Call `/admin/seed` once

## Data Cleaning Strategy

### Problem: Troll Votes
You have ~12,000 votes but estimate only ~200 are legitimate. Trolls likely voted repeatedly for a single candidate.

### Approach 1: Direct SQL Cleanup (Recommended)

**Using Railway's PostgreSQL Console:**

1. Go to Railway → Your Postgres database → "Connect" → "Query" tab

2. **Analyze the data first:**
```sql
-- See distribution of rankings (look for suspicious patterns)
SELECT rankings, COUNT(*) as vote_count 
FROM ballots 
GROUP BY rankings 
ORDER BY vote_count DESC 
LIMIT 50;

-- Check for single-candidate votes (likely troll votes)
SELECT rankings, COUNT(*) as count
FROM ballots
WHERE jsonb_array_length(rankings) = 1
GROUP BY rankings
ORDER BY count DESC;

-- Check timestamps for rapid submissions
SELECT 
  DATE_TRUNC('minute', timestamp) as minute,
  COUNT(*) as votes_per_minute
FROM ballots
GROUP BY minute
ORDER BY votes_per_minute DESC
LIMIT 20;
```

3. **Delete troll votes** (BACKUP FIRST!):
```sql
-- Example: Delete votes that are duplicates beyond a threshold
-- If a specific ranking pattern appears > 50 times, keep only 5
WITH duplicate_patterns AS (
  SELECT rankings, COUNT(*) as count
  FROM ballots
  GROUP BY rankings
  HAVING COUNT(*) > 50
),
ranked_duplicates AS (
  SELECT 
    b.id,
    b.rankings,
    ROW_NUMBER() OVER (PARTITION BY b.rankings ORDER BY b.timestamp) as row_num
  FROM ballots b
  INNER JOIN duplicate_patterns dp ON b.rankings = dp.rankings
)
DELETE FROM ballots
WHERE id IN (
  SELECT id FROM ranked_duplicates WHERE row_num > 5
);
```

4. **Alternative: Delete single-candidate spam votes:**
```sql
-- Delete votes with only 1 candidate that appear too frequently
DELETE FROM ballots
WHERE id IN (
  SELECT b.id
  FROM ballots b
  WHERE jsonb_array_length(b.rankings) = 1
  AND b.rankings IN (
    SELECT rankings
    FROM ballots
    WHERE jsonb_array_length(rankings) = 1
    GROUP BY rankings
    HAVING COUNT(*) > 10  -- Adjust threshold as needed
  )
);
```

5. **Keep votes with diverse rankings:**
```sql
-- More sophisticated: Keep votes with 3+ candidates (likely legitimate)
-- and limit duplicate patterns
CREATE TEMP TABLE legitimate_votes AS
SELECT DISTINCT ON (rankings) id
FROM ballots
WHERE jsonb_array_length(rankings) >= 3;

-- OR keep a sample of single/dual candidate votes
INSERT INTO legitimate_votes
SELECT id FROM (
  SELECT id, rankings,
    ROW_NUMBER() OVER (PARTITION BY rankings ORDER BY timestamp) as rn
  FROM ballots
  WHERE jsonb_array_length(rankings) < 3
) sub
WHERE rn <= 3;  -- Keep max 3 of each pattern

-- Now you can either:
-- A) Delete everything NOT in legitimate_votes, or
-- B) Copy legitimate votes to a new table and swap
```

### Approach 2: Using Python Script

Create `clean_database.py`:
```python
import os
import psycopg2
from collections import Counter

# Get database URL from Railway
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Fetch all ballots
cursor.execute("SELECT id, rankings, timestamp FROM ballots")
ballots = cursor.fetchall()

print(f"Total ballots: {len(ballots)}")

# Analyze patterns
patterns = Counter(tuple(b[1]) for b in ballots)
print("\nTop 10 most common patterns:")
for pattern, count in patterns.most_common(10):
    print(f"  {pattern}: {count} votes")

# Identify suspicious votes (e.g., single candidate, high frequency)
suspicious_ids = []
for pattern, count in patterns.items():
    if count > 50 and len(pattern) == 1:  # Adjust threshold
        # Keep only first 5 of this pattern
        matching = [b[0] for b in ballots if tuple(b[1]) == pattern]
        suspicious_ids.extend(matching[5:])

print(f"\nSuspicious votes to delete: {len(suspicious_ids)}")
print(f"Votes to keep: {len(ballots) - len(suspicious_ids)}")

# Confirm before deletion
confirm = input("Delete suspicious votes? (yes/no): ")
if confirm.lower() == "yes":
    cursor.execute("DELETE FROM ballots WHERE id = ANY(%s)", (suspicious_ids,))
    conn.commit()
    print("Deleted!")
else:
    print("Cancelled")

cursor.close()
conn.close()
```

Run:
```bash
export DATABASE_URL="postgresql://..."  # Get from Railway
python clean_database.py
```

### Recommended Workflow

1. **Export backup first!**
   ```bash
   curl https://api.votoescalonadocr.org/admin/export-data \
     -H "X-Admin-Key: your-key" > backup-before-cleaning.json
   ```

2. **Analyze data in Railway SQL console** (see queries above)

3. **Clean the data** using SQL or Python script

4. **Verify results:**
   ```sql
   SELECT COUNT(*) FROM ballots;  -- Should be ~200
   ```

5. **Deploy frontend/backend changes** (voting toggle)

6. **Disable voting atomically:**
   ```bash
   curl -X POST https://api.votoescalonadocr.org/admin/toggle-voting \
     -H "X-Admin-Key: your-key" \
     -H "Content-Type: application/json" \
     -d '{"enabled": false}'
   ```

Now trolls will see the site is closed AND the results are clean! 🎉

## Local Development

Local uses SQLite (auto-seeds on startup).
Production uses PostgreSQL (manual seed via admin endpoint).
