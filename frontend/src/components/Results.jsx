import React, { useState, useEffect } from 'react';
import './Results.css';

const Results = ({ onBackToVote }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/results`);
      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Error al cargar los resultados');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="results-loading">Calculando resultados...</div>;
  }

  if (error) {
    return <div className="results-error">{error}</div>;
  }

  if (!results || results.total_ballots === 0) {
    return (
      <div className="results-empty">
        <h2>Sin Resultados</h2>
        <p>Aún no se han registrado votos.</p>
        <button onClick={onBackToVote} className="btn-back">
          Volver a Votar
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Resultados - Voto Escalonado</h1>
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <div className="summary-number">{results.total_ballots}</div>
          <div className="summary-label">Votos Totales</div>
        </div>
        
        {results.winner && (
          <div className="summary-card winner-card">
            <div className="winner-icon">🏆</div>
            <div className="winner-name">{results.winner}</div>
            <div className="summary-label">Ganador</div>
          </div>
        )}

        {results.tied && (
          <div className="summary-card tie-card">
            <div className="tie-icon">🤝</div>
            <div className="tie-label">Empate</div>
            <div className="summary-label">
              {results.tie_candidates?.length} candidatos empatados
            </div>
          </div>
        )}
        
        <div className="summary-card">
          <div className="summary-number">{results.rounds?.length || 0}</div>
          <div className="summary-label">Rondas de Eliminación</div>
        </div>

        {results.exhausted_ballots > 0 && (
          <div className="summary-card">
            <div className="summary-number">{results.exhausted_ballots}</div>
            <div className="summary-label">Votos Agotados</div>
          </div>
        )}
      </div>

      <div className="rounds-section">
        <h2>Rondas de Conteo</h2>
        {results.rounds?.map((round, index) => (
          <div key={index} className="round-card">
            <div className="round-header">
              <h3>Ronda {round.round}</h3>
              <span className="round-info">
                {round.active_candidates} candidatos activos • {round.active_votes} votos
              </span>
            </div>

            {round.reason && (
              <div className="round-reason">{round.reason}</div>
            )}

            <div className="votes-table">
              {Object.entries(round.votes || {})
                .sort((a, b) => b[1].votes - a[1].votes)
                .map(([candidateId, data]) => (
                  <div key={candidateId} className="vote-row">
                    <div className="candidate-column">
                      <span className="candidate-abbr">{data.abbreviation}</span>
                      <span className="candidate-full-name">{data.candidate_name}</span>
                    </div>
                    <div className="votes-column">
                      <div className="vote-bar-container">
                        <div 
                          className="vote-bar" 
                          style={{ 
                            width: `${data.percentage}%`,
                            backgroundColor: data.percentage > 50 ? '#4caf50' : '#2196f3'
                          }}
                        />
                      </div>
                      <span className="vote-count">{data.votes} votos ({data.percentage}%)</span>
                    </div>
                  </div>
                ))}
            </div>

            {round.eliminated && round.eliminated.length > 0 && (
              <div className="eliminated-section">
                <span className="eliminated-label">❌ Eliminado(s): </span>
                {round.eliminated.map((elim, idx) => (
                  <span key={idx} className="eliminated-candidate">
                    {elim.candidate_name} ({elim.abbreviation}) - {elim.votes} votos
                    {idx < round.eliminated.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.tied && results.tie_candidates && (
        <div className="tie-details">
          <h3>Candidatos Empatados</h3>
          <div className="tie-candidates">
            {results.tie_candidates.map((candidate, idx) => (
              <div key={idx} className="tie-candidate">
                <span>{candidate.candidate_name}</span>
                <span>{candidate.votes} votos</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={fetchResults} className="btn-refresh">
        🔄 Actualizar Resultados
      </button>
    </div>
  );
};

export default Results;
