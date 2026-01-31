"""
Voto Escalonado - Backend API
FastAPI server for ranked-choice voting system
"""

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import os
import json

from database import init_db, get_db
from seed_data import seed_database, get_parties_data
from models import Party, Ballot
from irv_algorithm import compute_irv_results, get_ballot_journey


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager - runs on startup and shutdown
    """
    # Startup
    print("🚀 Starting Voto Escalonado API...")
    init_db()
    print("✅ Database tables created successfully")
    
    # Note: Database seeding is now manual via /admin/seed endpoint
    # to preserve data across deployments
    
    print("✅ API ready!")
    yield
    # Shutdown
    print("👋 Shutting down API...")


app = FastAPI(
    title="Voto Escalonado API",
    description="Backend API for Costa Rica 2026 ranked-choice voting poll",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Voto Escalonado API",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/api/candidates")
async def get_candidates(db: Session = Depends(get_db)):
    """Get list of all candidates/parties"""
    parties = db.query(Party).all()
    
    candidates = [
        {
            "id": party.id,
            "party_name": party.name,
            "abbreviation": party.abbreviation,
            "first_firstname": party.first_firstname,
            "second_firstname": party.second_firstname,
            "display_firstname": party.display_firstname,
            "first_lastname": party.first_lastname,
            "second_lastname": party.second_lastname,
            "photo_url": party.photo_url,
            "flag_url": party.flag_url,
            "color": party.color,
            "description": party.description
        }
        for party in parties
    ]
    
    return {
        "candidates": candidates,
        "total": len(candidates)
    }


@app.post("/api/ballot")
async def submit_ballot(ballot: dict, db: Session = Depends(get_db)):
    """
    Submit a ranked ballot
    Expected format: {"rankings": [party_id_1, party_id_2, ...]}
    Rankings should be in order of preference (0-5 parties)
    """
    rankings = ballot.get("rankings", [])
    
    # Validate rankings
    if not isinstance(rankings, list):
        return {"success": False, "error": "Rankings must be a list"}
    
    if len(rankings) > 5:
        return {"success": False, "error": "Maximum 5 rankings allowed"}
    
    # Verify all party IDs exist
    if rankings:
        valid_ids = {p.id for p in db.query(Party.id).all()}
        invalid_ids = set(rankings) - valid_ids
        if invalid_ids:
            return {"success": False, "error": f"Invalid party IDs: {invalid_ids}"}
    
    # Store ballot
    new_ballot = Ballot(rankings=rankings)
    db.add(new_ballot)
    db.commit()
    db.refresh(new_ballot)
    
    # TODO: Trigger IRV recomputation
    
    return {
        "success": True,
        "ballot_id": new_ballot.id,
        "message": "Ballot received and counted"
    }


@app.get("/api/results")
async def get_results(db: Session = Depends(get_db)):
    """Get current election results with IRV computation"""
    # Fetch all ballots
    ballots = db.query(Ballot).all()
    
    if len(ballots) == 0:
        return {
            "total_ballots": 0,
            "winner": None,
            "rounds": [],
            "message": "No ballots submitted yet"
        }
    
    # Fetch all parties
    parties_list = db.query(Party).all()
    parties_dict = {
        party.id: {
            "name": party.name,
            "abbreviation": party.abbreviation,
            "first_firstname": party.first_firstname,
            "second_firstname": party.second_firstname,
            "display_firstname": party.display_firstname,
            "first_lastname": party.first_lastname,
            "second_lastname": party.second_lastname,
            "color": party.color,
            "photo_url": party.photo_url,
            "flag_url": party.flag_url
        }
        for party in parties_list
    }
    
    # Convert ballots to format expected by IRV algorithm
    ballot_dicts = [{"rankings": ballot.rankings} for ballot in ballots]
    
    # Compute IRV results
    irv_result = compute_irv_results(ballot_dicts, parties_dict)
    
    return irv_result.to_dict()


@app.get("/api/ballot/{ballot_id}/journey")
async def get_ballot_journey_endpoint(ballot_id: int, db: Session = Depends(get_db)):
    """
    Get the journey of a specific ballot through elimination rounds
    Shows how the vote transferred as candidates were eliminated
    """
    # Fetch the specific ballot
    ballot = db.query(Ballot).filter(Ballot.id == ballot_id).first()
    
    if not ballot:
        return {"error": "Ballot not found"}
    
    # Fetch all ballots for IRV computation
    all_ballots = db.query(Ballot).all()
    
    # Fetch all parties
    parties_list = db.query(Party).all()
    parties_dict = {
        party.id: {
            "name": party.name,
            "abbreviation": party.abbreviation,
            "candidate_name": party.candidate_name,
            "color": party.color,
            "photo_url": party.photo_url,
            "flag_url": party.flag_url
        }
        for party in parties_list
    }
    
    # Compute IRV results
    ballot_dicts = [{"rankings": b.rankings} for b in all_ballots]
    irv_result = compute_irv_results(ballot_dicts, parties_dict)
    
    # Get journey for this specific ballot
    journey = get_ballot_journey(ballot.rankings, parties_dict, irv_result)
    
    return {
        "ballot_id": ballot_id,
        "journey": journey,
        "election_winner": irv_result.winner
    }


# ===== ADMIN ENDPOINTS =====

def verify_admin_key(x_admin_key: str = Header(None)):
    """Verify admin key from environment variable"""
    admin_key = os.getenv("ADMIN_KEY")
    if not admin_key:
        raise HTTPException(status_code=500, detail="Admin key not configured")
    if x_admin_key != admin_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return True


@app.post("/admin/seed")
def admin_seed_database(db: Session = Depends(get_db), _verified: bool = Depends(verify_admin_key)):
    """
    Manually seed database with 20 candidates.
    Requires X-Admin-Key header.
    """
    existing_count = db.query(Party).count()
    if existing_count > 0:
        return {
            "message": f"Database already has {existing_count} parties",
            "seeded": False
        }
    
    seed_database(db)
    return {
        "message": f"Successfully seeded {len(get_parties_data())} parties",
        "seeded": True
    }


@app.delete("/admin/reset-votes")
def admin_reset_votes(db: Session = Depends(get_db), _verified: bool = Depends(verify_admin_key)):
    """
    Delete all votes but keep candidates.
    Requires X-Admin-Key header.
    """
    vote_count = db.query(Ballot).count()
    db.query(Ballot).delete()
    db.commit()
    
    return {
        "message": "All votes deleted",
        "deleted_votes": vote_count,
        "candidates_preserved": db.query(Party).count()
    }


@app.get("/admin/export-data")
def admin_export_data(db: Session = Depends(get_db), _verified: bool = Depends(verify_admin_key)):
    """
    Export all votes as JSON.
    Requires X-Admin-Key header.
    """
    ballots = db.query(Ballot).all()
    parties = db.query(Party).all()
    
    return {
        "export_timestamp": str(os.popen('date').read().strip()),
        "total_votes": len(ballots),
        "parties": [
            {
                "id": p.id,
                "name": p.name,
                "abbreviation": p.abbreviation,
                "first_lastname": p.first_lastname
            }
            for p in parties
        ],
        "ballots": [
            {
                "id": b.id,
                "rankings": b.rankings,
                "timestamp": b.timestamp.isoformat() if b.timestamp else None
            }
            for b in ballots
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
