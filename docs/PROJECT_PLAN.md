# Voto Escalonado - Project Plan

## Overview
Web-based ranked-choice voting poll for Costa Rica 2026 presidential election (20 parties).

## Core Requirements

### User Interface
1. **Candidate Display**
   - 20 draggable tiles/bubbles
   - Each tile shows: candidate photo, party flag, candidate name, party name
   - Mobile and desktop compatible

2. **Ranking Interface**
   - Drag-and-drop from candidate pool to ranking area
   - 5 ranking slots (1st through 5th preference)
   - Can reorder or return candidates to pool
   - Submit with 0-5 candidates selected

3. **Educational Content**
   - Explanation of ranked-choice voting in Spanish
   - Integrated into the UI

4. **Results Display**
   - Ballot journey visualization (after submission)
   - Shows reassignment path for user's ballot
   - Displays elimination rounds
   - Charts showing vote distribution by round

### Backend Logic
1. **Instant Runoff Voting (IRV) Algorithm**
   - Recompute results after each ballot submission
   - Eliminate lowest-ranked candidate(s) each round
   - Simultaneous elimination of tied candidates in last place
   - Reassign ballots based on next available preference
   - Handle exhausted ballots (no remaining preferences)

2. **Ballot Journey Tracking**
   - Track which party ballot is assigned to each round
   - Calculate percentage of ballots reassigned from A to B
   - Handle skipped eliminated parties in preference list
   - Display personalized reassignment narrative

3. **Data Management**
   - Store all ballots persistently
   - Store candidate/party information
   - Track results by round
   - Support null ballots (0 selections)

## Technical Architecture

### Three-Layer Design
```
Frontend (UI) ←→ Backend API ←→ Database
```

### Tech Stack Options

**Frontend:**
- React with Vite (chosen for speed and simplicity)
- Drag-and-drop: @dnd-kit/core or react-beautiful-dnd
- Deployment: Vercel or GitHub Pages

**Backend:**
- Python + FastAPI (chosen for clarity and ease)
- Deployment: Render, Railway, or Fly.io (all have free tiers)

**Database:**
- SQLite (development and low-scale deployment)
- PostgreSQL (if scaling needed)

## Development Phases

### Phase 1: Foundation (Current)
- [x] GitHub repository setup
- [x] Project structure creation
- [ ] Local development environment setup
- [ ] Basic frontend scaffolding
- [ ] Basic backend API structure

### Phase 2: Core Features
- [ ] Candidate data model and seed data (20 parties)
- [ ] Drag-and-drop UI implementation
- [ ] Ballot submission API
- [ ] IRV algorithm implementation
- [ ] Results computation

### Phase 3: Ballot Journey
- [ ] Track ballot reassignments by round
- [ ] Calculate transfer percentages
- [ ] Generate personalized narrative
- [ ] Display ballot journey after submission

### Phase 4: Visualization
- [ ] Results charts (elimination rounds)
- [ ] Vote distribution visualization
- [ ] Mobile responsive design refinement

### Phase 5: Deployment
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to Vercel
- [ ] Connect custom domain (votoescalonado.org)
- [ ] Set up CI/CD from GitHub

## Domain Strategy

**Initial Domain:** votoescalonado.org ($7.99/year via Hostinger)

**Future Migration:** votoescalonado.cr (if desired)
- Domain and hosting are separate services
- Code/data stays with hosting provider (Render/Vercel)
- Just update DNS records to point new domain to same servers
- No code changes required

## Data Structures

### Candidate/Party
```python
{
  "id": int,
  "party_name": str,
  "candidate_name": str,
  "photo_url": str,
  "flag_url": str
}
```

### Ballot
```python
{
  "id": int,
  "timestamp": datetime,
  "rankings": [party_id_1, party_id_2, ...]  # Ordered list, 0-5 items
}
```

### Round Results
```python
{
  "round_number": int,
  "eliminated_parties": [party_id, ...],
  "party_votes": {party_id: vote_count, ...},
  "total_active_ballots": int
}
```

## Algorithm Pseudocode

```
function compute_irv_results(ballots):
    active_parties = all_parties
    active_ballots = all_ballots
    rounds = []
    
    while len(active_parties) > 1:
        # Count first preferences among active parties
        vote_counts = count_votes(active_ballots, active_parties)
        
        # Check for majority winner
        if any party has > 50% of active ballots:
            return winner
        
        # Find parties with minimum votes
        min_votes = min(vote_counts.values())
        parties_to_eliminate = [p for p in vote_counts if vote_counts[p] == min_votes]
        
        # Store round data
        rounds.append({
            "eliminated": parties_to_eliminate,
            "votes": vote_counts
        })
        
        # Eliminate parties
        active_parties.remove(parties_to_eliminate)
        
        # Reassign ballots
        for ballot in active_ballots:
            ballot.advance_to_next_active_preference(active_parties)
            if ballot.has_no_remaining_preferences():
                active_ballots.remove(ballot)  # Exhausted
    
    return final_results
```

## Next Steps

1. Set up Python virtual environment for backend
2. Set up Node.js and install frontend dependencies
3. Create candidate data seed file (20 Costa Rican parties)
4. Implement basic drag-and-drop UI
5. Implement IRV algorithm core logic
