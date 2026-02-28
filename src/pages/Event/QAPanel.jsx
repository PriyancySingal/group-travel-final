import { useState, useEffect } from 'react';
import GuestEngagementService from '../../services/GuestEngagementService';

const QAPanel = ({ guestId, guestName }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [anonymous, setAnonymous] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState({});

  useEffect(() => {
    loadQuestions();
  }, [sortBy]);

  const loadQuestions = () => {
    const qs = GuestEngagementService.getQuestions(null, sortBy);
    setQuestions(qs);
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;

    const question = GuestEngagementService.submitQuestion(guestId, {
      content: newQuestion,
      category,
      guestName: anonymous ? 'Anonymous' : guestName,
      isAnonymous: anonymous,
    });

    setQuestions([question, ...questions]);
    setNewQuestion('');
    setCategory('general');
  };

  const handleUpvote = (questionId) => {
    GuestEngagementService.upvoteQuestion(questionId, guestId);
    loadQuestions();
  };

  const handleAnswerSubmit = (questionId) => {
    const answerText = newAnswer[questionId];
    if (!answerText?.trim()) return;

    GuestEngagementService.answerQuestion(questionId, guestName, answerText);
    setNewAnswer({ ...newAnswer, [questionId]: '' });
    loadQuestions();
  };

  return (
    <div className="qa-panel">
      <div className="view-header">
        <h2>❓ Q&A Forum</h2>
        <p>Ask questions and help fellow guests</p>
      </div>

      {/* Ask Question Form */}
      <div className="ask-question-form">
        <h3>Ask a Question</h3>
        <div className="form-group">
          <textarea
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="What would you like to know?"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="logistics">Logistics</option>
              <option value="activity">Activity</option>
            </select>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="anon"
              checked={anonymous}
              onChange={e => setAnonymous(e.target.checked)}
            />
            <label htmlFor="anon">Ask anonymously</label>
          </div>
        </div>

        <button
          className="btn-submit-question"
          onClick={handleSubmitQuestion}
          disabled={!newQuestion.trim()}
        >
          Post Question
        </button>
      </div>

      {/* Questions List */}
      <div className="questions-container">
        <div className="questions-header">
          <h3>Questions ({questions.length})</h3>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="answered">Answered</option>
          </select>
        </div>

        <div className="questions-list">
          {questions.map(question => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <div className="question-main">
                  <h4>{question.content}</h4>
                  <div className="question-meta">
                    <span className="asker">
                      {question.isAnonymous ? '🔑' : '👤'} {question.guestName}
                    </span>
                    <span className="category">📂 {question.category}</span>
                    <span className="time">
                      {new Date(question.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="question-actions">
                  <button
                    className="upvote-btn"
                    onClick={() => handleUpvote(question.id)}
                  >
                    👍 {question.upvotes}
                  </button>

                  {question.isAnswered && (
                    <span className="answered-badge">✓ Answered</span>
                  )}
                </div>
              </div>

              {/* Answers */}
              {question.answers.length > 0 && (
                <div className="answers-section">
                  {question.answers.map(answer => (
                    <div
                      key={answer.id}
                      className={`answer ${answer.isOfficial ? 'official' : ''}`}
                    >
                      <div className="answer-header">
                        <span className="answerer">
                          {answer.isOfficial ? '🎯' : '💬'} {answer.answerer}
                        </span>
                        <span className="time">
                          {new Date(answer.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="answer-content">{answer.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Answer Form */}
              <div className="add-answer-form">
                <textarea
                  value={newAnswer[question.id] || ''}
                  onChange={e =>
                    setNewAnswer({
                      ...newAnswer,
                      [question.id]: e.target.value,
                    })
                  }
                  placeholder="Share your answer..."
                  rows="2"
                />
                <button
                  className="btn-answer"
                  onClick={() => handleAnswerSubmit(question.id)}
                >
                  Share Answer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QAPanel;
