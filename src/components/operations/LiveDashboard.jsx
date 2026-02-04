import { useState, useEffect } from "react";

export default function LiveDashboard() {
  const [liveStats, setLiveStats] = useState({
    totalGuests: 324,
    checkedIn: 287,
    roomsAssigned: 142,
    activeAlerts: 3,
    currentTime: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
        // Simulate live updates
        checkedIn: Math.min(prev.totalGuests, prev.checkedIn + Math.floor(Math.random() * 3))
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const checkInRate = Math.round((liveStats.checkedIn / liveStats.totalGuests) * 100);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Total Guests</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div className="text-2xl font-bold text-white">{liveStats.totalGuests}</div>
        <div className="text-xs text-gray-500">Registered</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Checked In</span>
          <div className="text-xs text-green-400">+{Math.floor(Math.random() * 5)}/min</div>
        </div>
        <div className="text-2xl font-bold text-green-400">{liveStats.checkedIn}</div>
        <div className="text-xs text-gray-500">{checkInRate}% completion</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Rooms Ready</span>
          <div className="text-xs text-purple-400">Live</div>
        </div>
        <div className="text-2xl font-bold text-purple-400">{liveStats.roomsAssigned}</div>
        <div className="text-xs text-gray-500">Assigned</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Active Alerts</span>
          <div className="text-xs text-red-400">Critical</div>
        </div>
        <div className="text-2xl font-bold text-red-400">{liveStats.activeAlerts}</div>
        <div className="text-xs text-gray-500">Need attention</div>
      </div>

      <div className="md:col-span-4 bg-black/30 border border-white/10 rounded-xl p-3 text-center">
        <div className="text-sm text-gray-400">Live Event Time</div>
        <div className="text-lg font-mono text-white">{liveStats.currentTime}</div>
      </div>
    </div>
  );
}
