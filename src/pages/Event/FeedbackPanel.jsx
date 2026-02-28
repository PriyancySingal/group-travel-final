import { useState } from 'react';
import GuestEngagementService from '../../services/GuestEngagementService';

const FeedbackPanel = ({ guestId, eventData = {} }) => {
  const [feedbackType, setFeedbackType] = useState('event');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentFeedback, setRecentFeedback] = useState([]);

  const handleSubmitFeedback = () => {
    if (!comment.trim()) return;

    const feedback = GuestEngagementService.submitFeedback(guestId, {
      type: feedbackType,
      targetId: eventData.id || 'event-1',
      rating,
      comment,
      tags: [],
      isAnonymous: anonymous,
    });

    setRecentFeedback([feedback, ...recentFeedback]);
    setComment('');
    setRating(5);
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: '#10b981',
      neutral: '#f59e0b',
      negative: '#ef4444',
    };
    return colors[sentiment] || '#6b7280';
  };

  // Get sentiment emoji
  const getSentimentEmoji = (sentiment) => {
    const emojis = {
      positive: '😊',
      neutral: '😐',
      negative: '😞',
    };
    return emojis[sentiment] || '😶';
  };

  return (
    <div className="feedback-panel">
      <div className="panel-header">
        <h2>💬 Share Your Feedback</h2>
        <p>Help us improve the event by sharing your thoughts</p>
      </div>

      {submitted && (
        <div className="feedback-success">
          ✓ Thank you for your feedback! It helps us make future events better.
        </div>
      )}

      <div className="feedback-form">
        <div className="form-group">
          <label>What are you rating?</label>
          <div className="option-group">
            {['Event', 'Activity', 'Service', 'Food'].map(type => (
              <button
                key={type.toLowerCase()}
                className={`option-btn ${feedbackType === type.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFeedbackType(type.toLowerCase())}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
            <span className="rating-text">{rating}/5 stars</span>
          </div>
        </div>

        <div className="form-group">
          <label>Your Feedback</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your thoughts, suggestions, or concerns..."
            rows="4"
            className="feedback-textarea"
          />
          <div className="char-count">{comment.length}/500 characters</div>
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={e => setAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">Submit anonymously</label>
        </div>

        <button
          className="btn-submit-feedback"
          onClick={handleSubmitFeedback}
          disabled={!comment.trim()}
        >
          Submit Feedback
        </button>
      </div>

      {/* Recent Feedback Summary */}
      {recentFeedback.length > 0 && (
        <div className="feedback-summary">
          <h3>Recent Feedback Overview</h3>
          <div className="feedback-stats">
            {recentFeedback.map(fb => (
              <div
                key={fb.id}
                className="feedback-item"
                style={{ borderLeftColor: getSentimentColor(fb.sentiment) }}
              >
                <div className="feedback-header">
                  <span className="sentiment-emoji">
                    {getSentimentEmoji(fb.sentiment)}
                  </span>
                  <div className="feedback-meta">
                    <div className="feedback-rating">
                      {'⭐'.repeat(fb.rating)}
                    </div>
                    <div className="feedback-time">
                      {new Date(fb.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <p className="feedback-text">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="feedback-tips">
        <h3>💡 Feedback Tips</h3>
        <ul>
          <li>📝 Be specific about what you liked or could improve</li>
          <li>⭐ Use the star rating to give a quick impression</li>
          <li>🤐 Enable anonymous mode if you prefer privacy</li>
          <li>💬 Mention specific events or activities for better feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackPanel;
