import { useLocation } from "react-router-dom";

const BookingSuccess = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div className="container" style={{ marginTop: "80px" }}>
        <h2>No booking data found</h2>
      </div>
    );
  }

  const { hotel, members, amount, pricing, checkInDate, checkOutDate, rooms } = data;

  return (
    <div
      className="container fade-in"
      style={{ marginTop: "80px", maxWidth: "800px" }}
    >
      {/* Success Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        padding: "30px",
        background: "linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)",
        borderRadius: "16px",
        border: "1px solid rgba(52, 211, 153, 0.3)"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#34d399" }}>Booking Confirmed!</h1>
        <p style={{ margin: "12px 0 0", opacity: 0.8, fontSize: "1.1rem" }}>
          Your trip is successfully booked. Have a great journey!
        </p>
      </div>

      {/* Hotel Details */}
      <div className="glass-card" style={{ marginTop: "20px" }}>
        <h2 style={{ margin: "0 0 16px", color: "#a78bfa" }}>🏨 Hotel Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Hotel Name</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{hotel.HotelName}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Location</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>📍 {hotel.Location}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Rating</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>⭐ {hotel.StarRating}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Rooms</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>🛏️ {rooms} Room{rooms > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Trip Dates */}
      <div className="glass-card" style={{ marginTop: "20px" }}>
        <h2 style={{ margin: "0 0 16px", color: "#f472b6" }}>📅 Trip Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Check-in</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>📥 {checkInDate}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Check-out</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>📤 {checkOutDate}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Guests</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>👥 {members} Guest{members > 1 ? 's' : ''}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Nights</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>🌙 {pricing?.allocation?.nights || 2} Night{((pricing?.allocation?.nights) || 2) > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      {pricing && (
        <div className="glass-card" style={{ marginTop: "20px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)" }}>
          <h2 style={{ margin: "0 0 16px", color: "#34d399" }}>💰 Payment Summary</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Base Price</span>
              <span>₹{pricing.breakdown?.basePrice?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Tax (12% GST)</span>
              <span>₹{pricing.breakdown?.tax?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Service Fee (5%)</span>
              <span>₹{pricing.breakdown?.serviceFee?.toLocaleString('en-IN') || 0}</span>
            </div>
            
            {pricing.breakdown?.earlyBirdDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#34d399" }}>
                <span>🦅 Early Bird Discount</span>
                <span>-₹{pricing.breakdown.earlyBirdDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {pricing.breakdown?.groupDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#34d399" }}>
                <span>👥 Group Discount</span>
                <span>-₹{pricing.breakdown.groupDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div style={{ 
              borderTop: "1px solid rgba(255,255,255,0.2)", 
              paddingTop: "12px", 
              marginTop: "8px",
              display: "flex", 
              justifyContent: "space-between",
              fontSize: "1.3rem",
              fontWeight: "bold"
            }}>
              <span>Total Paid</span>
              <span style={{ color: "#34d399" }}>₹{amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Per Person Info */}
          <div style={{ 
            marginTop: "16px", 
            padding: "12px", 
            background: "rgba(52, 211, 153, 0.15)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <span style={{ opacity: 0.8 }}>Per Person: </span>
            <strong style={{ color: "#34d399", fontSize: "1.2rem" }}>
              ₹{pricing.allocation?.perPerson?.toLocaleString('en-IN') || 0}
            </strong>
          </div>

          {/* Savings */}
          {pricing.breakdown?.totalDiscount > 0 && (
            <div style={{ 
              marginTop: "12px", 
              padding: "10px", 
              background: "rgba(251, 191, 36, 0.15)", 
              borderRadius: "8px",
              textAlign: "center",
              color: "#fbbf24"
            }}>
              🎉 You saved ₹{pricing.breakdown.totalDiscount.toLocaleString('en-IN')} on this booking!
            </div>
          )}
        </div>
      )}

      {/* Fallback if no pricing data */}
      {!pricing && (
        <div className="glass-card" style={{ marginTop: "20px" }}>
          <h2 style={{ margin: "0 0 16px", color: "#a78bfa" }}>💰 Payment Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: "bold" }}>
            <span>Total Paid</span>
            <span style={{ color: "#34d399" }}>₹{amount?.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginTop: "30px", justifyContent: "center" }}>
        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/'}
          style={{ padding: "12px 24px" }}
        >
          🏠 Back to Home
        </button>
        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/results'}
          style={{ padding: "12px 24px", background: "rgba(168, 85, 247, 0.3)" }}
        >
          🔍 Search More Hotels
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
