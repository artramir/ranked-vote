"""
Voto Escalonado - Backend API
FastAPI server for ranked-choice voting system
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from database import init_db, get_db
from seed_data import seed_database, get_parties_data
from models import Party, Ballot


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager - runs on startup and shutdown
    """
    # Startup
    print("🚀 Starting Voto Escalonado API...")
    init_db()
    
    # Seed database with party data if empty
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()
    
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
            "candidate_name": party.candidate_name,
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
    total_ballots = db.query(Ballot).count()
    
    # TODO: Implement IRV algorithm and return computed results
    # For now, return basic stats
    
    return {
        "total_ballots": total_ballots,
        "rounds": [],
        "winner": None,
        "message": "IRV computation not yet implemented"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
