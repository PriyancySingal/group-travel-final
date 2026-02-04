import { useState } from "react";
import { Bed, Users, DoorOpen, Edit } from "lucide-react";

export default function RoomGrid({ rooms = [] }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "occupied":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getOccupancyPercentage = (room) => {
    if (!room.guests || room.guests.length === 0) return 0;
    return (room.guests.length / room.capacity) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const occupancyPercentage = getOccupancyPercentage(room);
          const status = room.guests && room.guests.length > 0 ? "occupied" : "available";
          
          return (
            <div
              key={room.id}
              className={`bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${getStatusColor(status)}`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">{room.roomType}</h4>
                  <p className="text-sm text-gray-400">{room.hotelName}</p>
                </div>
                <span className="text-2xl font-bold text-white">#{room.id}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{room.guests?.length || 0}/{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Bed className="w-4 h-4" />
                    <span>{room.totalRooms}</span>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status === "occupied" ? "bg-red-400" : "bg-green-400"
                    }`}
                    style={{ width: `${occupancyPercentage}%` }}
                  ></div>
                </div>

                {/* Guest Names */}
                {room.guests && room.guests.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">Guests:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.guests.map((guest, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300"
                        >
                          {guest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-gray-400 capitalize">{status}</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedRoom.roomType} - Room #{selectedRoom.id}
                </h3>
                <p className="text-gray-400">{selectedRoom.hotelName}</p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Capacity</p>
                  <p className="text-lg font-semibold text-white">
                    {selectedRoom.capacity} guests
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Occupancy</p>
                  <p className="text-lg font-semibold text-white">
                    {selectedRoom.guests?.length || 0} guests
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rate</p>
                  <p className="text-lg font-semibold text-green-400">
                    ₹{selectedRoom.rate?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Current Guests</p>
                  <div className="space-y-2">
                    {selectedRoom.guests && selectedRoom.guests.length > 0 ? (
                      selectedRoom.guests.map((guest, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 border border-white/10 rounded-lg p-3"
                        >
                          <p className="text-white">{guest}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No guests assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                Edit Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
