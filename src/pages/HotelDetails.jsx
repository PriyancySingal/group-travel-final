import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state;

  // 🔒 Safety check (VERY IMPORTANT)
  if (!hotel) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ marginTop: "60px" }}>
          <h2 style={{ color: "white" }}>No hotel data found</h2>
          <p>Please go back and select a hotel.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container fade-in" style={{ marginTop: "60px" }}>
        {/* ❌ IMAGE REMOVED FOR NOW (was causing blank page) */}

        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          {hotel.name}
        </h1>

        <p style={{ color: "#c7d2fe", marginBottom: "10px" }}>
          📍 {hotel.location}
        </p>

        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          ⭐ {hotel.rating}
        </p>

        <p style={{ fontSize: "20px", fontWeight: 600 }}>
          💰 {hotel.price}
        </p>

        <button
          className="btn-primary"
          style={{ marginTop: "24px" }}
          onClick={() => navigate("/group-dashboard", { state: hotel })}
        >
          Add to Group Plan
        </button>
      </div>
    </>
  );
};

export default HotelDetails;