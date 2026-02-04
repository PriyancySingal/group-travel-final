export default function HotelCard({ hotel }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="font-semibold">{hotel.name}</h3>
      <p className="text-gray-400 text-sm">{hotel.location}</p>

      {hotel.roomTypes && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500">Room Types:</p>
          {hotel.roomTypes.map((room) => (
            <div key={room.id} className="text-xs text-gray-300 bg-white/5 rounded p-2">
              <div className="flex justify-between">
                <span>{room.name}</span>
                <span className="text-purple-400">₹{room.rate}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Capacity: {room.capacity}</span>
                <span className="text-green-400">Available: {room.available}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
