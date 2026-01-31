import './FeedbackModal.css'
import { useState, useEffect } from 'react'

function FeedbackModal({ onClose, sessionHash }) {
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), session_hash: sessionHash })
      })
      setIsSubmitted(true)
      setHasChanges(false)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    if (isSubmitted) {
      setHasChanges(true)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Información</h2>
        
        <div className="feedback-modal-body">
          <p className="feedback-prompt">
            ¿Encontró un bug? ¿Le interesa hacer analítica de estos datos?
          </p>
          
          <textarea
            className="feedback-textarea"
            placeholder="Envíenos un mensaje"
            value={message}
            onChange={handleMessageChange}
            rows={4}
          />
          
          <button 
            className={`feedback-submit-btn ${isSubmitted && !hasChanges ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            {isSubmitted && !hasChanges ? 'Enviado' : (isSubmitted && hasChanges ? 'Actualizar mensaje' : 'Enviar mensaje')}
          </button>
          
          <div className="feedback-info">
            <p><strong>
              DISCLAIMER:</strong> Esta no es una encuesta oficial del TSE, sino un simple sondeo entre conocidos con el
              objetivo de detectar patrones de coincidencia entre partidarios de distintos candidatos. El muestreo NO es
              aleatorio ya que su difusión es sesgada, p. ej. los seguidores de un partido podrían ser más propensos a
              difundirla que otros. Además, NO pregunta sobre intención de voto, sino preferencia pura. Por lo tanto NO
              debe considerarse una predicción de resultados electorales. Los resultados mostrados aquí son genuinos,
              pero en general se debe ser juicioso al interpretar estadísticas electorales publicadas por fuentes
              informales.</p>
            <p>Este sitio fue creado en pocas horas con el agente de I.A. Copilot de GitHub.</p>
            <p className="feedback-version">Versión 1.0</p>
            <p className="feedback-author">Ramírez, 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
