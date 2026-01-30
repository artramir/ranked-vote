import { useState } from 'react'
import VotingInterface from './components/VotingInterface'
import Results from './components/Results'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('vote') // 'vote' or 'results'

  return (
    <div className="App">
      {currentView === 'vote' ? (
        <VotingInterface onViewResults={() => setCurrentView('results')} />
      ) : (
        <Results onBackToVote={() => setCurrentView('vote')} />
      )}
    </div>
  )
}

export default App
