import "./GuestCard.css";

const GuestProfileCard = ({ guest, onEdit, onDelete, isDemoMode = false }) => {
  return (
    <div className="guest-card">
      <div className="guest-card-header">
        <h3 className="guest-name">{guest.name}</h3>
        <div className="guest-actions">
          {!isDemoMode && (
            <button
              className="btn-card btn-edit"
              onClick={() => onEdit(guest)}
              title="Edit profile"
            >
              ✏️
            </button>
          )}
          {!isDemoMode && (
            <button
              className="btn-card btn-delete"
              onClick={() => onDelete(guest._id || guest.id)}
              title="Remove guest"
            >
              🗑️
            </button>
          )}
          {isDemoMode && (
            <div className="demo-indicator" title="Behavioral Demo Profile">
              🎯
            </div>
          )}
        </div>
      </div>

      <div className="guest-card-content">
        {/* Contact Information */}
        {(guest.email || guest.phone) && (
          <div className="card-section">
            <p>
              {guest.email && (
                <>
                  📧 <a href={`mailto:${guest.email}`}>{guest.email}</a>
                </>
              )}
            </p>
            {guest.phone && <p>📱 {guest.phone}</p>}
          </div>
        )}

        {/* Room Preferences */}
        <div className="card-section">
          <p>
            <strong>🏨 Room:</strong> {guest.roomPreference ? (guest.roomPreference.charAt(0).toUpperCase() + guest.roomPreference.slice(1)) : 'Standard'}
          </p>
          <div className="preference-tags">
            {guest.quietRoom && <span className="tag">Quiet Room</span>}
            {guest.highFloor && <span className="tag">High Floor</span>}
            {guest.groundFloor && <span className="tag">Ground Floor</span>}
          </div>
        </div>

        {/* Dietary Requirements */}
        {guest.dietaryRequirements.length > 0 && (
          <div className="card-section">
            <p>
              <strong>🍽️ Dietary:</strong>
            </p>
            <div className="preference-tags dietary">
              {guest.dietaryRequirements.map(diet => (
                <span key={diet} className="tag dietary-tag">
                  {diet}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Needs */}
        {(guest.specialNeeds.length > 0 || guest.mobilityAssistance || guest.wheelchairAccessible) && (
          <div className="card-section alert-section">
            <p>
              <strong>♿ Special Needs:</strong>
            </p>
            <div className="preference-tags">
              {guest.wheelchairAccessible && (
                <span className="tag special-need">Wheelchair Access</span>
              )}
              {guest.mobilityAssistance && (
                <span className="tag special-need">Mobility Assist</span>
              )}
              {guest.specialNeeds.map(need => (
                <span key={need} className="tag special-need">
                  {need.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {guest.notes && (
          <div className="card-section">
            <p className="guest-notes">
              <strong>📝:</strong> {guest.notes}
            </p>
          </div>
        )}

        {/* Last Updated */}
        <div className="card-footer">
          <small>
            Updated: {new Date(guest.updatedAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default GuestProfileCard;
