# Frontend - Voto Escalonado

React + Vite frontend for the ranked-choice voting system.

## Setup

1. Install Node.js (if not already installed): https://nodejs.org/

2. Install dependencies:
```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production files will be in the `dist/` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── CandidateTile.jsx
│   │   ├── DragDropArea.jsx
│   │   └── ResultsChart.jsx
│   ├── services/         # API calls to backend
│   │   └── api.js
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── public/              # Static assets (images, flags)
├── index.html
├── package.json
└── vite.config.js
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS Grid/Flexbox** - Responsive layout
- **Drag-and-drop library** (TBD: @dnd-kit/core or react-beautiful-dnd)

## TODO

- [ ] Set up component structure
- [ ] Implement drag-and-drop ranking interface
- [ ] Add candidate tiles with images and flags
- [ ] Create responsive layout for mobile
- [ ] Connect to backend API
- [ ] Add Spanish translations
- [ ] Implement results visualization
- [ ] Add explanatory text about ranked voting
