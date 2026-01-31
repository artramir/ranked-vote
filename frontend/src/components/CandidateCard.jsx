import React from 'react';
import './CandidateCard.css';

const CandidateCard = ({ candidate, rank, onRemove, isDragging, onClick, compact = false, globalRotation = 0 }) => {
  return (
    <div 
      className={`candidate-card ${isDragging ? 'dragging' : ''} ${compact ? 'compact' : ''}`}
      style={{ borderColor: candidate.color }}
      onClick={onClick}
    >
      <div 
        className="candidate-photo"
        style={{ 
          transform: isDragging ? 'rotateY(0deg)' : `rotateY(${globalRotation}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.05s linear'
        }}
      >
        <img 
          src={candidate.photo_url} 
          alt={candidate.first_lastname}
          draggable="false"
          className="photo-image"
          onError={(e) => e.target.src = '/images/candidates/placeholder.jpg'}
        />
        <img 
          src={candidate.flag_url} 
          alt={`Bandera ${candidate.abbreviation}`}
          draggable="false"
          className="flag-image"
          onError={(e) => e.target.src = '/images/flags/placeholder.jpg'}
        />
      </div>
      
      <div className="candidate-info">
        <div className="candidate-name">{candidate.first_lastname}</div>
      </div>
      
      {rank && (
        <div className="rank-badge" style={{ backgroundColor: candidate.color }}>
          {rank}
        </div>
      )}
      
      {onRemove && (
        <button 
          className="remove-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remover candidato"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default CandidateCard;
