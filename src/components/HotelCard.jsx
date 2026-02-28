import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/hotel/${hotel.id}`, { state: hotel })}
    >
      <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
        {hotel.name}
      </h2>

      <p style={{ color: "#c7d2fe", marginBottom: "6px" }}>
        📍 {hotel.location}
      </p>

      <p style={{ fontWeight: 600 }}>
        💰 {hotel.price}
      </p>

      <p style={{ marginTop: "6px" }}>
        ⭐ {hotel.rating}
      </p>
    </div>
  );
};

export default HotelCard;