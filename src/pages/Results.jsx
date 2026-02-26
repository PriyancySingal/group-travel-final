import { useEffect, useState } from "react";

const API_BASE_URL = "https://group-travel-final.onrender.com";

export default function Results() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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

        if (data?.Status?.Code === 200 && data?.HotelResult) {
          setHotels(data.HotelResult);
        }

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <h2>Loading hotels...</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏨 Live Hotel Results</h1>

      {hotels.map((hotel, index) => {
        const firstRoom = hotel.Rooms?.[0];

        return (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px"
            }}
          >
            <h3>Hotel Code: {hotel.HotelCode}</h3>

            <p>Currency: {hotel.Currency}</p>

            {firstRoom && (
              <>
                <p>🛏 Room Type: {firstRoom.Name?.[0]}</p>

                <p>
                  💰 Price: {firstRoom.TotalFare?.toLocaleString("en-US")}{" "}
                  {hotel.Currency}
                </p>

                <p>🧾 Tax: {firstRoom.TotalTax}</p>

                <p>🍽 Meal: {firstRoom.MealType}</p>

                <p>
                  🔁 Refundable: {firstRoom.IsRefundable ? "Yes" : "No"}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}