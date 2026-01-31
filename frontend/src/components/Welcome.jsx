import { useState } from 'react'
import InfoModal from './InfoModal'
import './Welcome.css'

function Welcome({ onStartVoting, onViewResults }) {
  const [showInfo, setShowInfo] = useState(false)

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
        
        <div className="welcome-buttons">
          <button 
            className="welcome-button vote-button"
            onClick={onStartVoting}
          >
            <span className="button-main-text">Ir a votar ➡️</span>
            <span className="button-subtitle">(Por favor no votés más de una vez)</span>
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
