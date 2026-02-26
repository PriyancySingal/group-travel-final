import "./GuestCard.css";

const GuestProfileCard = ({ guest, onEdit, onDelete }) => {
  return (
    <div className="guest-card">
      <div className="guest-card-header">
        <h3 className="guest-name">{guest.name}</h3>
        <div className="guest-actions">
          <button
            className="btn-card btn-edit"
            onClick={() => onEdit(guest)}
            title="Edit profile"
          >
            ✏️
          </button>
          <button
            className="btn-card btn-delete"
            onClick={() => onDelete(guest._id)}
            title="Delete profile"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="guest-card-content">
        <div className="card-section">
          <p><strong>🏙️ City:</strong> {guest.city || "N/A"}</p>
          <p><strong>🎂 Age:</strong> {guest.age ?? "N/A"}</p>
          <p><strong>💰 Budget:</strong> {guest.budget ?? "N/A"}</p>
          <div className="preference-tags">
            <span className="tag">{guest.preferredInteraction || "balanced"}</span>
            <span className="tag">{guest.availability || "unspecified"}</span>
            <span className="tag">{guest.energyLevel || "unknown"} energy</span>
            {guest.isFirstTime && <span className="tag">First Time</span>}
          </div>
        </div>

        {guest.interests?.length > 0 && (
          <div className="card-section">
            <p><strong>🎯 Interests:</strong></p>
            <div className="preference-tags dietary">
              {guest.interests.map((interest) => (
                <span key={interest} className="tag dietary-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {guest.feedback && (
          <div className="card-section alert-section">
            <p className="guest-notes"><strong>💬 Feedback:</strong> {guest.feedback}</p>
          </div>
        )}

        <div className="card-footer">
          <small>
            Updated: {guest.updatedAt ? new Date(guest.updatedAt).toLocaleString() : "N/A"}
          </small>
        </div>
      </div>
    </div>
  );
};

export default GuestProfileCard;
