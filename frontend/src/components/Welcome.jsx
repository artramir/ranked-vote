import { useState, useEffect } from 'react'
import InfoModal from './InfoModal'
import './Welcome.css'

function Welcome({ onStartVoting, onViewResults }) {
  const [showInfo, setShowInfo] = useState(false)
  const [votingEnabled, setVotingEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkVotingStatus()
  }, [])

  const checkVotingStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${apiUrl}/api/config/voting-enabled`)
      const data = await response.json()
      setVotingEnabled(data.voting_enabled)
    } catch (error) {
      console.error('Error checking voting status:', error)
      // Default to enabled if there's an error
      setVotingEnabled(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Voto Escalonado 🗳️ Costa Rica 2026</h1>
        
        <p className="welcome-explanation">
            ¡Podés escoger hasta 5 candidatos! Tu voto se asigna a tu primera opción.
            Si ese candidato queda de último lugar, se elimina y tu voto se reasigna a tu segunda opción, y así sucesivamente. <span className="info-link" onClick={() => setShowInfo(true)}>(¿Ah?)</span>
            <br />
            <br />
            ¿Quién ganaría la presidencia si votáramos de esa forma?
        </p>

        {!votingEnabled && (
          <p className="voting-closed-notice">
            La votación para este ciclo electoral ha finalizado. Seguí pendiente a votoescalonado.org si te interesó el tema.
          </p>
        )}
        
        <div className="welcome-buttons">
          <button 
            className={`welcome-button vote-button ${!votingEnabled ? 'disabled' : ''}`}
            onClick={votingEnabled ? onStartVoting : undefined}
            disabled={!votingEnabled || loading}
          >
            <span className="button-main-text">
              {votingEnabled ? 'Ir a votar ➡️' : 'Este sondeo ya ha terminado'}
            </span>
            <span className="button-subtitle">
              {votingEnabled ? '(Por favor no votés más de una vez)' : '¡Muchas gracias por tu participación!'}
            </span>
          </button>
          
          <button 
            className="welcome-button results-button"
            onClick={onViewResults}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </div>
    {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  )
}

export default Welcome
