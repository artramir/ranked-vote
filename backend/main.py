"""
Voto Escalonado - Backend API
FastAPI server for ranked-choice voting system
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Voto Escalonado API",
    description="Backend API for Costa Rica 2026 ranked-choice voting poll",
    version="0.1.0"
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
async def get_candidates():
    """Get list of all candidates/parties"""
    # TODO: Replace with database query
    return {
        "candidates": [],
        "total": 20
    }


@app.post("/api/ballot")
async def submit_ballot(ballot: dict):
    """
    Submit a ranked ballot
    Expected format: {"rankings": [party_id_1, party_id_2, ...]}
    Rankings should be in order of preference (0-5 parties)
    """
    # TODO: Implement ballot storage and IRV recomputation
    return {
        "success": True,
        "ballot_id": "temp_id",
        "message": "Ballot received"
    }


@app.get("/api/results")
async def get_results():
    """Get current election results with IRV computation"""
    # TODO: Implement IRV algorithm and return results
    return {
        "total_ballots": 0,
        "rounds": [],
        "winner": None
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
