import "./InventoryCard.css";

const InventoryCard = ({ item, type, onUpdate, onDelete }) => {
  const getTypeIcon = () => {
    switch (type) {
      case "room":
        return "🏨";
      case "transport":
        return "🚗";
      case "dining":
        return "🍽️";
      case "activity":
        return "🎯";
      default:
        return "📦";
    }
  };

  const getAvailabilityColor = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage >= 50) return "#34d399";
    if (percentage >= 20) return "#f59e0b";
    return "#ef4444";
  };

  const getCapacityLabel = () => {
    switch (type) {
      case "room":
        return `${item.available} / ${item.quantity}`;
      case "transport":
      case "dining":
        return `${item.available} / ${item.capacity}`;
      case "activity":
        return `${item.available} / ${item.capacity}`;
      default:
        return "N/A";
    }
  };

  const getUtilization = () => {
    const capacity = item.capacity || item.quantity;
    const used = type === "room" ? item.booked : (type === "activity" ? item.registered : (type === "transport" ? item.reserved : item.booked));
    return Math.round((used / capacity) * 100);
  };

  return (
    <div className="inventory-card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">{getTypeIcon()}</span>
          <div className="title-content">
            <h3>
              {item.type || item.mealType || item.name || "Item"}
            </h3>
            {item.description && <p className="subtitle">{item.description}</p>}
          </div>
        </div>
        <div className="card-actions">
          <button
            className="btn-action btn-increase"
            onClick={() =>
              onUpdate({
                itemId: item.id,
                change: 1,
                type: type
              })
            }
            title="Increase availability"
          >
            ➕
          </button>
          <button
            className="btn-action btn-decrease"
            onClick={() =>
              onUpdate({
                itemId: item.id,
                change: -1,
                type: type
              })
            }
            title="Decrease availability"
          >
            ➖
          </button>
          <button
            className="btn-action btn-delete"
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="availability-section">
          <div className="availability-bar">
            <div
              className="availability-used"
              style={{
                width: `${getUtilization()}%`,
                backgroundColor: getAvailabilityColor(
                  item.available,
                  item.capacity || item.quantity
                )
              }}
            />
          </div>
          <p className="availability-text">
            <span className="capacity-label">{getCapacityLabel()}</span>
            <span className="utilization-percent">{getUtilization()}% Full</span>
          </p>
        </div>

        <div className="details-grid">
          {item.time && (
            <div className="detail-item">
              <span className="label">⏰ Time</span>
              <span className="value">{item.time}</span>
            </div>
          )}

          {item.duration && (
            <div className="detail-item">
              <span className="label">⌛ Duration</span>
              <span className="value">{item.duration}</span>
            </div>
          )}

          {item.location && (
            <div className="detail-item">
              <span className="label">📍 Location</span>
              <span className="value">{item.location}</span>
            </div>
          )}

          {item.price && (
            <div className="detail-item">
              <span className="label">💰 Price</span>
              <span className="value">₹{item.price}</span>
            </div>
          )}

          {item.dietaryOptions && (
            <div className="detail-item full-width">
              <span className="label">🥗 Dietary Options</span>
              <div className="tags">
                {item.dietaryOptions.map(diet => (
                  <span key={diet} className="tag">
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.accessible && (
            <div className="detail-item">
              <span className="badge accessible">♿ Accessible</span>
            </div>
          )}

          {item.quiet && (
            <div className="detail-item">
              <span className="badge quiet">🔇 Quiet</span>
            </div>
          )}

          {item.highFloor && (
            <div className="detail-item">
              <span className="badge">⬆️ High Floor</span>
            </div>
          )}

          {item.groundFloor && (
            <div className="detail-item">
              <span className="badge">⬇️ Ground Floor</span>
            </div>
          )}
        </div>

        {getUtilization() >= 90 && (
          <div className="alert-box critical">
            ⚠️ Critical: {item.available} slots remaining
          </div>
        )}

        {getUtilization() >= 70 && getUtilization() < 90 && (
          <div className="alert-box warning">
            ⚡ Warning: {item.available} slots remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;
