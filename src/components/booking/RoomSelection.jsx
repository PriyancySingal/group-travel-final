import { useState } from "react";

export default function RoomSelection({ selectedRoom, onRoomSelect, selectedPackage }) {
  const [selectedFloor, setSelectedFloor] = useState("all");

  // Mock room data based on selected package
  const rooms = {
    standard: [
      { id: 101, floor: 1, type: "Standard", capacity: 2, price: 8000, available: true, features: ["City View", "Queen Bed", "Work Desk"] },
      { id: 102, floor: 1, type: "Standard", capacity: 2, price: 8000, available: true, features: ["Garden View", "Queen Bed", "Work Desk"] },
      { id: 103, floor: 1, type: "Standard", capacity: 2, price: 8000, available: false, features: ["Pool View", "Queen Bed", "Work Desk"] },
      { id: 201, floor: 2, type: "Standard", capacity: 2, price: 8500, available: true, features: ["City View", "King Bed", "Work Desk"] },
      { id: 202, floor: 2, type: "Standard", capacity: 2, price: 8500, available: true, features: ["Garden View", "King Bed", "Work Desk"] },
    ],
    premium: [
      { id: 301, floor: 3, type: "Deluxe", capacity: 2, price: 15000, available: true, features: ["Ocean View", "King Bed", "Living Area", "Mini Bar"] },
      { id: 302, floor: 3, type: "Deluxe", capacity: 2, price: 15000, available: true, features: ["Ocean View", "Queen Bed", "Living Area", "Mini Bar"] },
      { id: 303, floor: 3, type: "Deluxe", capacity: 2, price: 15000, available: false, features: ["Ocean View", "King Bed", "Living Area", "Mini Bar"] },
      { id: 401, floor: 4, type: "Deluxe", capacity: 2, price: 16000, available: true, features: ["City View", "King Bed", "Living Area", "Mini Bar"] },
    ],
    luxury: [
      { id: 501, floor: 5, type: "Suite", capacity: 4, price: 35000, available: true, features: ["Panoramic View", "King Bed", "Living Room", "Dining Area", "Mini Bar", "Jacuzzi"] },
      { id: 502, floor: 5, type: "Suite", capacity: 4, price: 35000, available: true, features: ["Ocean View", "King Bed", "Living Room", "Dining Area", "Mini Bar", "Jacuzzi"] },
      { id: 601, floor: 6, type: "Suite", capacity: 4, price: 40000, available: false, features: ["Panoramic View", "King Bed", "Living Room", "Dining Area", "Mini Bar", "Jacuzzi", "Butler Service"] },
    ]
  };

  const currentRooms = rooms[selectedPackage] || rooms.standard;
  const availableRooms = currentRooms.filter(room => room.available);

  const filteredRooms = selectedFloor === "all" 
    ? availableRooms 
    : availableRooms.filter(room => room.floor === parseInt(selectedFloor));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Room</h2>
        <p className="text-lg text-gray-600">Choose from our available accommodations</p>
      </div>

      {/* Floor Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => setSelectedFloor("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFloor === "all"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Floors
          </button>
          {[1, 2, 3, 4, 5, 6].map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor.toString())}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFloor === floor.toString()
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all ${
              selectedRoom === room.id
                ? "border-purple-500 shadow-purple-200"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => onRoomSelect(room.id)}
          >
            {/* Room Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Room {room.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    Floor {room.floor} • {room.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{room.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>

              {/* Room Features */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m0 0v2a3 3 0 005.356 1.857M17 20H7m0 0v2a3 3 0 005.356 1.857M17 20H7m0 0v2a3 3 0 005.356 1.857M17 20H7m0 0v2a3 3 0 005.356 1.857" />
                  </svg>
                  <span>Capacity: {room.capacity} guests</span>
                </div>
                <div className="space-y-1">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Status */}
              <div className={`py-2 rounded-lg text-center font-medium transition-colors ${
                selectedRoom === room.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {selectedRoom === room.id ? "Selected" : "Select Room"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Rooms Message */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No rooms available on the selected floor
          </div>
          <button
            onClick={() => setSelectedFloor("all")}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View All Floors
          </button>
        </div>
      )}

      {/* Selection Summary */}
      {selectedRoom && (
        <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selected Room</h3>
              <p className="text-gray-600">
                Room {selectedRoom} • {currentRooms.find(r => r.id === selectedRoom)?.type}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                ₹{currentRooms.find(r => r.id === selectedRoom)?.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
