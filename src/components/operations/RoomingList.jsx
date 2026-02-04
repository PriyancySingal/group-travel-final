import { useState } from "react";

export default function RoomingList() {
  const [rooms, setRooms] = useState([
    { id: 101, type: "Deluxe", capacity: 2, assigned: ["Aarav Sharma"], status: "occupied" },
    { id: 102, type: "Deluxe", capacity: 2, assigned: ["Meera Kapoor", "Rohan Das"], status: "occupied" },
    { id: 103, type: "Suite", capacity: 3, assigned: [], status: "available" },
    { id: 104, type: "Deluxe", capacity: 2, assigned: ["Anika Verma"], status: "occupied" },
    { id: 105, type: "Suite", capacity: 4, assigned: [], status: "available" },
    { id: 106, type: "Deluxe", capacity: 2, assigned: [], status: "maintenance" }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'occupied': return 'border-green-500/30 bg-green-500/10';
      case 'available': return 'border-blue-500/30 bg-blue-500/10';
      case 'maintenance': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'occupied': return 'text-green-400 bg-green-400/20';
      case 'available': return 'text-blue-400 bg-blue-400/20';
      case 'maintenance': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Rooming List Management</h3>
        <div className="flex gap-3">
          <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm">
            Filter by Type
          </select>
          <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-sm">
            Quick Assign
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className={`border rounded-xl p-4 ${getStatusColor(room.status)}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-white">Room {room.id}</div>
                <div className="text-sm text-gray-400">{room.type}</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(room.status)}`}>
                {room.status}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Capacity:</span>
                <span className="text-white">{room.capacity}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Occupied:</span>
                <span className="text-white">{room.assigned.length}</span>
              </div>

              {room.assigned.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-2">Guests:</div>
                  <div className="space-y-1">
                    {room.assigned.map((guest, i) => (
                      <div key={i} className="text-xs text-gray-300 bg-white/5 rounded px-2 py-1">
                        {guest}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {room.status === 'available' && (
                <button className="w-full mt-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 py-2 rounded-lg text-sm transition-colors">
                  Assign Guests
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <span className="text-gray-400">Occupied: {rooms.filter(r => r.status === 'occupied').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
            <span className="text-gray-400">Available: {rooms.filter(r => r.status === 'available').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span className="text-gray-400">Maintenance: {rooms.filter(r => r.status === 'maintenance').length}</span>
          </div>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          Export Rooming Chart →
        </button>
      </div>
    </div>
  );
}
