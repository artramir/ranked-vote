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

## Local Development

Local uses SQLite (auto-seeds on startup).
Production uses PostgreSQL (manual seed via admin endpoint).
