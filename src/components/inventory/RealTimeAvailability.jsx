import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function RealTimeAvailability() {
  const [availability, setAvailability] = useState([
    {
      id: 1,
      hotelName: "Grand Plaza Hotel",
      roomType: "Deluxe Room",
      totalStock: 50,
      available: 35,
      held: 10,
      booked: 5,
      lastUpdated: new Date().toISOString(),
      status: "healthy"
    },
    {
      id: 2,
      hotelName: "Grand Plaza Hotel",
      roomType: "Suite",
      totalStock: 20,
      available: 8,
      held: 8,
      booked: 4,
      lastUpdated: new Date().toISOString(),
      status: "low"
    },
    {
      id: 3,
      hotelName: "City Inn",
      roomType: "Standard Room",
      totalStock: 100,
      available: 60,
      held: 25,
      booked: 15,
      lastUpdated: new Date().toISOString(),
      status: "healthy"
    },
    {
      id: 4,
      hotelName: "Luxury Suites International",
      roomType: "Presidential Suite",
      totalStock: 5,
      available: 1,
      held: 2,
      booked: 2,
      lastUpdated: new Date().toISOString(),
      status: "critical"
    }
  ]);

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setAvailability(prev => prev.map(item => {
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and 2
        const newAvailable = Math.max(0, Math.min(item.totalStock, item.available + change));
        const newHeld = Math.max(0, Math.min(item.totalStock - newAvailable, item.held - change));

        let status = "healthy";
        const availabilityPercentage = (newAvailable / item.totalStock) * 100;
        if (availabilityPercentage < 20) status = "critical";
        else if (availabilityPercentage < 40) status = "low";

        return {
          ...item,
          available: newAvailable,
          held: newHeld,
          lastUpdated: new Date().toISOString(),
          status
        };
      }));
      setLastRefresh(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "text-red-400 bg-red-500/20";
      case "low": return "text-yellow-400 bg-yellow-500/20";
      case "healthy": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "critical": return <AlertCircle className="w-4 h-4" />;
      case "low": return <Clock className="w-4 h-4" />;
      case "healthy": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getAvailabilityPercentage = (available, total) => {
    return ((available / total) * 100).toFixed(1);
  };

  const manualRefresh = () => {
    setLastRefresh(new Date());
    // Simulate refresh with random changes
    setAvailability(prev => prev.map(item => ({
      ...item,
      lastUpdated: new Date().toISOString()
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Real-Time Availability</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-300">
              Auto-refresh (5s)
            </label>
          </div>
          <button
            onClick={manualRefresh}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Healthy (&gt;40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Low (20-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-gray-300">Critical (&lt;20%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {availability.map((item) => {
          const availabilityPercentage = getAvailabilityPercentage(item.available, item.total);
          const heldPercentage = ((item.held / item.totalStock) * 100).toFixed(1);
          const bookedPercentage = ((item.booked / item.totalStock) * 100).toFixed(1);

          return (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.hotelName}</h3>
                  <p className="text-gray-400">{item.roomType}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="capitalize">{item.status}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Stock</p>
                  <p className="text-2xl font-bold text-white">{item.totalStock}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Available</p>
                  <p className="text-2xl font-bold text-green-400">{item.available}</p>
                  <p className="text-xs text-gray-500">{availabilityPercentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Held</p>
                  <p className="text-2xl font-bold text-yellow-400">{item.held}</p>
                  <p className="text-xs text-gray-500">{heldPercentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Booked</p>
                  <p className="text-2xl font-bold text-blue-400">{item.booked}</p>
                  <p className="text-xs text-gray-500">{bookedPercentage}%</p>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Availability Distribution</span>
                  <span>{availabilityPercentage}% Available</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-400 transition-all duration-500"
                      style={{ width: `${availabilityPercentage}%` }}
                    ></div>
                    <div
                      className="bg-yellow-400 transition-all duration-500"
                      style={{ width: `${heldPercentage}%` }}
                    ></div>
                    <div
                      className="bg-blue-400 transition-all duration-500"
                      style={{ width: `${bookedPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">Available</span>
                  <span className="text-yellow-400">Held</span>
                  <span className="text-blue-400">Booked</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Last updated: {new Date(item.lastUpdated).toLocaleTimeString()}</span>
                  {item.status === 'critical' && (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Action required: Low availability
                    </span>
                  )}
                  {item.status === 'low' && (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Monitor availability closely
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Properties</p>
          <p className="text-2xl font-bold text-white">
            {new Set(availability.map(item => item.hotelName)).size}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Rooms</p>
          <p className="text-2xl font-bold text-white">
            {availability.reduce((sum, item) => sum + item.totalStock, 0)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Available Rooms</p>
          <p className="text-2xl font-bold text-green-400">
            {availability.reduce((sum, item) => sum + item.available, 0)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Critical Alerts</p>
          <p className="text-2xl font-bold text-red-400">
            {availability.filter(item => item.status === 'critical').length}
          </p>
        </div>
      </div>
    </div >
  );
}
