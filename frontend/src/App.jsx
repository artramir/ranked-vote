import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test connection to backend API
    fetch('/api/')
      .then(res => res.json())
      .then(data => {
        setApiStatus(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error connecting to API:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voto Escalonado</h1>
        <h2>Costa Rica 2026</h2>
        <p>Sistema de Votación con Preferencias</p>
        
        <div className="api-status">
          {loading ? (
            <p>Conectando al servidor...</p>
          ) : apiStatus ? (
            <div>
              <p>✅ Backend conectado: {apiStatus.message}</p>
              <p>Estado: {apiStatus.status}</p>
              <p>Versión: {apiStatus.version}</p>
            </div>
          ) : (
            <p>❌ No se pudo conectar al backend</p>
          )}
        </div>

        <div className="placeholder">
          <p>🚧 Interfaz de votación en desarrollo</p>
          <ul style={{ textAlign: 'left', marginTop: '20px' }}>
            <li>Arrastrar y soltar candidatos</li>
            <li>Ordenar preferencias (1-5)</li>
            <li>Visualización de resultados</li>
            <li>Seguimiento de redistribución de votos</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App
