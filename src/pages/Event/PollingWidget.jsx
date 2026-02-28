import { useState, useEffect } from 'react';
import GuestEngagementService from '../../services/GuestEngagementService';

const PollingWidget = ({ guestId }) => {
  const [activePolls, setActivePolls] = useState([]);
  const [userVotes, setUserVotes] = useState(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Load active polls
    const polls = GuestEngagementService.getActivePolls();
    setActivePolls(polls);
  }, [refreshTrigger]);

  const handleVote = (pollId, optionId) => {
    const poll = activePolls.find(p => p.id === pollId);
    if (!poll) return;

    GuestEngagementService.votePoll(pollId, guestId, optionId);
    setUserVotes(new Set([...userVotes, `${pollId}-${optionId}`]));
    
    // Refresh polls
    setRefreshTrigger(prev => prev + 1);
  };

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  if (activePolls.length === 0) {
    return (
      <div className="polling-widget">
        <div className="view-header">
          <h2>🗳️ Live Polls</h2>
          <p>No active polls at the moment</p>
        </div>
        <div className="empty-state">
          <p>Check back later for interactive polls!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="polling-widget">
      <div className="view-header">
        <h2>🗳️ Live Polls</h2>
        <p>Vote on what's happening right now!</p>
      </div>

      <div className="polls-container">
        {activePolls.map(poll => (
          <div key={poll.id} className="poll-card">
            <div className="poll-header">
              <h3>{poll.question}</h3>
              <span className="poll-status">
                {poll.results.totalVotes} votes • Live
              </span>
            </div>

            <div className="poll-options">
              {poll.options.map(option => (
                <div key={option.id} className="poll-option">
                  <button
                    className={`option-btn ${
                      userVotes.has(`${poll.id}-${option.id}`) ? 'voted' : ''
                    }`}
                    onClick={() => handleVote(poll.id, option.id)}
                  >
                    <div className="option-label">
                      <span className="option-text">{option.text}</span>
                      <span className="option-meta">
                        {calculatePercentage(option.votes, poll.results.totalVotes)}%
                      </span>
                    </div>
                    <div className="option-bar">
                      <div
                        className="option-fill"
                        style={{
                          width: `${calculatePercentage(
                            option.votes,
                            poll.results.totalVotes
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="option-votes">{option.votes} votes</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="poll-meta">
              <span className="deadline">
                ⏱️ Poll closes{' '}
                {new Date(poll.endTime).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="polling-tips">
        <h3>💡 Polls Help Shape the Event!</h3>
        <p>Your votes directly influence event decisions. Participate to have your voice heard!</p>
      </div>
    </div>
  );
};

export default PollingWidget;
