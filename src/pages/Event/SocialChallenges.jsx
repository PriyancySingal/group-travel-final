import { useState, useEffect } from 'react';
import GamificationService from '../../services/GamificationService';

const SocialChallenges = ({ guestId, eventData = {} }) => {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [expandedChallenge, setExpandedChallenge] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, [guestId]);

  const loadChallenges = () => {
    // Get active challenges
    const activeChallenges = GamificationService.getActiveChallenges();
    setChallenges(activeChallenges);

    // Get guest's challenge progress
    const guestProgress = GamificationService.getChallengeProgress(guestId);
    setMyChallenges(guestProgress);
  };

  const handleCompleteChallenge = (challengeId) => {
    GamificationService.completeChallenge(challengeId, guestId);
    loadChallenges();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      networking: '👥',
      activity: '🎯',
      social: '🎉',
      exploration: '🗺️',
    };
    return icons[category] || '🎯';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
    };
    return colors[difficulty] || '#3b82f6';
  };

  return (
    <div className="social-challenges">
      <div className="view-header">
        <h2>🎪 Social Challenges</h2>
        <p>Complete challenges to boost engagement and earn points!</p>
      </div>

      {/* My Challenge Progress */}
      {myChallenges.length > 0 && (
        <div className="my-challenges-section">
          <h3>My Progress</h3>
          <div className="progress-grid">
            {myChallenges.map(challenge => (
              <div
                key={challenge.challengeId}
                className={`progress-card ${challenge.progress.completed ? 'completed' : ''}`}
              >
                <div className="progress-icon">
                  {getCategoryIcon(challenge.category)}
                </div>
                <h4>{challenge.name}</h4>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: challenge.progress.completed ? '100%' : '0%',
                    }}
                  />
                </div>
                <div className="progress-info">
                  {challenge.progress.completed ? (
                    <span className="completed-text">✓ Completed</span>
                  ) : (
                    <span className="attempts">Attempts: {challenge.progress.attempts}</span>
                  )}
                  <span className="points">⭐ {challenge.pointsReward} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      <div className="active-challenges-section">
        <h3>Active Challenges</h3>
        {challenges.length > 0 ? (
          <div className="challenges-list">
            {challenges.map(challenge => {
              const isCompleted = challenge.completedBy.includes(guestId);
              const progress = challenge.progress.get(guestId);

              return (
                <div
                  key={challenge.id}
                  className={`challenge-item ${isCompleted ? 'completed' : ''}`}
                >
                  <div
                    className="challenge-header"
                    onClick={() =>
                      setExpandedChallenge(
                        expandedChallenge === challenge.id ? null : challenge.id
                      )
                    }
                  >
                    <div className="challenge-title">
                      <span className="icon">
                        {getCategoryIcon(challenge.category)}
                      </span>
                      <div className="title-info">
                        <h4>{challenge.name}</h4>
                        <p className="description">{challenge.description}</p>
                      </div>
                    </div>

                    <div className="challenge-meta">
                      <span
                        className="difficulty"
                        style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="points">⭐ {challenge.pointsReward}</span>
                      <span className="participants">
                        👥 {challenge.completedBy.length} completed
                      </span>
                      {isCompleted && <span className="badge">✓ Done</span>}
                    </div>

                    <button className="expand-btn">
                      {expandedChallenge === challenge.id ? '−' : '+'}
                    </button>
                  </div>

                  {expandedChallenge === challenge.id && (
                    <div className="challenge-details">
                      <div className="detail-section">
                        <h5>Challenge Details</h5>
                        <p>{challenge.description}</p>
                      </div>

                      <div className="detail-section">
                        <h5>How to Complete</h5>
                        {challenge.conditions && (
                          <ul>
                            {Object.entries(challenge.conditions).map(
                              ([key, value]) => (
                                <li key={key}>
                                  {key}: {value}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>

                      <div className="detail-section">
                        <h5>Reward</h5>
                        <p>
                          <strong>⭐ {challenge.pointsReward} Points</strong>
                          {challenge.badgeId && (
                            <span> + Exclusive Badge</span>
                          )}
                        </p>
                      </div>

                      {!isCompleted && (
                        <button
                          className="btn-complete-challenge"
                          onClick={() => handleCompleteChallenge(challenge.id)}
                        >
                          Mark as Complete
                        </button>
                      )}

                      {isCompleted && (
                        <div className="completed-section">
                          <p>✓ You completed this challenge!</p>
                          <p className="completion-time">
                            Completed: {new Date(progress?.completionTime).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No active challenges at the moment. Check back later!</p>
          </div>
        )}
      </div>

      {/* Challenge Types Info */}
      <div className="challenge-types-info">
        <h3>Challenge Categories</h3>
        <div className="types-grid">
          <div className="type-card">
            <span className="type-icon">👥</span>
            <h4>Networking</h4>
            <p>Connect with other guests and expand your network</p>
          </div>
          <div className="type-card">
            <span className="type-icon">🎯</span>
            <h4>Activity</h4>
            <p>Participate in events and complete activities</p>
          </div>
          <div className="type-card">
            <span className="type-icon">🎉</span>
            <h4>Social</h4>
            <p>Have fun, engage with others, and build friendships</p>
          </div>
          <div className="type-card">
            <span className="type-icon">🗺️</span>
            <h4>Exploration</h4>
            <p>Discover new places and experiences at the event</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialChallenges;
