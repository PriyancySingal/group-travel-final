import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RealTimeUpdateService from "../services/RealTimeUpdateService";
import "./GroupSharePage.css";

const GroupSharePage = () => {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  
  const [groupPlan, setGroupPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinForm, setJoinForm] = useState({ name: "", email: "", phone: "" });
  const [joining, setJoining] = useState(false);
  const [myEmail, setMyEmail] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState({});

  // Fetch group plan
  useEffect(() => {
    const fetchGroupPlan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/group-plans/share/${shareCode}`);
        const data = await response.json();
        
        if (data.success) {
          setGroupPlan(data.data);
        } else {
          setError(data.message || "Group plan not found");
        }
      } catch (err) {
        setError("Failed to load group plan");
      }
      setLoading(false);
    };

    if (shareCode) {
      fetchGroupPlan();
    }
  }, [shareCode]);

  // Setup real-time updates
  useEffect(() => {
    if (groupPlan?._id) {
      RealTimeUpdateService.initializeSocket(groupPlan._id, (update) => {
        console.log("Real-time update:", update);
        if (update.booking) {
          setGroupPlan(update.booking);
        } else if (update.type === "member-joined" || update.type === "member:joined") {
          // Refresh data
          fetchGroupPlan();
        } else if (update.type === "booking:confirmed" || update.type === "booking-confirmed") {
          setGroupPlan(prev => ({ ...prev, bookingStatus: "confirmed", confirmationNumber: update.confirmationNumber }));
        }
      });

      return () => {
        RealTimeUpdateService.closeConnection();
      };
    }
  }, [groupPlan?._id]);

  const fetchGroupPlan = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/group-plans/share/${shareCode}`);
      const data = await response.json();
      if (data.success) {
        setGroupPlan(data.data);
      }
    } catch (err) {
      console.error("Failed to refresh:", err);
    }
  };

  // Join group
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinForm.name || !joinForm.email) return;

    setJoining(true);
    try {
      const response = await fetch(`http://localhost:5000/api/group-plans/${groupPlan._id}/member`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setGroupPlan(data.data);
        setMyEmail(joinForm.email);
        setJoinForm({ name: "", email: "", phone: "" });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to join group");
    }
    setJoining(false);
  };

  // Mark as paid
  const handleMarkPaid = async (memberIndex) => {
    setPaymentProcessing(prev => ({ ...prev, [memberIndex]: true }));
    
    try {
      const response = await fetch(`http://localhost:5000/api/group-plans/${groupPlan._id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIndex, paymentStatus: "paid" })
      });
      const data = await response.json();
      
      if (data.success) {
        setGroupPlan(data.data);
      }
    } catch (err) {
      alert("Failed to update payment");
    }
    
    setPaymentProcessing(prev => ({ ...prev, [memberIndex]: false }));
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: "#fbbf24", text: "⏳ Pending" },
      partial: { color: "#60a5fa", text: "📤 Partial" },
      ready_for_confirmation: { color: "#34d399", text: "✅ Ready for Confirmation" },
      confirmed: { color: "#10b981", text: "✓ Confirmed" },
      cancelled: { color: "#ef4444", text: "✕ Cancelled" },
      completed: { color: "#8b5cf6", text: "🏁 Completed" }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="share-page-loading">
        <div className="loader"></div>
        <p>Loading group plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="share-page-error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const nights = Math.ceil((new Date(groupPlan.checkOutDate) - new Date(groupPlan.checkInDate)) / (1000 * 60 * 60 * 24));
  const statusBadge = getStatusBadge(groupPlan.bookingStatus);
  const paidCount = groupPlan.guests?.filter(g => g.paymentStatus === "paid").length || 0;
  const totalGuests = groupPlan.guests?.length || 0;

  return (
    <div className="share-page">
      {/* Header */}
      <div className="share-header">
        <h1>🏨 Group Travel Booking</h1>
        <div className="share-code">Code: <code>{groupPlan.shareCode}</code></div>
      </div>

      {/* Hotel Info */}
      <div className="glass-card hotel-info">
        <h2>{groupPlan.hotelName}</h2>
        <p className="location">📍 {groupPlan.city}</p>
        <div className="trip-details">
          <span>📅 {new Date(groupPlan.checkInDate).toLocaleDateString()} - {new Date(groupPlan.checkOutDate).toLocaleDateString()}</span>
          <span>🛏️ {groupPlan.rooms} Room{groupPlan.rooms > 1 ? 's' : ''}</span>
          <span>👥 {totalGuests} Guest{totalGuests > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Status */}
      <div className="glass-card status-card" style={{ borderColor: statusBadge.color }}>
        <div className="status-badge" style={{ background: `${statusBadge.color}20`, color: statusBadge.color }}>
          {statusBadge.text}
        </div>
        
        {groupPlan.confirmationNumber && (
          <div className="confirmation-number">
            Confirmation: <strong>{groupPlan.confirmationNumber}</strong>
          </div>
        )}

        {/* Payment Progress */}
        <div className="payment-progress">
          <div className="progress-label">
            <span>Payment Progress</span>
            <span>{paidCount}/{totalGuests} paid</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${groupPlan.paymentProgress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="glass-card pricing-card">
        <h3>💰 Price Breakdown</h3>
        <div className="price-rows">
          <div className="price-row">
            <span>Base Price</span>
            <span>₹{groupPlan.basePrice?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="price-row">
            <span>GST (12%)</span>
            <span>₹{groupPlan.gst?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="price-row">
            <span>Service Fee (5%)</span>
            <span>₹{groupPlan.serviceFee?.toLocaleString('en-IN') || 0}</span>
          </div>
          {groupPlan.discount > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <span>-₹{groupPlan.discount?.toLocaleString('en-IN') || 0}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <span>₹{groupPlan.totalPrice?.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="glass-card members-card">
        <h3>👥 Group Members ({totalGuests})</h3>
        <div className="members-list">
          {groupPlan.guests?.map((member, index) => (
            <div key={index} className={`member-item ${member.paymentStatus === "paid" ? "paid" : ""}`}>
              <div className="member-avatar">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
              </div>
              <div className="member-amount">
                ₹{member.amountToPay?.toLocaleString('en-IN') || 0}
              </div>
              <div className="member-status">
                <span className={`status ${member.paymentStatus}`}>
                  {member.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Form */}
      {groupPlan.bookingStatus !== "confirmed" && groupPlan.bookingStatus !== "cancelled" && (
        <div className="glass-card join-card">
          <h3>➕ Join This Group</h3>
          <form onSubmit={handleJoin} className="join-form">
            <input
              type="text"
              placeholder="Your Name"
              value={joinForm.name}
              onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={joinForm.email}
              onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={joinForm.phone}
              onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
            />
            <button type="submit" disabled={joining}>
              {joining ? "Joining..." : "Join Group"}
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <div className="share-footer">
        <p>Powered by Group Travel Booking Platform</p>
      </div>
    </div>
  );
};

export default GroupSharePage;
