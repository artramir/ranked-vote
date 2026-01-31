import React, { useState, useEffect } from 'react';
import InfoModal from './InfoModal';
import FeedbackModal from './FeedbackModal';
import './Results.css';

const Results = ({ onBackToVote }) => {
  const [results, setResults] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCandidate, setHoveredCandidate] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [voteIntention, setVoteIntention] = useState(null);
  const [sessionHash] = useState(() => {
    let hash = localStorage.getItem('sessionHash');
    if (!hash) {
      hash = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionHash', hash);
    }
    return hash;
  });

  useEffect(() => {
    fetchCandidates();
    fetchResults();
  }, []);

  const fetchCandidates = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/candidates`);
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

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

  const submitVoteIntention = async (changed) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await fetch(`${apiUrl}/api/vote-intention`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changed, session_hash: sessionHash })
      });
      setVoteIntention(changed);
      localStorage.setItem('voteIntention', changed.toString());
    } catch (err) {
      console.error('Error submitting vote intention:', err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('voteIntention');
    if (saved) {
      setVoteIntention(parseInt(saved));
    }
  }, []);

  const getCandidateById = (id) => {
    return candidates.find(c => c.id === parseInt(id));
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
        <p className="results-info-links">
          <span className="info-link" onClick={() => setShowFeedback(true)}>Info</span>
          <br />
          <span className="info-link" onClick={() => setShowInfo(true)}>¿Cómo era que funcionaba?</span>
        </p>
      </div>

      <div className="results-summary">
        {results.winner && results.winner_party_id && (
          <div className="summary-card winner-card">
            <div className="summary-label winner-label">Ganador</div>
            {getCandidateById(results.winner_party_id) && (
              <img 
                src={getCandidateById(results.winner_party_id).photo_url} 
                alt={results.winner}
                className="winner-photo"
              />
            )}
            <div className="winner-name">
              {getCandidateById(results.winner_party_id)?.display_firstname || ''} {getCandidateById(results.winner_party_id)?.first_lastname || results.winner}
            </div>
            <div className="winner-votes-info">
              Votos primera opción + reasignados: {results.rounds[results.rounds.length - 1]?.votes[results.winner_party_id]?.votes || 0} ({results.rounds[results.rounds.length - 1]?.votes[results.winner_party_id]?.percentage || 0}%)
            </div>
          </div>
        )}
        
        <div className="summary-card">
          <div className="summary-number">{results.total_ballots}</div>
          <div className="summary-label">Votos Totales</div>
        </div>
        
        <div className="summary-card vote-intention-card">
          <div className="vote-intention-question">
            ¿Su intención de voto cambió debido a esta encuesta?
          </div>
          <div className="vote-intention-buttons">
            <button 
              className={`vote-intention-btn ${voteIntention === 1 ? 'selected' : ''}`}
              onClick={() => submitVoteIntention(1)}
            >
              Sí
            </button>
            <button 
              className={`vote-intention-btn ${voteIntention === 0 ? 'selected' : ''}`}
              onClick={() => submitVoteIntention(0)}
            >
              No
            </button>
          </div>
        </div>

        {results.tied && (
          <div className="summary-card tie-card">
            <div className="tie-icon">🤝</div>
            <div className="tie-label">Empate</div>
            <div className="summary-label">
              {results.tie_candidates?.length} candidatos empatados
            </div>
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
                .map(([candidateId, data]) => {
                  const candidate = getCandidateById(candidateId);
                  return (
                    <div key={candidateId} className="vote-row">
                      <div className="candidate-column">
                        <div 
                          className="candidate-photo-wrapper"
                          onMouseEnter={() => setHoveredCandidate(candidateId)}
                          onMouseLeave={() => setHoveredCandidate(null)}
                          onClick={() => setHoveredCandidate(hoveredCandidate === candidateId ? null : candidateId)}
                        >
                          {candidate && (
                            <img 
                              src={candidate.photo_url} 
                              alt={data.first_lastname}
                              className="candidate-photo-small"
                            />
                          )}
                          {hoveredCandidate === candidateId && (
                            <div className="candidate-name-tooltip">{data.first_lastname}</div>
                          )}
                        </div>
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
                  );
                })}
            </div>

            {round.eliminated && round.eliminated.length > 0 && (
              <div className="eliminated-section">
                <span className="eliminated-label">❌ Eliminado(s): </span>
                {round.eliminated.map((elim, idx) => (
                  <span key={idx} className="eliminated-candidate">
                    {elim.first_lastname} ({elim.abbreviation}) - {elim.votes} votos
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
                <span>{candidate.first_lastname}</span>
                <span>{candidate.votes} votos</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={fetchResults} className="btn-refresh">
        🔄 Actualizar Resultados
      </button>
      
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} sessionHash={sessionHash} />}
    </div>
  );
};

export default Results;
