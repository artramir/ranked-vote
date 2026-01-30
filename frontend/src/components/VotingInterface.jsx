import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CandidateCard from './CandidateCard';
import './VotingInterface.css';

// Draggable candidate component
const DraggableCandidate = ({ candidate, rank, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `candidate-${candidate.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCard
        candidate={candidate}
        rank={rank}
        onRemove={onRemove}
      />
    </div>
  );
};

// Droppable slot component
const DroppableSlot = ({ id, slotNumber, candidate, onRemove, isOver }) => {
  const { setNodeRef } = useSortable({ id, disabled: true });

  return (
    <div
      ref={setNodeRef}
      className={`ranking-slot ${candidate ? 'filled' : 'empty'} ${isOver ? 'drag-over' : ''}`}
    >
      <div className="slot-number">{slotNumber}</div>
      {candidate ? (
        <DraggableCandidate
          candidate={candidate}
          rank={slotNumber}
          onRemove={onRemove}
        />
      ) : (
        <div className="empty-slot-text">
          Arrastra un candidato aquí
        </div>
      )}
    </div>
  );
};

const VotingInterface = ({ onViewResults }) => {
  const [candidates, setCandidates] = useState([]);
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const [rankings, setRankings] = useState([null, null, null, null, null]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ballotId, setBallotId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/candidates`);
      const data = await response.json();
      setCandidates(data.candidates);
      setAvailableCandidates(data.candidates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    // Can add visual feedback here if needed
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;

    const candidateId = parseInt(active.id.replace('candidate-', ''));
    const candidate = candidates.find(c => c.id === candidateId);
    const source = getCandidateSource(candidateId);
    
    // Check if dropping on a ranking slot
    if (over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.replace('slot-', ''));
      handleDropOnRanking(candidate, source, slotIndex);
    } 
    // Check if dropping back on available pool
    else if (over.id === 'pool') {
      handleDropOnAvailable(candidate, source);
    }
    // Reordering within rankings or available
    else if (over.id.startsWith('candidate-')) {
      const overCandidateId = parseInt(over.id.replace('candidate-', ''));
      handleCandidateSwap(candidateId, overCandidateId);
    }
  };

  const getCandidateSource = (candidateId) => {
    if (rankings.some(c => c?.id === candidateId)) return 'ranking';
    if (availableCandidates.some(c => c.id === candidateId)) return 'available';
    return null;
  };

  const handleDropOnRanking = (candidate, source, targetRank) => {
    if (!candidate) return;
    
    const newRankings = [...rankings];

    if (source === 'available') {
      // Moving from available pool to ranking
      if (newRankings[targetRank] === null) {
        newRankings[targetRank] = candidate;
        setRankings(newRankings);
        setAvailableCandidates(availableCandidates.filter(c => c.id !== candidate.id));
      } else {
        // Swap with existing
        const displaced = newRankings[targetRank];
        newRankings[targetRank] = candidate;
        setRankings(newRankings);
        setAvailableCandidates([...availableCandidates.filter(c => c.id !== candidate.id), displaced]);
      }
    } else if (source === 'ranking') {
      // Moving within rankings
      const oldIndex = rankings.findIndex(c => c?.id === candidate.id);
      if (oldIndex !== -1) {
        if (newRankings[targetRank] === null) {
          newRankings[targetRank] = candidate;
          newRankings[oldIndex] = null;
        } else {
          // Swap positions
          const temp = newRankings[targetRank];
          newRankings[targetRank] = candidate;
          newRankings[oldIndex] = temp;
        }
        setRankings(newRankings);
      }
    }
  };

  const handleDropOnAvailable = (candidate, source) => {
    if (source === 'ranking') {
      const index = rankings.findIndex(c => c?.id === candidate.id);
      if (index !== -1) {
        const newRankings = [...rankings];
        newRankings[index] = null;
        setRankings(newRankings);
        setAvailableCandidates([...availableCandidates, candidate]);
      }
    }
  };

  const handleCandidateSwap = (candidateId1, candidateId2) => {
    const source1 = getCandidateSource(candidateId1);
    const source2 = getCandidateSource(candidateId2);
    
    if (source1 === 'ranking' && source2 === 'ranking') {
      const newRankings = [...rankings];
      const index1 = rankings.findIndex(c => c?.id === candidateId1);
      const index2 = rankings.findIndex(c => c?.id === candidateId2);
      
      if (index1 !== -1 && index2 !== -1) {
        [newRankings[index1], newRankings[index2]] = [newRankings[index2], newRankings[index1]];
        setRankings(newRankings);
      }
    }
  };

  const removeFromRanking = (index) => {
    const candidate = rankings[index];
    const newRankings = [...rankings];
    newRankings[index] = null;
    setRankings(newRankings);
    setAvailableCandidates([...availableCandidates, candidate]);
  };

  const handleSubmit = async () => {
    // Get only filled rankings
    const filledRankings = rankings.filter(r => r !== null).map(c => c.id);
    
    if (filledRankings.length === 0) {
      alert('Por favor selecciona al menos un candidato');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/ballot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rankings: filledRankings }),
      });

      const data = await response.json();

      if (data.success) {
        setBallotId(data.ballot_id);
        setSubmitted(true);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting ballot:', error);
      alert('Error al enviar el voto');
    } finally {
      setSubmitting(false);
    }
  };

  const resetVote = () => {
    setRankings([null, null, null, null, null]);
    setAvailableCandidates(candidates);
    setSubmitted(false);
    setBallotId(null);
  };

  if (loading) {
    return <div className="loading">Cargando candidatos...</div>;
  }

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h2>¡Voto Registrado!</h2>
        <p>Tu boleta #{ballotId} ha sido contada exitosamente.</p>
        <p className="ballot-summary">
          Votaste por {rankings.filter(r => r !== null).length} candidato(s)
        </p>
        <div className="success-actions">
          <button onClick={onViewResults} className="btn-results">
            Ver Resultados
          </button>
        </div>
      </div>
    );
  }

  const activeCandidate = activeId ? candidates.find(c => c.id === parseInt(activeId.replace('candidate-', ''))) : null;

  const allItems = [
    ...rankings.filter(r => r !== null).map(c => `candidate-${c.id}`),
    ...availableCandidates.map(c => `candidate-${c.id}`),
    ...rankings.map((_, i) => `slot-${i}`),
    'pool'
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="voting-interface">
        <div className="voting-header">
          <h1>Voto Escalonado Costa Rica 2026</h1>
          <p className="instructions">
            Arrastra hasta 5 candidatos en orden de preferencia. Tu primer voto cuenta primero, 
            y si ese candidato es eliminado, tu voto se transfiere a tu segunda opción.
          </p>
        </div>

        <div className="ranking-section">
          <h2>Tu Orden de Preferencia</h2>
          <div className="ranking-slots">
            {rankings.map((candidate, index) => (
              <DroppableSlot
                key={index}
                id={`slot-${index}`}
                slotNumber={index + 1}
                candidate={candidate}
                onRemove={() => removeFromRanking(index)}
                isOver={false}
              />
            ))}
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting || rankings.filter(r => r !== null).length === 0}
          >
            {submitting ? 'Enviando...' : 'Enviar Voto'}
          </button>
        </div>

        <div className="candidates-pool" id="pool">
          <h2>Candidatos Disponibles ({availableCandidates.length})</h2>
          <div className="candidates-grid">
            {availableCandidates.map((candidate) => (
              <DraggableCandidate
                key={candidate.id}
                candidate={candidate}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <div style={{ cursor: 'grabbing', opacity: 1 }}>
            <CandidateCard candidate={activeCandidate} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default VotingInterface;
