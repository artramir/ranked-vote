# Voto Escalonado - Costa Rica 2026

A ranked-choice voting (RCV) polling system for the Costa Rican presidential election with 20 parties.

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

## Development Status

🚧 **In Development** - Setting up initial project structure

## Domain

Planning to use: `votoescalonado.org` or `votoescalonado.cr`

## License

MIT License - See [LICENSE](LICENSE) file for details

## Author

Arturo - 2026
