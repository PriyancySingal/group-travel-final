import { useState, useEffect } from 'react';
import GamificationService from '../../services/GamificationService';

const GamificationDashboard = ({ guestId, onEngagementUpdate }) => {
  const [activeLeaderboard, setActiveLeaderboard] = useState('points');
  const [leaderboards, setLeaderboards] = useState(new Map());
  const [guestPosition, setGuestPosition] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadGamificationData();
  }, [guestId, activeLeaderboard]);

  const loadGamificationData = () => {
    // Initialize leaderboards if not exist
    if (!leaderboards.has('points')) {
      const pointsLB = GamificationService.createLeaderboard({
        name: 'Points Leaderboard',
        type: 'points',
        metric: 'totalPoints',
      });
      const challengesLB = GamificationService.createLeaderboard({
        name: 'Challenges Completed',
        type: 'challenges',
        metric: 'completedChallenges',
      });

      setLeaderboards(
        new Map([
          ['points', pointsLB],
          ['challenges', challengesLB],
        ])
      );
    }

    // Get active leaderboard
    const lb = leaderboards.get(activeLeaderboard);
    if (lb) {
      const position = GamificationService.getGuestPosition(lb.id, guestId);
      setGuestPosition(position);
    }

    // Load challenges
    const activeChallenges = GamificationService.getActiveChallenges();
    setChallenges(activeChallenges);

    // Load badges
    const guestBadges = GamificationService.getGuestBadges(guestId);
    setBadges(guestBadges);
  };

  const handleCompleteChallenge = (challengeId) => {
    GamificationService.completeChallenge(challengeId, guestId);
    loadGamificationData();
    if (onEngagementUpdate) {
      onEngagementUpdate();
    }
  };

  const getLBData = () => {
    const lb = leaderboards.get(activeLeaderboard);
    return lb ? GamificationService.getLeaderboard(lb.id, 10) : null;
  };

  const lbData = getLBData();

  return (
    <div className="gamification-dashboard">
      <div className="view-header">
        <h2>🏅 Leaderboard & Achievements</h2>
        <p>Compete, complete challenges, and earn badges!</p>
      </div>

      {/* Leaderboard Selector */}
      <div className="leaderboard-selector">
        {['points', 'challenges'].map(type => (
          <button
            key={type}
            className={`lb-tab ${activeLeaderboard === type ? 'active' : ''}`}
            onClick={() => setActiveLeaderboard(type)}
          >
            {type === 'points' ? '⭐' : '🏆'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Guest Position */}
      {guestPosition && (
        <div className="my-position">
          <div className="position-card">
            <div className="position-rank">
              <div className="rank-medal">{guestPosition.medal}</div>
              <div className="rank-number">#{guestPosition.rank}</div>
            </div>
            <div className="position-info">
              <div className="position-score">{guestPosition.score}</div>
              <div className="position-label">Your Ranking</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {lbData && (
        <div className="leaderboard-content">
          <h3>{lbData.name}</h3>
          <div className="leaderboard-table">
            {lbData.rankings.map((entry, idx) => (
              <div
                key={idx}
                className={`leaderboard-entry ${entry.guestId === guestId ? 'current-user' : ''}`}
              >
                <div className="entry-rank">
                  <span className="rank-medal">{entry.medal}</span>
                  <span className="rank-number">{entry.rank}</span>
                </div>
                <div className="entry-info">
                  <span className="entry-name">{entry.name}</span>
                  {entry.avatar && <img src={entry.avatar} alt={entry.name} />}
                </div>
                <div className="entry-score">
                  {entry.icon} {entry.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      <div className="challenges-section">
        <h3>🎯 Active Challenges</h3>
        <div className="challenges-grid">
          {challenges.map(challenge => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-icon">{challenge.icon}</div>
              <h4>{challenge.name}</h4>
              <p className="challenge-desc">{challenge.description}</p>
              <div className="challenge-info">
                <span className="points">⭐ {challenge.pointsReward} pts</span>
                <span className={`difficulty ${challenge.difficulty}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <button
                className="btn-complete"
                onClick={() => handleCompleteChallenge(challenge.id)}
              >
                Complete Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="badges-section">
        <h3>🎖️ Earned Badges ({badges.length})</h3>
        {badges.length > 0 ? (
          <div className="badges-grid">
            {badges.map(badge => (
              <div key={badge.id} className="badge-item">
                <div className="badge-icon">{badge.icon}</div>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                <span className={`rarity ${badge.rarity}`}>
                  {badge.rarity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-badges">Start completing challenges to earn badges!</p>
        )}
      </div>
    </div>
  );
};

export default GamificationDashboard;
