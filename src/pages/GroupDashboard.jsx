import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { calculateDynamicPricing } from "../services/PricingService";

const GroupDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state;

  // Default dates - 7 days from now for check-in, 2 nights stay
  const today = new Date();
  const defaultCheckIn = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const defaultCheckOut = new Date(defaultCheckIn.getTime() + 2 * 24 * 60 * 60 * 1000);

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn.toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut.toISOString().split('T')[0]);
  const [rooms, setRooms] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  const [members, setMembers] = useState([
    { id: 1, name: "Aman", status: "Confirmed", email: "aman@email.com" },
    { id: 2, name: "Riya", status: "Pending", email: "riya@email.com" }
  ]);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customAmounts, setCustomAmounts] = useState({});

  // Fetch pricing from API
  const fetchPricing = useCallback(async () => {
    if (!hotel || !hotel.Price) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel,
          checkInDate,
          checkOutDate,
          rooms,
          memberCount: members.length
        })
      });

      const data = await response.json();
      if (data.success) {
        setPricing(data.data);
      }
    } catch (error) {
      console.error("Pricing fetch error:", error);
      // Fallback to local calculation
      const localPricing = calculateDynamicPricing(hotel, {
        checkInDate,
        checkOutDate,
        rooms,
        memberCount: members.length
      });
      setPricing(localPricing);
    }
    setLoading(false);
  }, [hotel, checkInDate, checkOutDate, rooms, members.length]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  // Recalculate when custom amounts change
  useEffect(() => {
    if (splitType === "custom" && pricing && Object.keys(customAmounts).length > 0) {
      const customSplits = members.map((m, i) => customAmounts[i] || 0);
      const updatedPricing = {
        ...pricing,
        splits: {
          equal: pricing.allocation.equalSplit,
          custom: customSplits.map((amount, index) => ({
            memberIndex: index,
            amount
          })),
          type: 'custom'
        }
      };
      setPricing(updatedPricing);
    }
  }, [customAmounts, splitType, members.length]);

  if (!hotel) {
    return (
      <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
        <h2>No hotel selected</h2>
        <p>Please go back and select a hotel.</p>
      </div>
    );
  }

  const nights = pricing?.allocation?.nights || 2;
  const totalCost = pricing?.breakdown?.total || 0;
  const perPerson = pricing?.allocation?.perPerson || Math.round(totalCost / members.length);

  const addMember = () => {
    if (!newMemberName) return;
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers([...members, { 
      id: newId,
      name: newMemberName, 
      status: "Pending", 
      email: newMemberEmail || `${newMemberName.toLowerCase()}@email.com` 
    }]);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const removeMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
    const newCustomAmounts = { ...customAmounts };
    delete newCustomAmounts[index];
    const reindexed = {};
    Object.keys(newCustomAmounts).forEach(key => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        reindexed[oldIndex - 1] = newCustomAmounts[key];
      } else {
        reindexed[oldIndex] = newCustomAmounts[key];
      }
    });
    setCustomAmounts(reindexed);
  };

  const confirmMember = (index) => {
    const updated = [...members];
    updated[index].status = "Confirmed";
    setMembers(updated);
  };

  const handleCustomAmountChange = (index, value) => {
    setCustomAmounts({
      ...customAmounts,
      [index]: parseInt(value) || 0
    });
  };

  const applyEqualSplit = () => {
    setCustomAmounts({});
    setSplitType("equal");
  };

  const getDisplayAmount = (index) => {
    if (splitType === "custom" && customAmounts[index] !== undefined) {
      return customAmounts[index];
    }
    return perPerson;
  };

  return (
    <div className="container fade-in" style={{ marginTop: "60px", maxWidth: "950px" }}>
      {/* Header Card */}
      <div className="glass-card" style={{ 
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)",
        border: "1px solid rgba(168, 85, 247, 0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.7rem", background: "linear-gradient(90deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              🏨 Group Booking Dashboard
            </h1>
            <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: "1.05rem" }}>
              {hotel.HotelName} 📍 {hotel.Location}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1rem", opacity: 0.8 }}>⭐ {hotel.StarRating} Rating</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>Best value guaranteed</div>
          </div>
        </div>
      </div>

      {/* Trip Details & Pricing Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        
        {/* Trip Details */}
        <div className="glass-card">
          <h3 style={{ margin: "0 0 16px", color: "#f472b6", fontSize: "1.1rem" }}>📅 Trip Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", opacity: 0.7 }}>Check-in</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "0.95rem"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", opacity: 0.7 }}>Check-out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "0.95rem"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.85rem", opacity: 0.7 }}>Rooms</label>
              <select
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "0.95rem"
                }}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n} style={{ color: "black" }}>{n} Room{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: "12px", padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "0.9rem", textAlign: "center" }}>
            {nights} night{nights > 1 ? 's' : ''} • {rooms} room{rooms > 1 ? 's' : ''} • {members.length} guest{members.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Dynamic Pricing Card */}
        <div className="glass-card" style={{ 
          background: loading ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.18) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, color: "#34d399", fontSize: "1.1rem" }}>💰 Real-Time Pricing</h3>
            {loading && <span style={{ fontSize: "0.75rem", opacity: 0.7, color: "#fbbf24" }}>⏳ Updating...</span>}
          </div>

          {pricing && (
            <>
              {/* Price Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ opacity: 0.7 }}>Base Price ({nights} nights)</span>
                  <span>₹{pricing.breakdown.basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ opacity: 0.7 }}>Tax (12% GST)</span>
                  <span>₹{pricing.breakdown.tax.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ opacity: 0.7 }}>Service Fee (5%)</span>
                  <span>₹{pricing.breakdown.serviceFee.toLocaleString('en-IN')}</span>
                </div>
                
                {/* Discounts */}
                {pricing.discounts?.earlyBird?.applies && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#34d399" }}>
                    <span>🦅 Early Bird Discount (5%)</span>
                    <span>-₹{pricing.breakdown.earlyBirdDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {pricing.discounts?.group?.applies && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#34d399" }}>
                    <span>👥 Group Discount (10%)</span>
                    <span>-₹{pricing.breakdown.groupDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{ 
                borderTop: "1px solid rgba(255,255,255,0.15)", 
                paddingTop: "12px", 
                marginTop: "8px",
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center"
              }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Total</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34d399" }}>
                  ₹{pricing.breakdown.total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Per Person */}
              <div style={{ 
                marginTop: "10px", 
                padding: "10px", 
                background: "rgba(52, 211, 153, 0.15)", 
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "1rem"
              }}>
                👤 <strong>₹{pricing.allocation.perPerson.toLocaleString('en-IN')}</strong> per person
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginTop: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0" }}>
        {['members', 'pricing', 'split'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 24px",
              background: activeTab === tab ? "rgba(168, 85, 247, 0.3)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #a78bfa" : "2px solid transparent",
              color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeTab === tab ? "600" : "400",
              transition: "all 0.2s"
            }}
          >
            {tab === 'members' && '👥 Group Members'}
            {tab === 'pricing' && '📊 Price Details'}
            {tab === 'split' && '💳 Payment Split'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card" style={{ marginTop: "20px" }}>
        
        {/* Members Tab */}
        {activeTab === 'members' && (
          <>
            {/* Add Member Form */}
            <div style={{ 
              padding: "16px", 
              background: "rgba(99, 102, 241, 0.1)", 
              borderRadius: "10px",
              marginBottom: "20px"
            }}>
              <h4 style={{ margin: "0 0 12px", color: "#a78bfa" }}>➕ Add Group Member</h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  style={{
                    flex: "1 1 150px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "0.95rem"
                  }}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  style={{
                    flex: "1 1 180px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "0.95rem"
                  }}
                />
                <button 
                  className="btn-primary" 
                  onClick={addMember}
                  style={{ padding: "10px 20px" }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Member List */}
            <h4 style={{ margin: "0 0 14px", color: "#f472b6" }}>👥 Group Members ({members.length})</h4>
            {members.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  border: m.status === "Confirmed" ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: m.status === "Confirmed" ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 191, 36, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem"
                  }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "500" }}>{m.name}</div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>{m.email}</div>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    background: m.status === "Confirmed" ? "rgba(52, 211, 153, 0.2)" : "rgba(251, 191, 36, 0.2)",
                    color: m.status === "Confirmed" ? "#34d399" : "#fbbf24"
                  }}>
                    {m.status === "Confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                  </span>
                  
                  {splitType === "custom" && (
                    <span style={{ fontSize: "0.9rem", color: "#a78bfa" }}>
                      ₹{getDisplayAmount(i).toLocaleString('en-IN')}
                    </span>
                  )}
                  
                  {m.status === "Pending" ? (
                    <button
                      className="btn-primary"
                      style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                      onClick={() => confirmMember(i)}
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      style={{
                        padding: "6px 12px",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "none",
                        borderRadius: "6px",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      onClick={() => removeMember(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pricing Details Tab */}
        {activeTab === 'pricing' && pricing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ margin: "0", color: "#34d399" }}>📊 Detailed Price Breakdown</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Base Price (per night)</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>₹{pricing.basePrice?.perNight?.toLocaleString('en-IN') || 0}</div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Per Room (per night)</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>₹{pricing.basePrice?.perRoomPerNight?.toLocaleString('en-IN') || 0}</div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "4px" }}>Subtotal (before discount)</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>₹{pricing.breakdown?.subtotal?.toLocaleString('en-IN') || 0}</div>
              </div>
            </div>

            {/* Discount Info */}
            <div style={{ padding: "16px", background: "rgba(251, 191, 36, 0.1)", borderRadius: "8px", border: "1px solid rgba(251, 191, 36, 0.3)" }}>
              <h4 style={{ margin: "0 0 12px", color: "#fbbf24" }}>🏷️ Available Discounts</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>🦅 Early Bird (book 30+ days ahead)</span>
                  <span style={{ color: pricing.discounts?.earlyBird?.applies ? "#34d399" : "#ef4444" }}>
                    {pricing.discounts?.earlyBird?.applies 
                      ? `✓ Applied (-₹${pricing.discounts.earlyBird.amount.toLocaleString('en-IN')})` 
                      : `${pricing.discounts?.earlyBird?.daysUntil || 0} days until check-in`
                    }
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>👥 Group Discount (5+ members)</span>
                  <span style={{ color: pricing.discounts?.group?.applies ? "#34d399" : "#ef4444" }}>
                    {pricing.discounts?.group?.applies 
                      ? `✓ Applied (-₹${pricing.discounts.group.amount.toLocaleString('en-IN')})` 
                      : `${(pricing.discounts?.group?.threshold || 5) - (pricing.discounts?.group?.memberCount || 0)} more needed`
                    }
                  </span>
                </div>
              </div>
            </div>

            {pricing.breakdown?.totalDiscount > 0 && (
              <div style={{ 
                padding: "14px", 
                background: "rgba(52, 211, 153, 0.15)", 
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Total Savings</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#34d399" }}>
                  ₹{pricing.breakdown.totalDiscount.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Split Tab */}
        {activeTab === 'split' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ margin: "0", color: "#a78bfa" }}>💳 Payment Split Options</h4>
            
            {/* Split Type Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={applyEqualSplit}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: splitType === "equal" ? "rgba(168, 85, 247, 0.3)" : "rgba(255,255,255,0.05)",
                  border: splitType === "equal" ? "2px solid #a78bfa" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
              >
                ⚖️ Equal Split
              </button>
              <button
                onClick={() => setSplitType("custom")}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: splitType === "custom" ? "rgba(168, 85, 247, 0.3)" : "rgba(255,255,255,0.05)",
                  border: splitType === "custom" ? "2px solid #a78bfa" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
              >
                ✏️ Custom Split
              </button>
            </div>

            {/* Equal Split Display */}
            {splitType === "equal" && (
              <div style={{ 
                padding: "20px", 
                background: "rgba(52, 211, 153, 0.1)", 
                borderRadius: "10px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "8px" }}>
                  Each member pays
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#34d399" }}>
                  ₹{perPerson.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.6, marginTop: "8px" }}>
                  for {nights} night{nights > 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Custom Split Input */}
            {splitType === "custom" && (
              <div>
                <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "14px" }}>
                  Enter custom amounts for each member:
                </p>
                {members.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: "500" }}>{m.name}</span>
                    <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>₹</span>
                    <input
                      type="number"
                      value={customAmounts[i] || ''}
                      onChange={(e) => handleCustomAmountChange(i, e.target.value)}
                      placeholder={perPerson.toString()}
                      style={{
                        width: "100px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "0.95rem",
                        textAlign: "right"
                      }}
                    />
                  </div>
                ))}
                {Object.keys(customAmounts).length > 0 && (
                  <div style={{ 
                    padding: "12px", 
                    background: "rgba(255,255,255,0.05)", 
                    borderRadius: "8px",
                    textAlign: "right",
                    fontSize: "0.9rem"
                  }}>
                    Total: ₹{Object.values(customAmounts).reduce((a, b) => a + (b || 0), 0).toLocaleString('en-IN')} 
                    / ₹{totalCost.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Status & Action */}
      <div className="glass-card" style={{ 
        marginTop: "20px",
        background: members.every((m) => m.status === "Confirmed") 
          ? "linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
          : "rgba(255,255,255,0.03)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ margin: "0 0 8px", color: members.every((m) => m.status === "Confirmed") ? "#34d399" : "#fbbf24" }}>
              {members.every((m) => m.status === "Confirmed") 
                ? "✅ All members confirmed - Ready to book!" 
                : "⏳ Waiting for all members to confirm"}
            </h3>
            <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
              {members.filter(m => m.status === "Confirmed").length} of {members.length} confirmed
            </p>
          </div>
          
          <button
            className="btn-primary"
            style={{ 
              padding: "14px 32px",
              fontSize: "1.1rem",
              background: members.every((m) => m.status === "Confirmed") 
                ? "linear-gradient(135deg, #34d399, #059669)" 
                : "rgba(255,255,255,0.1)"
            }}
            onClick={() =>
              navigate("/booking-success", {
                state: {
                  hotel,
                  members: members.length,
                  amount: totalCost,
                  pricing: pricing,
                  checkInDate,
                  checkOutDate,
                  rooms
                }
              })
            }
          >
            Confirm Booking • ₹{totalCost.toLocaleString('en-IN')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDashboard;
