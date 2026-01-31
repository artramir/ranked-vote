"""
Database models for Voto Escalonado
Defines the structure for parties, candidates, ballots, and election results
"""

from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Party(Base):
    """
    Political party in the election
    """
    __tablename__ = "parties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    abbreviation = Column(String(20), unique=True, nullable=False)
    
    # Costa Rican name structure (5 fields)
    first_firstname = Column(String(50), nullable=False)
    second_firstname = Column(String(50), nullable=True)
    display_firstname = Column(String(100), nullable=False)
    first_lastname = Column(String(50), nullable=False)
    second_lastname = Column(String(50), nullable=False)
    
    photo_url = Column(String(255), nullable=True)  # URL or path to candidate photo
    flag_url = Column(String(255), nullable=True)   # URL or path to party flag
    color = Column(String(7), nullable=True)        # Hex color for UI (e.g., "#FF5733")
    description = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Party(id={self.id}, name={self.name}, candidate={self.display_firstname} {self.first_lastname})>"


class Ballot(Base):
    """
    Individual ballot submission with ranked preferences
    """
    __tablename__ = "ballots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Store rankings as JSON array of party IDs in order of preference
    # Example: [5, 12, 3, 8, 1] means 1st choice: party 5, 2nd: party 12, etc.
    rankings = Column(JSON, nullable=False)
    
    # Optional: Store IP hash or session ID for duplicate prevention (future feature)
    session_hash = Column(String(64), nullable=True, index=True)
    
    def __repr__(self):
        return f"<Ballot(id={self.id}, rankings={self.rankings}, timestamp={self.timestamp})>"


class ElectionSnapshot(Base):
    """
    Stores computed election results at a point in time
    Used to cache IRV computation results and track historical data
    """
    __tablename__ = "election_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    total_ballots = Column(Integer, nullable=False)
    
    # Store full IRV computation results as JSON
    # Structure: {
    #   "rounds": [
    #     {
    #       "round_number": 1,
    #       "party_votes": {1: 45, 2: 30, 3: 25, ...},
    #       "eliminated": [3, 7],
    #       "total_active_ballots": 100
    #     },
    #     ...
    #   ],
    #   "winner": 5,
    #   "final_round": 8
    # }
    results_json = Column(JSON, nullable=False)
    
    def __repr__(self):
        return f"<ElectionSnapshot(id={self.id}, total_ballots={self.total_ballots}, timestamp={self.timestamp})>"
