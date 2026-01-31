import { useState } from 'react'
import Welcome from './components/Welcome'
import VotingInterface from './components/VotingInterface'
import Results from './components/Results'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('welcome') // 'welcome', 'vote' or 'results'

  return (
    <div className="App">
      {currentView === 'welcome' ? (
        <Welcome 
          onStartVoting={() => setCurrentView('vote')}
          onViewResults={() => setCurrentView('results')}
        />
      ) : currentView === 'vote' ? (
        <VotingInterface onViewResults={() => setCurrentView('results')} />
      ) : (
        <Results onBackToVote={() => setCurrentView('vote')} />
      )}
    </div>
  )
}

export default App
