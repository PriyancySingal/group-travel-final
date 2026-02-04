import { useState } from "react";

export default function CheckInManagement() {
  const [checkIns, setCheckIns] = useState([
    { id: 1, name: "Aarav Sharma", bookingId: "BK001", status: "completed", time: "9:15 AM", room: "204" },
    { id: 2, name: "Meera Kapoor", bookingId: "BK002", status: "pending", time: "-", room: "105" },
    { id: 3, name: "Rohan Das", bookingId: "BK003", status: "pending", time: "-", room: "310" },
    { id: 4, name: "Anika Verma", bookingId: "BK004", status: "completed", time: "9:30 AM", room: "104" },
    { id: 5, name: "Kabir Singh", bookingId: "BK005", status: "completed", time: "9:45 AM", room: "208" }
  ]);

  const handleCheckIn = (id) => {
    setCheckIns(prev => prev.map(checkIn => 
      checkIn.id === id 
        ? { 
            ...checkIn, 
            status: "completed", 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        : checkIn
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const completedCount = checkIns.filter(c => c.status === 'completed').length;
  const totalCount = checkIns.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Check-in Management</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Progress: {completedCount}/{totalCount}
          </div>
          <div className="w-32 bg-white/10 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-sm text-green-400 font-medium">
            {completionRate}%
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{completedCount}</div>
          <div className="text-xs text-gray-400">Checked In</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{totalCount - completedCount}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{completionRate}%</div>
          <div className="text-xs text-gray-400">Completion</div>
        </div>
      </div>

      {/* Check-in List */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400 mb-3">Guest Check-ins</div>
        
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium text-white">{checkIn.name}</div>
                <div className="text-sm text-gray-400">{checkIn.bookingId} • Room {checkIn.room}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-sm text-white">{checkIn.time}</div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(checkIn.status)}`}>
                {checkIn.status}
              </div>

              {checkIn.status === 'pending' && (
                <button
                  onClick={() => handleCheckIn(checkIn.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Check In
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Next expected: 10:15 AM
        </div>
        <div className="flex gap-3">
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            Print Badges →
          </button>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            Bulk Check-in →
          </button>
        </div>
      </div>
    </div>
  );
}
