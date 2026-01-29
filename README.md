# Voto Escalonado - Costa Rica 2026

A ranked-choice voting (RCV) polling system for the Costa Rican presidential election with 20 parties.

## Prerequisites

Before setting up this project, you need to install:

### Required Software

1. **Python 3.11+** (Backend)
   - Download: https://www.python.org/downloads/
   - ⚠️ During installation, check ✅ "Add Python to PATH"
   - Alternative: Install Miniconda/Anaconda

2. **Node.js LTS** (Frontend)
   - Download: https://nodejs.org/ (choose LTS version)
   - Install with default settings
   - ⚠️ When prompted about "Tools for Node.js Native Modules", you can skip it (not needed for this project)

3. **Git** (Version Control)
   - Download: https://git-scm.com/downloads
   - Recommended: Also install GitHub Desktop for easier workflow

### Verify Installation

Open a terminal and check versions:
```bash
python --version    # Should show Python 3.11+
node --version      # Should show Node.js v20+ or v22+
npm --version       # Should show npm 9+ or 10+
git --version       # Should show git version
```

## Project Overview

This web application allows users to:
- Select and rank their top 5 presidential candidates using an intuitive drag-and-drop interface
- View real-time ranked-choice voting results with instant runoff voting (IRV) algorithm
- See personalized ballot reallocation paths after submission
- Access the polling system on both desktop and mobile devices

## Features

### User Interface
- **Drag-and-drop ranking:** Interactive tiles with candidate photos and party flags
- **Flexible voting:** Submit anywhere from 0 to 5 ranked choices
- **Mobile-friendly:** Responsive design with touch support
- **Spanish language:** All user-facing text in Spanish
- **Educational content:** Built-in explanations of ranked-choice voting

### Backend Logic
- **Instant runoff voting (IRV):** Automatic ballot reallocation when candidates are eliminated
- **Tie handling:** Simultaneous elimination of tied candidates in last place
- **Real-time updates:** Results recomputed after each submission
- **Null ballot support:** Handles submissions with 0 choices

### Planned Features
- Personalized ballot journey visualization
- Interactive charts showing elimination rounds
- Statistical analysis of vote transfers

## Tech Stack

**Frontend:**
- React or Vue.js
- Drag-and-drop library (e.g., dnd-kit, react-beautiful-dnd)
- Responsive CSS (Grid/Flexbox)

**Backend:**
- Python + FastAPI
- SQLite or PostgreSQL database

**Deployment:**
- Frontend: Vercel or GitHub Pages
- Backend: Render, Railway, or Fly.io

## Project Structure

```
ranked-vote/
├── frontend/          # React/Vue application
├── backend/           # Python FastAPI server
├── docs/              # Documentation
└── README.md
```

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/artramir/ranked-vote.git
cd ranked-vote
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment (choose one):

# Option A: Using venv (standard Python)
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

# Option B: Using conda
conda create -n rankedvote_env python=3.11
conda activate rankedvote_env

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

Backend will run at http://localhost:8000  
API docs available at http://localhost:8000/docs

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run at http://localhost:5173

## Development Status

🚧 **In Development** - Backend API functional, frontend and IRV algorithm in progress

## Domain

Planning to use: `votoescalonado.org` or `votoescalonado.cr`

## License

MIT License - See [LICENSE](LICENSE) file for details

## Author

Arturo - 2026
