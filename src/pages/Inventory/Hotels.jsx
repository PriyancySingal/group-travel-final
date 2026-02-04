import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tboAPI, mockHotelData } from "../../lib/tboClient";
import HotelCard from "../../components/inventory/HotelCard";
import Button from "../../components/ui/Button";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    try {
      // Try to fetch real data from TBO API
      // const response = await tboAPI.getHotels();
      // setHotels(response.HotelList || []);

      // Using mock data for now
      setHotels(mockHotelData);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      // Fallback to mock data
      setHotels(mockHotelData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const addHotel = async () => {
    // In real implementation, this would call TBO API to add hotel
    const newHotel = {
      id: hotels.length + 1,
      name: "New TBO Hotel",
      location: "Dubai",
      roomTypes: [
        { id: hotels.length * 10 + 1, name: "Standard Room", capacity: 2, rate: 5000, available: 10 }
      ]
    };

    setHotels([...hotels, newHotel]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Hotels</h1>
        </div>
        <div className="text-gray-400">Loading hotels from TBO API...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <div className="flex gap-4 mt-2">
            <Link
              to="/events/1/inventory"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              ← Back to Inventory
            </Link>
          </div>
        </div>
        <Button onClick={addHotel}>+ Add Hotel</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <HotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </div>
  );
}
