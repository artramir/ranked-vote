"""
Database connection and session management
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

from models import Base

# Get database URL from environment variable or use SQLite default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./voto_escalonado.db")

# Create engine
# For SQLite, use check_same_thread=False and StaticPool for compatibility
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # For PostgreSQL or other databases
    engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """
    Initialize database - create all tables
    Call this on application startup
    """
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI endpoints
    Provides a database session and ensures it's closed after use
    
    Usage in FastAPI:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            # Use db here
            pass
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db_session() -> Session:
    """
    Get a database session for manual use (outside FastAPI endpoints)
    Remember to close it when done: session.close()
    """
    return SessionLocal()
