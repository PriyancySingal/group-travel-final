import "./GuestStats.css";

const GuestStats = ({ guests }) => {
  const getDietarySummary = () => {
    const summary = {};
    guests.forEach(guest => {
      guest.dietaryRequirements.forEach(diet => {
        summary[diet] = (summary[diet] || 0) + 1;
      });
    });
    return summary;
  };

  const getSpecialNeedsSummary = () => {
    return {
      wheelchairAccessible: guests.filter(g => g.wheelchairAccessible).length,
      mobilityAssistance: guests.filter(g => g.mobilityAssistance).length,
      specialNeeds: guests.filter(g => g.specialNeeds.length > 0).length
    };
  };

  const dietarySummary = getDietarySummary();
  const specialNeeds = getSpecialNeedsSummary();

  return (
    <div className="guest-stats-container">
      <h2>📊 Guest Summary</h2>

      {/* Total Guests */}
      <div className="stat-card stat-total">
        <div className="stat-value">{guests.length}</div>
        <div className="stat-label">Total Guests</div>
      </div>

      {/* Dietary Requirements */}
      {Object.keys(dietarySummary).length > 0 && (
        <div className="stat-section">
          <h3>🍽️ Dietary Requirements</h3>
          <div className="stat-grid">
            {Object.entries(dietarySummary).map(([diet, count]) => (
              <div key={diet} className="stat-item">
                <span className="stat-label">{diet}</span>
                <span className="stat-number">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Needs */}
      {(specialNeeds.wheelchairAccessible > 0 || specialNeeds.mobilityAssistance > 0 || specialNeeds.specialNeeds > 0) && (
        <div className="stat-section needs-section">
          <h3>♿ Special Needs & Accessibility</h3>
          <div className="stat-grid">
            {specialNeeds.wheelchairAccessible > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">Wheelchair Access</span>
                <span className="stat-number">{specialNeeds.wheelchairAccessible}</span>
              </div>
            )}
            {specialNeeds.mobilityAssistance > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">Mobility Assistance</span>
                <span className="stat-number">{specialNeeds.mobilityAssistance}</span>
              </div>
            )}
            {specialNeeds.specialNeeds > 0 && (
              <div className="stat-item needs-item">
                <span className="stat-label">Other Special Needs</span>
                <span className="stat-number">{specialNeeds.specialNeeds}</span>
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
