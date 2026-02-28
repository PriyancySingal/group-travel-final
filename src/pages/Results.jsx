// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { calculateDynamicPricing } from "../services/PricingService";

// export default function Results() {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [previewHotel, setPreviewHotel] = useState(null);
//   const navigate = useNavigate();

//   // Default dates for pricing calculation
//   const defaultCheckIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
//   const defaultCheckOut = new Date(defaultCheckIn.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 nights

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/hotels`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         CityId: "110089",
//         CheckInDate: "2024-12-20",
//         CheckOutDate: "2024-12-22",
//         Rooms: 1
//       })
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log("LIVE TBO RESPONSE:", data);
//         setHotels(data?.HotelSearchResult?.HotelResults || []);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   // Calculate preview pricing for a hotel
//   const calculatePreviewPricing = (hotel) => {
//     if (!hotel || !hotel.Price) return null;

//     return calculateDynamicPricing(hotel, {
//       checkInDate: defaultCheckIn.toISOString().split('T')[0],
//       checkOutDate: defaultCheckOut.toISOString().split('T')[0],
//       rooms: 1,
//       memberCount: 2 // Preview for 2 members
//     });
//   };

//   const handleAddToGroupPlan = (hotel) => {
//     // Calculate pricing before navigating
//     const pricing = calculatePreviewPricing(hotel);

//     // Navigate with hotel and pricing data
//     navigate("/group-dashboard", { 
//       state: { 
//         ...hotel,
//         _pricing: pricing,
//         _checkIn: defaultCheckIn.toISOString().split('T')[0],
//         _checkOut: defaultCheckOut.toISOString().split('T')[0],
//         _rooms: 1
//       } 
//     });
//   };

//   // Demo fallback hotels
//   const demoHotels = [
//     {
//       HotelName: "Grand Himalayan Resort",
//       StarRating: 4.6,
//       Price: { TotalPrice: 4500 },
//       Location: "Gangtok"
//     },
//     {
//       HotelName: "Mountain View Palace",
//       StarRating: 4.8,
//       Price: { TotalPrice: 6200 },
//       Location: "Gangtok"
//     }
//   ];

//   return (
//     <div className="container">
//       <h1>🏨 Live Hotel Results (TBO API)</h1>
//       <p style={{ opacity: 0.7, marginBottom: "20px" }}>
//         Click "Add to Group Plan" to see dynamic pricing with taxes, discounts, and payment splits!
//       </p>

//       {loading && <p>Fetching real-time availability…</p>}

//       {/* LIVE RESULTS */}
//       {hotels.map((h, i) => {
//         const preview = calculatePreviewPricing(h);

//         return (
//           <div 
//             key={i} 
//             className="glass-card" 
//             style={{ marginTop: "16px" }}
//             onMouseEnter={() => setPreviewHotel(h)}
//             onMouseLeave={() => setPreviewHotel(null)}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//               <div style={{ flex: 1 }}>
//                 <h3>{h.HotelName}</h3>
//                 <p>⭐ {h.StarRating} • 📍 {h.Location || "Unknown"}</p>
//                 <p style={{ fontSize: "1.2rem", color: "#34d399" }}>
//                   ₹{h.Price?.TotalPrice?.toLocaleString('en-IN')} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>(base price)</span>
//                 </p>
//               </div>

//               {/* Live Pricing Preview */}
//               {preview && (
//                 <div style={{ 
//                   background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
//                   padding: "12px 16px", 
//                   borderRadius: "10px",
//                   border: "1px solid rgba(52, 211, 153, 0.3)",
//                   minWidth: "180px"
//                 }}>
//                   <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}>💰 Group Pricing</div>
//                   <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#34d399" }}>
//                     ₹{preview.breakdown.total.toLocaleString('en-IN')}
//                   </div>
//                   <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
//                     incl. tax + fees
//                   </div>
//                   {preview.breakdown.totalDiscount > 0 && (
//                     <div style={{ fontSize: "0.7rem", color: "#34d399", marginTop: "2px" }}>
//                       🎉 Save ₹{preview.breakdown.totalDiscount.toLocaleString('en-IN')}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <button
//               className="btn-primary"
//               style={{ 
//                 marginTop: "12px", 
//                 width: "100%",
//                 background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
//               }}
//               onClick={() => handleAddToGroupPlan(h)}
//             >
//               ➕ Add to Group Plan
//             </button>
//           </div>
//         );
//       })}

//       {/* FALLBACK */}
//       {!loading && hotels.length === 0 && (
//         <>
//           <p style={{ opacity: 0.75, marginTop: "20px" }}>
//             Live API returned no data (staging limitation). Showing demo results.
//           </p>

//           {demoHotels.map((h, i) => {
//             const preview = calculatePreviewPricing(h);

//             return (
//               <div key={i} className="glass-card" style={{ marginTop: "16px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <div style={{ flex: 1 }}>
//                     <h3>{h.HotelName}</h3>
//                     <p>⭐ {h.StarRating} • 📍 {h.Location}</p>
//                     <p style={{ fontSize: "1.2rem", color: "#34d399" }}>
//                       ₹{h.Price.TotalPrice.toLocaleString('en-IN')} <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>(base price)</span>
//                     </p>
//                   </div>

//                   {/* Pricing Preview */}
//                   {preview && (
//                     <div style={{ 
//                       background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
//                       padding: "12px 16px", 
//                       borderRadius: "10px",
//                       border: "1px solid rgba(52, 211, 153, 0.3)",
//                       minWidth: "180px"
//                     }}>
//                       <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}>💰 Group Pricing</div>
//                       <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#34d399" }}>
//                         ₹{preview.breakdown.total.toLocaleString('en-IN')}
//                       </div>
//                       <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
//                         incl. tax + fees
//                       </div>
//                       {preview.breakdown.totalDiscount > 0 && (
//                         <div style={{ fontSize: "0.7rem", color: "#34d399", marginTop: "2px" }}>
//                           🎉 Save ₹{preview.breakdown.totalDiscount.toLocaleString('en-IN')}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   className="btn-primary"
//                   style={{ 
//                     marginTop: "12px", 
//                     width: "100%",
//                     background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
//                   }}
//                   onClick={() => handleAddToGroupPlan(h)}
//                 >
//                   ➕ Add to Group Plan
//                 </button>
//               </div>
//             );
//           })}
//         </>
//       )}

//       {/* Info Box */}
//       <div className="glass-card" style={{ 
//         marginTop: "24px", 
//         background: "rgba(99, 102, 241, 0.1)",
//         border: "1px solid rgba(99, 102, 241, 0.3)"
//       }}>
//         <h3 style={{ margin: "0 0 12px", color: "#a78bfa" }}>💡 Dynamic Pricing Features</h3>
//         <ul style={{ margin: 0, paddingLeft: "20px", opacity: 0.85 }}>
//           <li>📊 Real-time price from TBO API</li>
//           <li>🏷️ 12% GST & 5% Service Fee included</li>
//           <li>🦅 5% Early Bird Discount (30+ days ahead)</li>
//           <li>👥 10% Group Discount (5+ members)</li>
//           <li>⚖️ Equal or Custom Payment Split</li>
//           <li>🔄 Price updates automatically</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://group-travel-final.onrender.com";

// Premium Hotel Images - Multiple images per hotel theme
const HOTEL_IMAGE_SETS = [
  [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618773421522-1897ad40746f?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590080876?w=800&h=400&fit=crop"
  ],
  [
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1564078516533-13f6855d1ede?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1568694846914-96b305d2aaeb?w=800&h=400&fit=crop"
  ],
  [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595521624217-1d4da5dd061d?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1611892473155-17c3ffe2f0e0?w=800&h=400&fit=crop"
  ],
  [
    "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=400&fit=crop"
  ],
  [
    "https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578683078519-aab73295c5e3?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=400&fit=crop"
  ]
];

// Modal Component for Add to Group Plan
// Enhanced Modal Component for Add to Group Plan
function AddToGroupPlanModal({ isOpen, hotel, checkIn, checkOut, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Multi-step form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "MICE", // MICE, Wedding, Conference
    numberOfRooms: 1,
    checkInDate: checkIn,
    checkOutDate: checkOut
  });

  const [pricing, setPricing] = useState(null);
  const [suitability, setSuitability] = useState(null);

  // Event type details
  const eventTypeDetails = {
    MICE: {
      icon: "🏢",
      name: "MICE (Meetings, Incentives, Conferences)",
      description: "Corporate meetings and professional events",
      features: ["Networking tools", "Seating algorithm", "Event scheduling"]
    },
    Wedding: {
      icon: "💒",
      name: "Wedding Event",
      description: "Wedding ceremonies and receptions",
      features: ["Dietary management", "Room grouping", "Vendor coordination"]
    },
    Conference: {
      icon: "🎤",
      name: "Conference & Summit",
      description: "Large-scale conferences and summits",
      features: ["Session scheduling", "Speaker tagging", "Digital badges"]
    }
  };

  // Calculate pricing when parameters change
  useEffect(() => {
    const calculatePricing = () => {
      const basePrice = hotel?.Rooms?.[0]?.TotalFare || 0;
      // use the formData dates to avoid undefined variables
      const nights = Math.ceil(
        (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24)
      );

      const TAX_RATE = 0.12;
      const SERVICE_FEE_RATE = 0.05;

      const baseTotal = basePrice * formData.numberOfRooms * nights;
      const gst = Math.round(baseTotal * TAX_RATE);
      const serviceFee = Math.round(baseTotal * SERVICE_FEE_RATE);

      // Group discount if 5+ members
      let groupDiscount = 0;
      
      // Early bird discount
      const bookingDate = new Date();
      const isEarlyBird = bookingDate <= new Date(formData.checkInDate);
      let earlyBirdDiscount = isEarlyBird ? Math.round((baseTotal + gst + serviceFee) * 0.07) : 0;

      const subtotalWithTaxes = baseTotal + gst + serviceFee;
      const totalDiscount = groupDiscount + earlyBirdDiscount;
      const totalFinal = subtotalWithTaxes - totalDiscount;

      setPricing({
        basePrice,
        baseTotal,
        gst,
        serviceFee,
        groupDiscount,
        earlyBirdDiscount,
        totalDiscount,
        subtotal: subtotalWithTaxes,
        finalTotal: totalFinal,
        pricePerRoom: basePrice * nights,
        nights
      });
    };

    if (hotel) {
      calculatePricing();
      // Mock suitability calculation
      setSuitability({
        overallScore: Math.floor(Math.random() * 30 + 70),
        recommendation: `${eventTypeDetails[formData.eventType]?.name} compatible`
      });
    }
  }, [hotel, formData.checkOutDate, formData.checkInDate, formData.numberOfRooms, formData.eventType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfRooms" ? parseInt(value) || 1 : value
    }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.eventName) {
      setError("Please enter an event name");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to continue");
        setLoading(false);
        return;
      }

      const payload = {
        hotelId: hotel.HotelCode,
        hotelCode: hotel.HotelCode,
        hotelName: hotel.Rooms?.[0]?.Name?.[0] || "Hotel Room",
        city: "Delhi", // Mock - should come from search params
        eventName: formData.eventName,
        eventType: formData.eventType,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfRooms: formData.numberOfRooms,
        basePrice: pricing?.basePrice || 0,
        amenities: ["WiFi", "Parking", "AC", "Hot Water"]
      };

      const response = await fetch(`${API_BASE_URL}/api/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create group booking");
      }

      // Show success message
      alert(`✅ Group "${formData.eventName}" created successfully!\n\nRedirecting to dashboard...`);

      // Navigate to group dashboard
      navigate(`/group-dashboard`, {
        state: {
          bookingId: data.data.bookingId,
          eventName: formData.eventName,
          eventType: formData.eventType,
          pricing: data.data.pricingBreakdown,
          hotel: payload
        }
      });

      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.message || "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        className="add-group-modal"
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
          animation: "slideUp 0.3s ease-out",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* style overrides for modal inputs */}
        <style>{`.add-group-modal input {background: #fff !important; color: #0f172a !important;} .add-group-modal input::placeholder {color: #6b7280 !important;}`}</style>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}
        >
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.8rem" }}>
            ➕ Add to Group Plan
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#9ca3af"
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px"
          }}
        >
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: "4px",
                backgroundColor: step >= s ? "#667eea" : "#e5e7eb",
                borderRadius: "2px",
                transition: "all 0.3s"
              }}
            />
          ))}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.9rem"
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Event Details */}
        {step === 1 && (
          <form>
            {/* Hotel Summary Card */}
            <div
              style={{
                backgroundColor: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(120, 81, 169, 0.1) 100%)",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid rgba(102, 126, 234, 0.2)"
              }}
            >
              <h4 style={{ margin: "0 0 12px", color: "#0f172a" }}>
                Selected Hotel
              </h4>
              <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#374151" }}>
                <strong>Room:</strong> {hotel.Rooms?.[0]?.Name?.[0] || "Hotel Room"}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#374151" }}>
                <strong>Base Price:</strong> ₹{hotel.Rooms?.[0]?.TotalFare?.toLocaleString("en-IN") || "N/A"}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#374151" }}>
                <strong>Dates:</strong> {checkIn} to {checkOut}
              </p>
            </div>

            {/* Event Name */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#0f172a",
                  fontSize: "0.95rem"
                }}
              >
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="e.g., Annual Tech Summit 2025"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s",
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "#0f172a"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Event Type Selection */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontWeight: "600",
                  color: "#0f172a",
                  fontSize: "0.95rem"
                }}
              >
                Event Type *
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px"
                }}
              >
                {Object.entries(eventTypeDetails).map(([type, details]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: "eventType", value: type } })}
                    style={{
                      padding: "16px",
                      border:
                        formData.eventType === type
                          ? "2px solid #667eea"
                          : "2px solid #e5e7eb",
                      borderRadius: "10px",
                      backgroundColor:
                        formData.eventType === type ? "rgba(102, 126, 234, 0.1)" : "white",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      textAlign: "center"
                    }}
                    onMouseEnter={(e) => {
                      if (formData.eventType !== type) {
                        e.currentTarget.style.borderColor = "#667eea";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.eventType !== type) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                      {details.icon}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0f172a" }}>
                      {type}
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "#6b7280" }}>
                {eventTypeDetails[formData.eventType]?.description}
              </p>
            </div>

            {/* Number of Rooms */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#0f172a",
                  fontSize: "0.95rem"
                }}
              >
                Number of Rooms *
              </label>
              <input
                type="number"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleInputChange}
                min="1"
                max="20"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "#0f172a"
                }}
              />
            </div>

            {/* Suitability Score */}
            {suitability && (
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  padding: "16px",
                  borderRadius: "10px",
                  marginBottom: "24px",
                  border: "1px solid #bbf7d0"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#166534" }}>
                      ✨ Hotel Suitability for {formData.eventType}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#4b5563" }}>
                      {suitability.recommendation}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#16a34a"
                    }}
                  >
                    {suitability.overallScore}%
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
              }}
            >
              Next: Review Pricing → 
            </button>
          </form>
        )}

        {/* STEP 2: Pricing Review */}
        {step === 2 && pricing && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ margin: "0 0 20px", color: "#0f172a" }}>
              Pricing Breakdown
            </h3>

            {/* Pricing Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "24px"
              }}
            >
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>
                  Base Price
                </p>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#667eea" }}>
                  ₹{pricing.baseTotal?.toLocaleString("en-IN")}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>
                  GST (12%)
                </p>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#f59e0b" }}>
                  ₹{pricing.gst?.toLocaleString("en-IN")}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>
                  Service Fee (5%)
                </p>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#f59e0b" }}>
                  ₹{pricing.serviceFee?.toLocaleString("en-IN")}
                </p>
              </div>

              {pricing.earlyBirdDiscount > 0 && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0"
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#166534", fontWeight: "600" }}>
                    Early Bird Discount (7%)
                  </p>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#16a34a" }}>
                    - ₹{pricing.earlyBirdDiscount?.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div
              style={{
                backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "24px",
                textAlign: "center"
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: "0.9rem", opacity: 0.9 }}>
                Total Amount to Collect
              </p>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: "700" }}>
                ₹{pricing.finalTotal?.toLocaleString("en-IN")}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
                For {formData.numberOfRooms} room(s) × {pricing.nights} night(s)
              </p>
            </div>

            {/* Info Box */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontSize: "0.85rem",
                color: "#92400e"
              }}
            >
              💡 Invite members to share the cost. Add group members after creation to enjoy group discounts!
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? "Creating..." : "✅ Create Group"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Hotel Card Component with Image Gallery
function HotelCard({ hotel, index, onSelect }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const images = HOTEL_IMAGE_SETS[index % HOTEL_IMAGE_SETS.length];
  const firstRoom = hotel.Rooms?.[0];

  return (
    <div
      className="hotel-card"
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        transform: "translateY(0) scale(1)",
        animation: `slideUpFade 0.6s ease-out ${index * 0.08}s both`,
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.12)";
      }}
    >
      {/* Image Gallery Section */}
      <div
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        {/* Main Image */}
        <img
          src={images[currentImageIdx]}
          alt={`Hotel ${index}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease-out",
            transform: "scale(1)"
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            e.currentTarget.style.transform = `scale(1.1) translateX(${(x - 0.5) * 20}px)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />

        {/* Image Indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "6px",
            zIndex: 10
          }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIdx(idx);
              }}
              style={{
                width: idx === currentImageIdx ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === currentImageIdx ? "white" : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                opacity: 0.9
              }}
            />
          ))}
        </div>

        {/* Price Badge - Floating */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            backgroundColor: "rgba(16, 185, 129, 0.95)",
            color: "white",
            padding: "10px 16px",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: "700",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
            animation: "floatBounce 3s ease-in-out infinite"
          }}
        >
          ₹ {firstRoom?.TotalFare?.toLocaleString("en-IN")}
        </div>

        {/* Hotel Code Badge */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "rgba(102, 126, 234, 0.95)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "600",
            backdropFilter: "blur(8px)"
          }}
        >
          #{hotel.HotelCode}
        </div>

        {/* Refundable Badge */}
        {firstRoom?.IsRefundable && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              backgroundColor: "rgba(34, 197, 94, 0.95)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backdropFilter: "blur(8px)"
            }}
          >
            ✓ Refundable
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: "24px" }}>
        {/* Room Name */}
        <h3
          style={{
            margin: "0 0 16px",
            color: "#0f172a",
            fontSize: "1.25rem",
            fontWeight: "700",
            lineHeight: "1.4"
          }}
        >
          {firstRoom?.Name?.[0] || "Luxury Room"}
        </h3>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              backgroundColor: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(120, 81, 169, 0.08) 100%)",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(120, 81, 169, 0.15) 100%)";
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(120, 81, 169, 0.08) 100%)";
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.2)";
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
              Tax & Fees
            </p>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#f59e0b" }}>
              ₹ {firstRoom?.TotalTax?.toLocaleString("en-IN")}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(120, 81, 169, 0.08) 100%)",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(120, 81, 169, 0.15) 100%)";
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(120, 81, 169, 0.08) 100%)";
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.2)";
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
              Meal Plan
            </p>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#667eea" }}>
              {firstRoom?.MealType || "Room Only"}
            </p>
          </div>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>
            Amenities:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Free WiFi", "AC", "TV", "Hot Water"].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "#e2e8f0",
                  color: "#334155",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: "500"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSelect}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
            letterSpacing: "0.5px"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.35)";
          }}
        >
          ➕ Add to Group Plan
        </button>
      </div>
    </div>
  );
}

// Fallback hotel data for when API is not available
const FALLBACK_HOTELS = [
  {
    HotelCode: "DEMO001",
    HotelName: "The Grand Palace Hotel & Convention Center",
    StarRating: 4.5,
    Location: "Delhi",
    Price: { TotalPrice: 5500 },
    Rooms: [
      {
        Name: ["Deluxe Suite"],
        TotalFare: 5500,
        TotalTax: 850,
        IsRefundable: true,
        MealType: "Free Breakfast"
      }
    ]
  },
  {
    HotelCode: "DEMO002",
    HotelName: "Skyline Resort & Spa International",
    StarRating: 4.8,
    Location: "Mumbai",
    Price: { TotalPrice: 7200 },
    Rooms: [
      {
        Name: ["Premium Room"],
        TotalFare: 7200,
        TotalTax: 1100,
        IsRefundable: true,
        MealType: "Free Breakfast & Dinner"
      }
    ]
  },
  {
    HotelCode: "DEMO003",
    HotelName: "Garden View Inn & Business Center",
    StarRating: 4.2,
    Location: "Bangalore",
    Price: { TotalPrice: 3800 },
    Rooms: [
      {
        Name: ["Standard Room"],
        TotalFare: 3800,
        TotalTax: 580,
        IsRefundable: false,
        MealType: "Room Only"
      }
    ]
  },
  {
    HotelCode: "DEMO004",
    HotelName: "Luxury Stay Beach Resort & Casino",
    StarRating: 5.0,
    Location: "Goa",
    Price: { TotalPrice: 8900 },
    Rooms: [
      {
        Name: ["Beach Villa"],
        TotalFare: 8900,
        TotalTax: 1350,
        IsRefundable: true,
        MealType: "Free Breakfast"
      }
    ]
  },
  {
    HotelCode: "DEMO005",
    HotelName: "Business Express Hotel & Conference Hall",
    StarRating: 4.3,
    Location: "Hyderabad",
    Price: { TotalPrice: 4200 },
    Rooms: [
      {
        Name: ["Executive Room"],
        TotalFare: 4200,
        TotalTax: 640,
        IsRefundable: true,
        MealType: "Free Breakfast"
      }
    ]
  },
  {
    HotelCode: "DEMO006",
    HotelName: "Heritage Grand Hotel & Royal Banquet",
    StarRating: 4.6,
    Location: "Jaipur",
    Price: { TotalPrice: 4800 },
    Rooms: [
      {
        Name: ["Royal Suite"],
        TotalFare: 4800,
        TotalTax: 730,
        IsRefundable: true,
        MealType: "Free Breakfast"
      }
    ]
  }
];

export default function Results() {
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const today = new Date();
  today.setDate(today.getDate() + 3);
  const checkIn = today.toISOString().split("T")[0];

  const checkOutDate = new Date(today);
  checkOutDate.setDate(checkOutDate.getDate() + 2);
  const checkOut = checkOutDate.toISOString().split("T")[0];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hotels`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            CityCode: "130443",
            CheckIn: checkIn,
            CheckOut: checkOut,
            Adults: 1
          })
        });

        const data = await response.json();

        if (data?.Status?.Code === 200 && data?.HotelResult && data.HotelResult.length > 0) {
          setHotels(data.HotelResult);
          setUsingFallback(false);
        } else {
          // API returned empty or no data, use fallback
          console.log("API returned no data, using fallback hotels");
          setHotels(FALLBACK_HOTELS);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // API failed, use fallback data
        console.log("API not available, using fallback hotels");
        setHotels(FALLBACK_HOTELS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px", animation: "spin 2s linear infinite" }}>
            ✈️
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: "700" }}>
            Searching Hotels...
          </h2>
          <p style={{ margin: 0, fontSize: "1rem", opacity: 0.9 }}>
            Finding the best deals for your trip
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px 20px 40px",
          color: "white",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-1px" }}>
          🏨 Discover Hotels
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: "1.1rem", opacity: 0.95 }}>
          Hotels
        </p>

        {/* Search Info Cards */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "24px"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Check-in</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: "700" }}>
              {new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Check-out</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: "700" }}>
              {new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Duration</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: "700" }}>
              2 Nights
            </p>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div style={{ padding: "60px 20px" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "32px"
          }}
        >
          {hotels.map((hotel, index) => (
            <HotelCard
              key={index}
              hotel={hotel}
              index={index}
              onSelect={() => setSelectedHotel(hotel)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AddToGroupPlanModal
        isOpen={!!selectedHotel}
        hotel={selectedHotel}
        checkIn={checkIn}
        checkOut={checkOut}
        onClose={() => setSelectedHotel(null)}
      />

      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hotel-card {
          position: relative;
        }

        .hotel-card:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}