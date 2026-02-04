import { useState } from "react";
import LiveDashboard from "../../components/operations/LiveDashboard";
import BookingTracker from "../../components/operations/BookingTracker";
import RoomingList from "../../components/operations/RoomingList";
import AlertsPanel from "../../components/operations/AlertsPanel";
import BroadcastMessaging from "../../components/operations/BroadcastMessaging";
import CheckInManagement from "../../components/operations/CheckInManagement";
import SupplierExports from "../../components/operations/SupplierExports";

export default function OperationsCenter() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Live Dashboard", icon: "📊" },
    { id: "bookings", label: "Booking Status", icon: "📋" },
    { id: "rooming", label: "Rooming List", icon: "🏠" },
    { id: "alerts", label: "Alerts", icon: "🚨" },
    { id: "messaging", label: "Broadcast", icon: "📢" },
    { id: "checkin", label: "Check-in", icon: "✅" },
    { id: "suppliers", label: "Suppliers", icon: "🚚" }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "dashboard":
        return <LiveDashboard />;
      case "bookings":
        return <BookingTracker />;
      case "rooming":
        return <RoomingList />;
      case "alerts":
        return <AlertsPanel />;
      case "messaging":
        return <BroadcastMessaging />;
      case "checkin":
        return <CheckInManagement />;
      case "suppliers":
        return <SupplierExports />;
      default:
        return <LiveDashboard />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Operations Center</h1>
          <p className="text-gray-400 mt-1">Real-time event execution and monitoring</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Event Live</span>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
            Event: Tech Conference 2026
          </div>
          
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium">
            Emergency Stop
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-1">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Operations Status: All systems running normally
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-300">Check-in: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-300">Catering: On Schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-gray-300">Transport: 5 min delay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
