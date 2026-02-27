import React, { useState, useEffect, useRef } from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ participant }) => {
  const [participantImageLoading, setParticipantImageLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    setParticipantImageLoading(true); // Always start with loading true when image changes

    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      // Image is already loaded (cached)
      setParticipantImageLoading(false);
    } else {
      // Image is still loading, set up handlers
      const handleLoad = () => setParticipantImageLoading(false);
      const handleError = () => setParticipantImageLoading(false);

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      // Fallback timeout to prevent shimmer from getting stuck (increased to 5 seconds)
      const timer = setTimeout(() => setParticipantImageLoading(false), 5000);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        clearTimeout(timer);
      };
    }
  }, [participant.image]); // Depend on participant.image to re-trigger when image changes

  return (
    <div className="participant-card">
      {participantImageLoading && <div className="shimmer"></div>}
      <img
        ref={imgRef}
        src={participant.image}
        alt={participant.name}
      />
    </div>
  );
};

export default ParticipantCard;
