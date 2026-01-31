import React, { useState, useEffect } from 'react';
import InfoModal from './InfoModal';
import AlertModal from './AlertModal';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CandidateCard from './CandidateCard';
import './VotingInterface.css';

// Set global animation sync on component mount
const ANIMATION_START_TIME = Date.now();

// Draggable candidate component
const DraggableCandidate = ({ candidate, rank, onRemove, onClick, compact, globalRotation }) => {
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
        onClick={onClick}
        compact={compact}
        globalRotation={globalRotation}
      />
    </div>
  );
};

// Droppable slot component
const DroppableSlot = ({ id, slotNumber, candidate, onRemove, isOver, globalRotation }) => {
  const { setNodeRef } = useSortable({ id, disabled: true });

  return (
    <div className="ranking-slot-container">
      <div
        ref={setNodeRef}
        className={`ranking-slot ${candidate ? 'filled' : 'empty'} ${isOver ? 'drag-over' : ''}`}
        onClick={candidate ? onRemove : undefined}
        style={{ cursor: candidate ? 'pointer' : 'default' }}
      >
        {candidate ? (
          <DraggableCandidate
            candidate={candidate}
            rank={slotNumber}
            globalRotation={globalRotation}
          />
        ) : (
          <div className="slot-number">{slotNumber}</div>
        )}
      </div>
      {candidate && (
        <div className="slot-candidate-name">{candidate.first_lastname}</div>
      )}
    </div>
  );
};

// Droppable pool area
const DroppablePool = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });
  
  return (
    <div ref={setNodeRef} className={`candidates-pool ${isOver ? 'pool-drag-over' : ''}`}>
      {children}
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
  const [globalRotation, setGlobalRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchCandidates();
    
    // Update global rotation continuously for synchronized animation
    const updateRotation = () => {
      const elapsed = Date.now() - ANIMATION_START_TIME;
      const cyclePosition = (elapsed % 8000) / 8000; // 0 to 1
      
      let rotation;
      if (cyclePosition < 0.45) {
        // 0-45%: Show photo (0deg)
        rotation = 0;
      } else if (cyclePosition < 0.50) {
        // 45-50%: Fast flip from photo to flag
        const flipProgress = (cyclePosition - 0.45) / 0.05;
        rotation = flipProgress * 180;
      } else if (cyclePosition < 0.95) {
        // 50-95%: Show flag (180deg)
        rotation = 180;
      } else {
        // 95-100%: Fast flip from flag back to photo
        const flipProgress = (cyclePosition - 0.95) / 0.05;
        rotation = 180 - (flipProgress * 180); // Go from 180 back to 0
      }
      
      setGlobalRotation(rotation);
    };
    
    updateRotation();
    const interval = setInterval(updateRotation, 50); // Update every 50ms
    
    return () => clearInterval(interval);
  }, []);

  const fetchCandidates = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/candidates`);
      const data = await response.json();
      const sortedCandidates = [...data.candidates].sort((a, b) => 
        a.first_lastname.localeCompare(b.first_lastname, 'es')
      );
      setCandidates(sortedCandidates);
      setAvailableCandidates(sortedCandidates);
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
    const { active, over, delta } = event;
    
    setActiveId(null);
    
    const candidateId = parseInt(active.id.replace('candidate-', ''));
    const candidate = candidates.find(c => c.id === candidateId);
    const source = getCandidateSource(candidateId);

    // If no valid drop target or dropped outside ranking slots, return to pool if from ranking
    if (!over || !over.id.startsWith('slot-')) {
      if (source === 'ranking') {
        handleDropOnAvailable(candidate, source);
      }
      return;
    }
    
    // Check if dropping on a ranking slot
    if (over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.replace('slot-', ''));
      
      // Get the position of the drop relative to the slot
      const overElement = over.rect;
      const activeElement = active.rect.current.translated;
      
      if (overElement && activeElement) {
        // Calculate the center of the dragged element relative to the slot
        const draggedCenterX = activeElement.left + activeElement.width / 2;
        const slotCenterX = overElement.left + overElement.width / 2;
        
        // Determine insertion position based on which half
        let insertPosition = slotIndex;
        
        // If candidate is already in rankings, check if we're moving right
        if (source === 'ranking') {
          const currentIndex = rankings.findIndex(c => c?.id === candidateId);
          
          // If dragging to the right half and we're before this slot, insert after
          if (draggedCenterX > slotCenterX && currentIndex < slotIndex) {
            insertPosition = slotIndex + 1;
          }
          // If dragging to the left half and we're after this slot, insert before  
          else if (draggedCenterX <= slotCenterX && currentIndex > slotIndex) {
            insertPosition = slotIndex;
          }
          // Otherwise insert at the slot position
          else if (draggedCenterX > slotCenterX) {
            insertPosition = slotIndex + 1;
          }
        } else {
          // Coming from pool - check which half
          if (draggedCenterX > slotCenterX) {
            insertPosition = slotIndex + 1;
          }
        }
        
        handleDropOnRanking(candidate, source, insertPosition);
      } else {
        handleDropOnRanking(candidate, source, slotIndex);
      }
    }
  };

  const getCandidateSource = (candidateId) => {
    if (rankings.some(c => c?.id === candidateId)) return 'ranking';
    if (availableCandidates.some(c => c.id === candidateId)) return 'available';
    return null;
  };

  const handleDropOnRanking = (candidate, source, insertPosition) => {
    if (!candidate) return;
    
    let newRankings = [...rankings];
    let newAvailable = [...availableCandidates];

    if (source === 'available') {
      // Moving from available pool to ranking
      // Remove from available
      newAvailable = availableCandidates.filter(c => c.id !== candidate.id);
      
      // Get all filled slots as array
      const filled = newRankings.filter(r => r !== null);
      
      // Clamp insertion position to valid range
      const safePosition = Math.max(0, Math.min(insertPosition, filled.length));
      
      // Insert at position
      filled.splice(safePosition, 0, candidate);
      
      // If more than 5, return last one to pool
      if (filled.length > 5) {
        const returned = filled.pop();
        newAvailable = [...newAvailable, returned].sort((a, b) => 
          a.first_lastname.localeCompare(b.first_lastname, 'es')
        );
      }
      
      // Rebuild rankings with nulls at end
      newRankings = [...filled, ...Array(Math.max(0, 5 - filled.length)).fill(null)];
    } else if (source === 'ranking') {
      // Moving within rankings
      const oldIndex = rankings.findIndex(c => c?.id === candidate.id);
      if (oldIndex !== -1) {
        // Get all filled slots
        const filled = newRankings.filter(r => r !== null);
        
        // Remove from old position
        const currentPosInFilled = filled.findIndex(c => c.id === candidate.id);
        if (currentPosInFilled !== -1) {
          filled.splice(currentPosInFilled, 1);
        }
        
        // Clamp insertion position
        const safePosition = Math.max(0, Math.min(insertPosition, filled.length));
        
        // Insert at new position
        filled.splice(safePosition, 0, candidate);
        
        // Rebuild rankings
        newRankings = [...filled, ...Array(Math.max(0, 5 - filled.length)).fill(null)];
      }
    }
    
    setRankings(newRankings);
    setAvailableCandidates(newAvailable);
  };

  const handleDropOnAvailable = (candidate, source) => {
    if (source === 'ranking') {
      const index = rankings.findIndex(c => c?.id === candidate.id);
      if (index !== -1) {
        let newRankings = [...rankings];
        newRankings[index] = null;
        
        // Auto-shift: remove nulls from middle and push to end
        const filled = newRankings.filter(r => r !== null);
        newRankings = [...filled, ...Array(5 - filled.length).fill(null)];
        
        setRankings(newRankings);
        
        // Add back to available and sort alphabetically
        const newAvailable = [...availableCandidates, candidate].sort((a, b) => 
          a.first_lastname.localeCompare(b.first_lastname, 'es')
        );
        setAvailableCandidates(newAvailable);
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
    let newRankings = [...rankings];
    newRankings[index] = null;
    
    // Auto-shift: remove nulls from middle and push to end
    const filled = newRankings.filter(r => r !== null);
    newRankings = [...filled, ...Array(5 - filled.length).fill(null)];
    
    setRankings(newRankings);
    
    // Add back to available and sort alphabetically
    const newAvailable = [...availableCandidates, candidate].sort((a, b) => 
      a.first_lastname.localeCompare(b.first_lastname, 'es')
    );
    setAvailableCandidates(newAvailable);
  };

  const addToNextSlot = (candidate) => {
    const emptyIndex = rankings.findIndex(r => r === null);
    if (emptyIndex === -1) {
      setAlertMessage('Ya seleccionaste 5 candidatos.\nRemové uno para agregar otro.');
      return;
    }
    let newRankings = [...rankings];
    newRankings[emptyIndex] = candidate;
    
    // Auto-shift: remove nulls from middle and push to end
    const filled = newRankings.filter(r => r !== null);
    newRankings = [...filled, ...Array(5 - filled.length).fill(null)];
    
    setRankings(newRankings);
    setAvailableCandidates(availableCandidates.filter(c => c.id !== candidate.id));
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
            Ver resultados
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
            ¡Tocá para agregar/quitar hasta 5 candidatos!
            <br />
            Arrastrá para reordenar.
            <br />
            <span className="info-link" onClick={() => setShowInfo(true)}>(¿Cómo era que funcionaba?)</span>
          </p>
          <button onClick={onViewResults} className="btn-view-results-small">
            Ver resultados
          </button>
        </div>

        <div className="ranking-section">
          <h2>Tu orden de preferencia</h2>
          <div className="ranking-slots">
            {rankings.map((candidate, index) => (
              <DroppableSlot
                key={index}
                id={`slot-${index}`}
                slotNumber={index + 1}
                candidate={candidate}
                onRemove={() => removeFromRanking(index)}
                isOver={false}
                globalRotation={globalRotation}
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

        <DroppablePool>
          <div className="candidates-grid">
            {availableCandidates.map((candidate) => (
              <DraggableCandidate
                key={candidate.id}
                candidate={candidate}
                onClick={() => addToNextSlot(candidate)}
                compact={true}
                globalRotation={globalRotation}
              />
            ))}
          </div>
        </DroppablePool>
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <div style={{ cursor: 'grabbing', opacity: 1 }}>
            <CandidateCard candidate={activeCandidate} globalRotation={globalRotation} />
          </div>
        ) : null}
      </DragOverlay>
      
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </DndContext>
  );
};

export default VotingInterface;
