import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { calculateDynamicPricing } from "../services/PricingService";
import RealTimeUpdateService from "../services/RealTimeUpdateService";
import "./GroupPlanForm.css";

const GroupPlanForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;

  // Default dates
  const today = new Date();
  const defaultCheckIn = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const defaultCheckOut = new Date(defaultCheckIn.getTime() + 2 * 24 * 60 * 60 * 1000);

  // Form state
  const [checkInDate, setCheckInDate] = useState(defaultCheckIn.toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut.toISOString().split('T')[0]);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState([
    { name: "", email: "", phone: "", amountToPay: 0, paymentStatus: "pending" }
  ]);
  const [splitType, setSplitType] = useState("equal");
  const [customAmounts, setCustomAmounts] = useState({});

  // Pricing state
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceFlash, setPriceFlash] = useState(null);

  // Animation state for price counter
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Save state
  const [saving, setSaving] = useState(false);
  const [savedGroupPlan, setSavedGroupPlan] = useState(null);

  // Calculate nights
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) || 1;

  // Real-time pricing calculation
  const calculatePricing = useCallback(() => {
    if (!hotel?.Price) return;

    const pricingData = calculateDynamicPricing(hotel, {
      checkInDate,
      checkOutDate,
      rooms,
      memberCount: guests.filter(g => g.name && g.email).length || 1
    });

    // Animate price change
    if (pricing && pricingData.breakdown.total !== pricing.breakdown.total) {
      const direction = pricingData.breakdown.total > pricing.breakdown.total ? "up" : "down";
      setPriceFlash(direction);
      setTimeout(() => setPriceFlash(null), 500);
    }

    setPricing(pricingData);

    // Animate total
    animateValue(animatedTotal, pricingData.breakdown.total, 500);
  }, [hotel, checkInDate, checkOutDate, rooms, guests]);

  // Animate number function
  const animateValue = (start, end, duration) => {
    if (start === end) return;
    const range = end - start;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = start + range * easeProgress;
      setAnimatedTotal(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  // Calculate pricing on changes
  useEffect(() => {
    if (hotel?.Price) {
      calculatePricing();
    }
  }, [calculatePricing, hotel]);

  // Add new guest
  const addGuest = () => {
    setGuests([...guests, { name: "", email: "", phone: "", amountToPay: 0, paymentStatus: "pending" }]);
  };

  // Remove guest
  const removeGuest = (index) => {
    if (guests.length > 1) {
      const newGuests = guests.filter((_, i) => i !== index);
      setGuests(newGuests);
      
      // Update custom amounts
      const newCustomAmounts = {};
      Object.entries(customAmounts).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx < index) {
          newCustomAmounts[idx] = value;
        } else if (idx > index) {
          newCustomAmounts[idx - 1] = value;
        }
      });
      setCustomAmounts(newCustomAmounts);
    }
  };

  // Update guest
  const updateGuest = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setGuests(newGuests);
  };

  // Handle custom amount change
  const handleCustomAmountChange = (index, value) => {
    setCustomAmounts({
      ...customAmounts,
      [index]: parseInt(value) || 0
    });
  };

  // Toggle split type
  const toggleSplitType = () => {
    setSplitType(splitType === "equal" ? "custom" : "equal");
  };

  // Get valid guests count
  const validGuestsCount = guests.filter(g => g.name && g.email).length;

  // Calculate custom split validation
  const customSplitTotal = Object.values(customAmounts).reduce((a, b) => a + (b || 0), 0);
  const isCustomSplitValid = splitType === "custom" && customSplitTotal === (pricing?.breakdown?.total || 0);

  // Save to MongoDB
  const saveGroupPlan = async () => {
    if (validGuestsCount < 1) {
      alert("Please add at least one guest with name and email");
      return;
    }

    if (!pricing) {
      alert("Unable to calculate pricing");
      return;
    }

    setSaving(true);
    try {
      const groupPlanData = {
        hotelName: hotel.HotelName || hotel.name,
        hotelImage: hotel.ImageUrl || hotel.imageUrl || "",
        city: hotel.Location || hotel.city || "",
        hotelRating: hotel.StarRating || hotel.rating || 0,
        checkInDate,
        checkOutDate,
        rooms,
        guests: guests.filter(g => g.name && g.email).map(g => ({
          name: g.name,
          email: g.email,
          phone: g.phone,
          amountToPay: splitType === "equal" 
            ? pricing.allocation.perPerson 
            : (customAmounts[guests.indexOf(g)] || 0),
          paymentStatus: "pending"
        })),
        basePrice: pricing.basePrice.totalForNights,
        gst: pricing.breakdown.tax,
        serviceFee: pricing.breakdown.serviceFee,
        discount: pricing.breakdown.totalDiscount,
        totalPrice: pricing.breakdown.total,
        perPersonSplit: pricing.allocation.perPerson,
        splitType
      };

      const response = await fetch("http://localhost:5000/api/group-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(groupPlanData)
      });

      const data = await response.json();

      if (data.success) {
        setSavedGroupPlan(data.data);
        // Initialize real-time updates for this group
        RealTimeUpdateService.initializeSocket(data.data._id, (update) => {
          console.log("Real-time update:", update);
        });
      } else {
        alert(data.message || "Failed to save group plan");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save group plan. Please try again.");
    }
    setSaving(false);
  };

  // Copy share link
  const copyShareLink = () => {
    const link = `${window.location.origin}/group/${savedGroupPlan?.shareCode}`;
    navigator.clipboard.writeText(link);
    alert("Share link copied to clipboard!");
  };

  // Go to share page
  const goToSharePage = () => {
    navigate(`/group/${savedGroupPlan?.shareCode}`, { state: { groupPlan: savedGroupPlan } });
  };

  if (!hotel) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ marginTop: "100px", textAlign: "center", color: "white" }}>
          <h2>No hotel selected</h2>
          <p>Please go back and select a hotel.</p>
          <button className="btn-primary" onClick={() => navigate("/results")}>
            Go to Results
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="group-plan-container">
        {/* Header */}
        <div className="glass-card header-card">
          <div className="header-content">
            <div>
              <h1>🏨 Create Group Plan</h1>
              <p className="hotel-name">{hotel.HotelName || hotel.name}</p>
              <p className="hotel-location">📍 {hotel.Location || hotel.location}</p>
            </div>
            <div className="header-actions">
              <span className="rating">⭐ {hotel.StarRating || hotel.rating}</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Left Column - Form */}
          <div className="form-section">
            {/* Trip Details */}
            <div className="glass-card">
              <h3>📅 Trip Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate}
                  />
                </div>
                <div className="form-group">
                  <label>Rooms</label>
                  <select value={rooms} onChange={(e) => setRooms(parseInt(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nights</label>
                  <input type="text" value={nights} readOnly className="readonly" />
                </div>
              </div>
            </div>

            {/* Group Members */}
            <div className="glass-card">
              <div className="section-header">
                <h3>👥 Group Members</h3>
                <button className="btn-add" onClick={addGuest}>+ Add Member</button>
              </div>
              
              <div className="members-list">
                {guests.map((guest, index) => (
                  <div key={index} className="member-row">
                    <div className="member-avatar">
                      {guest.name ? guest.name.charAt(0).toUpperCase() : (index + 1)}
                    </div>
                    <div className="member-fields">
                      <input
                        type="text"
                        placeholder="Name"
                        value={guest.name}
                        onChange={(e) => updateGuest(index, "name", e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={guest.email}
                        onChange={(e) => updateGuest(index, "email", e.target.value)}
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={guest.phone}
                        onChange={(e) => updateGuest(index, "phone", e.target.value)}
                      />
                    </div>
                    {splitType === "custom" && (
                      <div className="custom-amount">
                        <span>₹</span>
                        <input
                          type="number"
                          placeholder={pricing?.allocation?.perPerson || 0}
                          value={customAmounts[index] || ""}
                          onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                        />
                      </div>
                    )}
                    {guests.length > 1 && (
                      <button className="btn-remove" onClick={() => removeGuest(index)}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="members-count">
                {validGuestsCount} member{validGuestsCount !== 1 ? 's' : ''} • {nights} night{nights > 1 ? 's' : ''} • {rooms} room{rooms > 1 ? 's' : ''}
              </div>
            </div>

            {/* Payment Split */}
            <div className="glass-card">
              <h3>💳 Payment Split</h3>
              <div className="split-toggle">
                <button
                  className={splitType === "equal" ? "active" : ""}
                  onClick={() => setSplitType("equal")}
                >
                  ⚖️ Equal Split
                </button>
                <button
                  className={splitType === "custom" ? "active" : ""}
                  onClick={() => setSplitType("custom")}
                >
                  ✏️ Custom Split
                </button>
              </div>

              {splitType === "custom" && (
                <div className="custom-split-info">
                  {isCustomSplitValid ? (
                    <span className="valid">✓ Amounts match total</span>
                  ) : (
                    <span className="invalid">
                      Total: ₹{customSplitTotal.toLocaleString('en-IN')} / ₹{(pricing?.breakdown?.total || 0).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="pricing-section">
            <div className={`glass-card pricing-card ${priceFlash ? `flash-${priceFlash}` : ''}`}>
              <h3>💰 Real-Time Pricing</h3>
              
              {pricing && (
                <>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Base Price ({nights} nights)</span>
                      <span>₹{pricing.breakdown.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>GST (12%)</span>
                      <span>₹{pricing.breakdown.tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>Service Fee (5%)</span>
                      <span>₹{pricing.breakdown.serviceFee.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {pricing.discounts?.earlyBird?.applies && (
                      <div className="price-row discount">
                        <span>🦅 Early Bird (5%)</span>
                        <span>-₹{pricing.breakdown.earlyBirdDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {pricing.discounts?.group?.applies && (
                      <div className="price-row discount">
                        <span>👥 Group Discount (10%)</span>
                        <span>-₹{pricing.breakdown.groupDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <div className="price-total">
                    <span>Total</span>
                    <span className="total-amount">₹{Math.round(animatedTotal).toLocaleString('en-IN')}</span>
                  </div>

                  {pricing.breakdown.totalDiscount > 0 && (
                    <div className="savings-badge">
                      You save ₹{pricing.breakdown.totalDiscount.toLocaleString('en-IN')}!
                    </div>
                  )}

                  <div className="per-person">
                    <span>👤 Per Person</span>
                    <span className="per-person-amount">
                      ₹{splitType === "equal" 
                        ? pricing.allocation.perPerson.toLocaleString('en-IN')
                        : "Custom"
                      }
                    </span>
                  </div>
                </>
              )}

              {!pricing && (
                <div className="loading-pricing">
                  <span>Calculating pricing...</span>
                </div>
              )}
            </div>

            {/* Discount Info */}
            {pricing && (
              <div className="glass-card discounts-card">
                <h4>🏷️ Available Discounts</h4>
                <div className="discount-item">
                  <span>🦅 Early Bird (30+ days)</span>
                  <span className={pricing.discounts?.earlyBird?.applies ? "applied" : "not-applied"}>
                    {pricing.discounts?.earlyBird?.applies ? "✓ Applied" : `${pricing.discounts?.earlyBird?.daysUntil || 0} days left`}
                  </span>
                </div>
                <div className="discount-item">
                  <span>👥 Group Discount (5+)</span>
                  <span className={pricing.discounts?.group?.applies ? "applied" : "not-applied"}>
                    {pricing.discounts?.group?.applies 
                      ? "✓ Applied" 
                      : `${(pricing.discounts?.group?.threshold || 5) - (pricing.discounts?.group?.memberCount || 0)} more needed`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Save Button */}
            {!savedGroupPlan ? (
              <button 
                className="btn-save" 
                onClick={saveGroupPlan}
                disabled={saving || !pricing}
              >
                {saving ? "Saving..." : "💾 Save Group Plan"}
              </button>
            ) : (
              <div className="saved-actions">
                <div className="share-link-box">
                  <label>Share Code:</label>
                  <code>{savedGroupPlan.shareCode}</code>
                </div>
                <button className="btn-copy" onClick={copyShareLink}>
                  📋 Copy Link
                </button>
                <button className="btn-view" onClick={goToSharePage}>
                  🔗 View Group Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupPlanForm;
