import './InfoModal.css'

function InfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>¿Qué es el Voto Escalonado?</h2>
        
        <div className="modal-body">
          <p>
            El <strong>voto escalonado</strong> (o <em>Instant Runoff Voting</em>) permite votar por varios candidatos en orden de preferencia.
          </p>
          
          <h3>¿Cómo funciona?</h3>
          <ol>
            <li>Ordenás tus candidatos del más preferido al menos preferido (hasta 5).</li>
            <li>Inicialmente, tu voto cuenta para tu primera opción.</li>
            <li>Si ningún candidato obtiene mayoría, se elimina al que tiene menos votos.</li>
            <li>Los votos del eliminado se transfieren a la siguiente preferencia de cada votante.</li>
            <li>El proceso se repite hasta que alguien obtiene mayoría.</li>
          </ol>
          
          <h3>Ejemplo</h3>
          <p>
            Imaginá que votás: 1) Candidato A, 2) Candidato B, 3) Candidato C.
          </p>
          <ul>
            <li>Tu voto cuenta inicialmente para A.</li>
            <li>Si A queda de último y es eliminado, tu voto pasa a B.</li>
            <li>Si B también es eliminado más adelante, tu voto pasa a C.</li>
          </ul>
          <p>
            Tu voto <strong>siempre cuenta</strong> para el candidato más preferido que siga en la competencia.
          </p>
          
          <h3>Ventajas</h3>
          <ul>
            <li><strong>No hay voto "perdido":</strong> Tu voto se transfiere si tu candidato es eliminado.</li>
            <li><strong>Mayor expresión:</strong> Apoyás a tu candidato ideal sin temor a "desperdiciar" tu voto.</li>
            <li><strong>Ganador con mayoría:</strong> El resultado final refleja mejor la voluntad popular.</li>
          </ul>
          
          <h3>Más información</h3>
          <p>
            <a 
              href="https://es.wikipedia.org/wiki/Voto_por_orden_de_preferencia" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Wikipedia: Voto por orden de preferencia
            </a>
          </p>
          <p>
            <a 
              href="https://www.youtube.com/watch?v=3Y3jE3B8HsE" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Video explicativo (en inglés)
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
