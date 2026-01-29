# Backend - Voto Escalonado

FastAPI backend server for the ranked-choice voting system.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Development mode:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

## Project Structure

```
backend/
├── main.py              # FastAPI application and routes
├── models.py            # Database models (SQLAlchemy)
├── database.py          # Database connection and session
├── irv_algorithm.py     # Instant runoff voting logic
├── requirements.txt     # Python dependencies
└── README.md
```

## API Endpoints

- `GET /` - Health check
- `GET /api/candidates` - Get all candidates/parties
- `POST /api/ballot` - Submit a ranked ballot
- `GET /api/results` - Get current IRV results

## TODO

- [ ] Set up database models (Candidate, Party, Ballot)
- [ ] Implement IRV algorithm
- [ ] Add ballot validation
- [ ] Implement ballot journey tracking
- [ ] Add comprehensive error handling
- [ ] Set up database migrations with Alembic
