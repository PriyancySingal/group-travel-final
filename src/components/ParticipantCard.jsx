import React, { useState, useEffect, useRef } from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ participant }) => {
  const [participantImageLoading, setParticipantImageLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    setParticipantImageLoading(true); // Reset loading state when image changes

    // Fallback timeout to prevent shimmer from getting stuck (5 seconds)
    const timer = setTimeout(() => setParticipantImageLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [participant.image]);

  const handleImageLoad = () => {
    setParticipantImageLoading(false);
  };

  const handleImageError = () => {
    setParticipantImageLoading(false);
  };

  // Ref callback to check if image is already loaded
  const setImgRef = (img) => {
    imgRef.current = img;
    if (img && img.complete) {
      setParticipantImageLoading(false);
    }
  };

  return (
    <div className="participant-card">
      {participantImageLoading && <div className="shimmer"></div>}
      <img
        ref={setImgRef}
        src={participant.image}
        alt={participant.name}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ParticipantCard;
