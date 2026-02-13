import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateDynamicPricing } from "../services/PricingService";

export default function Results() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewHotel, setPreviewHotel] = useState(null);
  const navigate = useNavigate();

  // Default dates for pricing calculation
  const defaultCheckIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const defaultCheckOut = new Date(defaultCheckIn.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 nights

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        CityId: "110089",
        CheckInDate: "2024-12-20",
        CheckOutDate: "2024-12-22",
        Rooms: 1
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("LIVE TBO RESPONSE:", data);
        setHotels(data?.HotelSearchResult?.HotelResults || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Calculate preview pricing for a hotel
  const calculatePreviewPricing = (hotel) => {
    if (!hotel || !hotel.Price) return null;
    
    return calculateDynamicPricing(hotel, {
      checkInDate: defaultCheckIn.toISOString().split('T')[0],
      checkOutDate: defaultCheckOut.toISOString().split('T')[0],
      rooms: 1,
      memberCount: 2 // Preview for 2 members
    });
  };

  const handleAddToGroupPlan = (hotel) => {
    // Calculate pricing before navigating
    const pricing = calculatePreviewPricing(hotel);
    
    // Navigate with hotel and pricing data
    navigate("/group-dashboard", { 
      state: { 
        ...hotel,
        _pricing: pricing,
        _checkIn: defaultCheckIn.toISOString().split('T')[0],
        _checkOut: defaultCheckOut.toISOString().split('T')[0],
        _rooms: 1
      } 
    });
  };

  // Demo fallback hotels
  const demoHotels = [
    {
      HotelName: "Grand Himalayan Resort",
      StarRating: 4.6,
      Price: { TotalPrice: 4500 },
      Location: "Gangtok"
    },
    {
      HotelName: "Mountain View Palace",
      StarRating: 4.8,
      Price: { TotalPrice: 6200 },
      Location: "Gangtok"
    }
  ];

  return (
    <div className="container">
      <h1>🏨 Live Hotel Results (TBO API)</h1>
      <p style={{ opacity: 0.7, marginBottom: "20px" }}>
        Click "Add to Group Plan" to see dynamic pricing with taxes, discounts, and payment splits!
      </p>

      {loading && <p>Fetching real-time availability…</p>}

      {/* LIVE RESULTS */}
      {hotels.map((h, i) => {
        const preview = calculatePreviewPricing(h);
        
        return (
          <div 
            key={i} 
            className="glass-card" 
            style={{ marginTop: "16px" }}
            onMouseEnter={() => setPreviewHotel(h)}
            onMouseLeave={() => setPreviewHotel(null)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3>{h.HotelName}</h3>
                <p>⭐ {h.StarRating} • 📍 {h.Location || "Unknown"}</p>
                <p style={{ fontSize: "1.2rem", color: "#34d399" }}>
                  ₹{h.Price?.TotalPrice?.toLocaleString('en-IN')} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>(base price)</span>
                </p>
              </div>
              
              {/* Live Pricing Preview */}
              {preview && (
                <div style={{ 
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                  padding: "12px 16px", 
                  borderRadius: "10px",
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                  minWidth: "180px"
                }}>
                  <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}>💰 Group Pricing</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#34d399" }}>
                    ₹{preview.breakdown.total.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                    incl. tax + fees
                  </div>
                  {preview.breakdown.totalDiscount > 0 && (
                    <div style={{ fontSize: "0.7rem", color: "#34d399", marginTop: "2px" }}>
                      🎉 Save ₹{preview.breakdown.totalDiscount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="btn-primary"
              style={{ 
                marginTop: "12px", 
                width: "100%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              }}
              onClick={() => handleAddToGroupPlan(h)}
            >
              ➕ Add to Group Plan
            </button>
          </div>
        );
      })}

      {/* FALLBACK */}
      {!loading && hotels.length === 0 && (
        <>
          <p style={{ opacity: 0.75, marginTop: "20px" }}>
            Live API returned no data (staging limitation). Showing demo results.
          </p>

          {demoHotels.map((h, i) => {
            const preview = calculatePreviewPricing(h);
            
            return (
              <div key={i} className="glass-card" style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h3>{h.HotelName}</h3>
                    <p>⭐ {h.StarRating} • 📍 {h.Location}</p>
                    <p style={{ fontSize: "1.2rem", color: "#34d399" }}>
                      ₹{h.Price.TotalPrice.toLocaleString('en-IN')} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>(base price)</span>
                    </p>
                  </div>
                  
                  {/* Pricing Preview */}
                  {preview && (
                    <div style={{ 
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                      padding: "12px 16px", 
                      borderRadius: "10px",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                      minWidth: "180px"
                    }}>
                      <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}>💰 Group Pricing</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#34d399" }}>
                        ₹{preview.breakdown.total.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                        incl. tax + fees
                      </div>
                      {preview.breakdown.totalDiscount > 0 && (
                        <div style={{ fontSize: "0.7rem", color: "#34d399", marginTop: "2px" }}>
                          🎉 Save ₹{preview.breakdown.totalDiscount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="btn-primary"
                  style={{ 
                    marginTop: "12px", 
                    width: "100%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  }}
                  onClick={() => handleAddToGroupPlan(h)}
                >
                  ➕ Add to Group Plan
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* Info Box */}
      <div className="glass-card" style={{ 
        marginTop: "24px", 
        background: "rgba(99, 102, 241, 0.1)",
        border: "1px solid rgba(99, 102, 241, 0.3)"
      }}>
        <h3 style={{ margin: "0 0 12px", color: "#a78bfa" }}>💡 Dynamic Pricing Features</h3>
        <ul style={{ margin: 0, paddingLeft: "20px", opacity: 0.85 }}>
          <li>📊 Real-time price from TBO API</li>
          <li>🏷️ 12% GST & 5% Service Fee included</li>
          <li>🦅 5% Early Bird Discount (30+ days ahead)</li>
          <li>👥 10% Group Discount (5+ members)</li>
          <li>⚖️ Equal or Custom Payment Split</li>
          <li>🔄 Price updates automatically</li>
        </ul>
      </div>
    </div>
  );
}
