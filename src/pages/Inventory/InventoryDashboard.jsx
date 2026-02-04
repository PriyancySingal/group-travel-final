import { useState } from "react";
import { Link } from "react-router-dom";
import StockCounter from "../../components/inventory/StockCounter";
import PackageBuilder from "../../components/inventory/PackageBuilder";
import HoldReleaseLogic from "../../components/inventory/HoldReleaseLogic";
import AddHotelModal from "../../components/inventory/AddHotelModal";
import Button from "../../components/ui/Button";

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddHotel, setShowAddHotel] = useState(false);

  // Mock data for demonstration
  const stats = {
    total: 175,
    held: 45,
    hotels: 4,
    available: 130
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "packages", label: "Group Packages", icon: "📦" },
    { id: "holds", label: "Room Blocks", icon: "🔒" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Group Inventory Management</h1>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddHotel(true)}>
            Add Hotel
          </Button>
          <Link to="/events/1/inventory/hotels">
            <Button variant="secondary">View Hotels</Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === tab.id
                ? "text-purple-400 border-purple-400"
                : "text-gray-400 border-transparent hover:text-white"
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <StockCounter title="Total Hotels" value={stats.hotels} status="normal" />
            <StockCounter title="Total Rooms" value={stats.total} status="normal" />
            <StockCounter title="Blocked for Groups" value={stats.held} status="medium" />
            <StockCounter title="Available" value={stats.available} status="high" />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Group Inventory Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => setActiveTab("packages")}
                className="justify-center"
              >
                📦 Create Group Package
              </Button>
              <Button
                onClick={() => setActiveTab("holds")}
                className="justify-center"
              >
                � Block Rooms for Group
              </Button>
              <Button
                onClick={() => setShowAddHotel(true)}
                className="justify-center"
              >
                🏨 Add Hotel Partner
              </Button>
            </div>
          </div>

          {/* Group Inventory Info */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Group-Specific Inventory</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Each MICE event or destination wedding gets dedicated inventory with negotiated rates,
              protected allotments, and custom inclusions. Room blocks are digitally locked to prevent
              double bookings and ensure controlled consumption.
            </p>
          </div>
        </div>
      )}

      {activeTab === "packages" && <PackageBuilder />}
      {activeTab === "holds" && <HoldReleaseLogic />}

      {/* Add Hotel Modal */}
      {showAddHotel && (
        <AddHotelModal
          onClose={() => setShowAddHotel(false)}
          onSave={(hotel) => {
            console.log("Hotel saved:", hotel);
            setShowAddHotel(false);
          }}
        />
      )}
    </div>
  );
}
