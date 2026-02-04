import { useEffect, useState } from "react";
import { tboAPI, mockHotelData } from "../../lib/tboClient";
import RoomCard from "../../components/rooms/RoomCard";
import RoomStats from "../../components/rooms/RoomStats";

export default function RoomAllocation() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      // Get hotels from TBO API (or mock data)
      const hotels = await tboAPI.getHotels();

      // Transform hotel data to room format
      const roomsData = [];
      hotels.forEach(hotel => {
        hotel.roomTypes.forEach(roomType => {
          roomsData.push({
            id: roomType.id,
            hotelName: hotel.name,
            roomType: roomType.name,
            capacity: roomType.maxOccupancy,
            totalRooms: roomType.totalRooms,
            available: roomType.available,
            held: roomType.held,
            booked: roomType.booked,
            rate: roomType.rate,
            amenities: roomType.amenities,
            guests: [] // Mock guest data - in real app this would come from booking system
          });
        });
      });

      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      // Use mock data as fallback
      const hotels = mockHotelData;
      const roomsData = [];
      hotels.forEach(hotel => {
        hotel.roomTypes.forEach(roomType => {
          roomsData.push({
            id: roomType.id,
            hotelName: hotel.name,
            roomType: roomType.name,
            capacity: roomType.maxOccupancy,
            totalRooms: roomType.totalRooms,
            available: roomType.available,
            held: roomType.held,
            booked: roomType.booked,
            rate: roomType.rate,
            amenities: roomType.amenities,
            guests: []
          });
        });
      });
      setRooms(roomsData);
    }
  };

  useEffect(() => {
    fetchRooms();

    // In production, you might set up polling or WebSocket connections
    // for real-time updates with TBO API
    const interval = setInterval(fetchRooms, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const moveGuest = async (roomId, guest) => {
    try {
      // In a real implementation, this would update the booking system
      // For now, we'll just update the local state
      setRooms(prevRooms =>
        prevRooms.map(room => ({
          ...room,
          guests: room.guests.includes(guest)
            ? room.guests.filter(g => g !== guest)
            : room.guests
        }))
      );

      // Find the target room and add the guest if there's capacity
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId && room.guests.length < room.capacity) {
            return {
              ...room,
              guests: [...room.guests, guest]
            };
          }
          return room;
        })
      );

      console.log(`Moved guest ${guest} to room ${roomId}`);
    } catch (error) {
      console.error('Failed to move guest:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Room Allocation</h1>

      <RoomStats rooms={rooms} />

      <div className="grid md:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onDropGuest={moveGuest}
          />
        ))}
      </div>
    </div>
  );
}
