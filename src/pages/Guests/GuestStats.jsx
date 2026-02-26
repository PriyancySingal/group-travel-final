import "./GuestStats.css";

const GuestStats = ({ guests }) => {
  const getInterestSummary = () => {
    const summary = {};
    guests.forEach((guest) => {
      (guest.interests || []).forEach((interest) => {
        summary[interest] = (summary[interest] || 0) + 1;
      });
    });
    return summary;
  };

  const getProfileSummary = () => {
    return {
      firstTime: guests.filter((guest) => guest.isFirstTime).length,
      withFeedback: guests.filter((guest) => guest.feedback?.trim()).length,
      withInterests: guests.filter((guest) => (guest.interests || []).length > 0).length
    };
  };

  const interestSummary = getInterestSummary();
  const profileSummary = getProfileSummary();

  return (
    <div className="guest-stats-container">
      <h2>📊 Guest Summary</h2>

      {/* Total Guests */}
      <div className="stat-card stat-total">
        <div className="stat-value">{guests.length}</div>
        <div className="stat-label">Total Guests</div>
      </div>

      {Object.keys(interestSummary).length > 0 && (
        <div className="stat-section">
          <h3>🎯 Interests</h3>
          <div className="stat-grid">
            {Object.entries(interestSummary).map(([interest, count]) => (
              <div key={interest} className="stat-item">
                <span className="stat-label">{interest}</span>
                <span className="stat-number">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(profileSummary.firstTime > 0 || profileSummary.withFeedback > 0 || profileSummary.withInterests > 0) && (
        <div className="stat-section needs-section">
          <h3>🧠 Guest Signals</h3>
          <div className="stat-grid">
            {profileSummary.firstTime > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">First-time Guests</span>
                <span className="stat-number">{profileSummary.firstTime}</span>
              </div>
            )}
            {profileSummary.withFeedback > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">Guests with Feedback</span>
                <span className="stat-number">{profileSummary.withFeedback}</span>
              </div>
            )}
            {profileSummary.withInterests > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">Guests with Interests</span>
                <span className="stat-number">{profileSummary.withInterests}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {guests.length === 0 && (
        <div className="stat-empty">
          <p>No guest data available</p>
        </div>
      )}
    </div>
  );
};

export default GuestStats;
