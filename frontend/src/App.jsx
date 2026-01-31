import { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import VotingInterface from './components/VotingInterface'
import Results from './components/Results'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('welcome') // 'welcome', 'vote' or 'results'

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view)
      } else {
        setCurrentView('welcome')
      }
    }

    window.addEventListener('popstate', handlePopState)
    
    // Set initial state
    window.history.replaceState({ view: 'welcome' }, '')

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (view) => {
    setCurrentView(view)
    window.history.pushState({ view }, '')
  }

  return (
    <div className="App">
      {currentView === 'welcome' ? (
        <Welcome 
          onStartVoting={() => navigateTo('vote')}
          onViewResults={() => navigateTo('results')}
        />
      ) : currentView === 'vote' ? (
        <VotingInterface onViewResults={() => navigateTo('results')} />
      ) : (
        <Results onBackToVote={() => navigateTo('vote')} />
      )}
    </div>
  )
}

export default App
