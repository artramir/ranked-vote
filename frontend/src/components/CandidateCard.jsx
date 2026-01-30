import React from 'react';
import './CandidateCard.css';

const CandidateCard = ({ candidate, rank, onRemove, isDragging }) => {
  return (
    <div 
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
      style={{ borderColor: candidate.color }}
    >
      <div className="candidate-flag">
        <img 
          src={candidate.flag_url} 
          alt={`${candidate.abbreviation} flag`}
          draggable="false"
          onError={(e) => e.target.src = '/images/flags/placeholder.jpg'}
        />
      </div>
      
      <div className="candidate-photo">
        <img 
          src={candidate.photo_url} 
          alt={candidate.candidate_name}
          draggable="false"
          onError={(e) => e.target.src = '/images/candidates/placeholder.jpg'}
        />
      </div>
      
      <div className="candidate-info">
        <div className="candidate-name">{candidate.candidate_name}</div>
        <div className="party-abbreviation">{candidate.abbreviation}</div>
        <div className="party-name">{candidate.party_name}</div>
      </div>
      
      {rank && (
        <div className="rank-badge" style={{ backgroundColor: candidate.color }}>
          {rank}
        </div>
      )}
      
      {onRemove && (
        <button 
          className="remove-btn" 
          onClick={onRemove}
          aria-label="Remover candidato"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default CandidateCard;
