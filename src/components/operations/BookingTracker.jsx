import { useState } from "react";

export default function BookingTracker() {
  const [bookings, setBookings] = useState([
    { id: "BK001", guest: "Aarav Sharma", status: "confirmed", room: "204", checkIn: "completed" },
    { id: "BK002", guest: "Meera Kapoor", status: "confirmed", room: "105", checkIn: "pending" },
    { id: "BK003", guest: "Rohan Das", status: "confirmed", room: "310", checkIn: "pending" },
    { id: "BK004", guest: "Anika Verma", status: "waitlist", room: "-", checkIn: "-" },
    { id: "BK005", guest: "Kabir Singh", status: "confirmed", room: "208", checkIn: "completed" }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'waitlist': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCheckInColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Booking Status Tracker</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-gray-400">Confirmed</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-gray-400">Pending</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-gray-400">Waitlist</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium text-white">{booking.guest}</div>
                <div className="text-sm text-gray-400">{booking.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Room</div>
                <div className="text-sm font-medium text-white">{booking.room}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Check-in</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getCheckInColor(booking.checkIn)}`}>
                  {booking.checkIn}
                </div>
              </div>

              <button className="text-purple-400 hover:text-purple-300 text-sm">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Total: {bookings.length} bookings
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          Export List →
        </button>
      </div>
    </div>
  );
}
