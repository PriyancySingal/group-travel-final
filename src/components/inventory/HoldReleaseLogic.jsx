import { useState } from "react";
import Button from "../ui/Button";
import { Lock, Unlock, Clock, AlertTriangle, User, Calendar } from "lucide-react";

export default function HoldReleaseLogic() {
  const [holds, setHolds] = useState([
    {
      id: 1,
      hotelName: "Grand Plaza Hotel",
      roomType: "Deluxe Room",
      roomsHeld: 5,
      heldBy: "Travel Agency A",
      holdReason: "Group booking - Corporate event",
      holdDate: "2026-01-15",
      expiryDate: "2026-01-22",
      status: "active",
      priority: "high"
    },
    {
      id: 2,
      hotelName: "City Inn",
      roomType: "Standard Room",
      roomsHeld: 10,
      heldBy: "Tour Operator B",
      holdReason: "Package tour - Summer special",
      holdDate: "2026-01-10",
      expiryDate: "2026-01-20",
      status: "active",
      priority: "medium"
    },
    {
      id: 3,
      hotelName: "Luxury Suites International",
      roomType: "Presidential Suite",
      roomsHeld: 2,
      heldBy: "VIP Client C",
      holdReason: "Wedding block booking",
      holdDate: "2026-01-12",
      expiryDate: "2026-01-19",
      status: "expired",
      priority: "low"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    roomType: "",
    roomsHeld: "",
    heldBy: "",
    holdReason: "",
    expiryDate: "",
    priority: "medium"
  });

  const handleAddHold = () => {
    const newHold = {
      id: Date.now(),
      ...formData,
      roomsHeld: parseInt(formData.roomsHeld),
      holdDate: new Date().toISOString().split('T')[0],
      status: "active"
    };
    setHolds([...holds, newHold]);
    
    setFormData({
      hotelName: "",
      roomType: "",
      roomsHeld: "",
      heldBy: "",
      holdReason: "",
      expiryDate: "",
      priority: "medium"
    });
    setShowAddForm(false);
  };

  const handleReleaseHold = (id) => {
    setHolds(holds.map(hold => 
      hold.id === id 
        ? { ...hold, status: "released", releasedDate: new Date().toISOString().split('T')[0] }
        : hold
    ));
  };

  const handleExtendHold = (id, days) => {
    setHolds(holds.map(hold => {
      if (hold.id === id) {
        const currentExpiry = new Date(hold.expiryDate);
        currentExpiry.setDate(currentExpiry.getDate() + days);
        return { ...hold, expiryDate: currentExpiry.toISOString().split('T')[0] };
      }
      return hold;
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-500/20";
      case "expired": return "text-red-400 bg-red-500/20";
      case "released": return "text-blue-400 bg-blue-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpiringSoon = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days <= 3 && days >= 0;
  };

  const activeHolds = holds.filter(hold => hold.status === "active");
  const expiredHolds = holds.filter(hold => hold.status === "expired");
  const releasedHolds = holds.filter(hold => hold.status === "released");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lock className="w-6 h-6 text-purple-400" />
          Hold & Release Logic
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Lock className="w-4 h-4 mr-2" />
          Add Hold
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Active Holds</p>
          <p className="text-2xl font-bold text-green-400">{activeHolds.length}</p>
          <p className="text-xs text-gray-500">
            {activeHolds.reduce((sum, hold) => sum + hold.roomsHeld, 0)} rooms
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-400">
            {activeHolds.filter(hold => isExpiringSoon(hold.expiryDate)).length}
          </p>
          <p className="text-xs text-gray-500">Within 3 days</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Expired Holds</p>
          <p className="text-2xl font-bold text-red-400">{expiredHolds.length}</p>
          <p className="text-xs text-gray-500">
            {expiredHolds.reduce((sum, hold) => sum + hold.roomsHeld, 0)} rooms
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Released Today</p>
          <p className="text-2xl font-bold text-blue-400">{releasedHolds.length}</p>
          <p className="text-xs text-gray-500">
            {releasedHolds.reduce((sum, hold) => sum + hold.roomsHeld, 0)} rooms freed
          </p>
        </div>
      </div>

      {/* Active Holds */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Holds</h3>
        {activeHolds.map((hold) => {
          const daysUntilExpiry = getDaysUntilExpiry(hold.expiryDate);
          const isExpiring = isExpiringSoon(hold.expiryDate);

          return (
            <div key={hold.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{hold.hotelName}</h4>
                  <p className="text-gray-400">{hold.roomType}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(hold.priority)}`}>
                    {hold.priority} priority
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(hold.status)}`}>
                    {hold.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rooms Held</p>
                  <p className="text-xl font-bold text-white">{hold.roomsHeld}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Held By</p>
                  <p className="text-sm text-white flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {hold.heldBy}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Reason</p>
                  <p className="text-sm text-white">{hold.holdReason}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Hold Date</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {hold.holdDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Expiry Date</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      isExpiring ? "text-yellow-400" : "text-white"
                    }`}>
                      <Clock className="w-4 h-4" />
                      {hold.expiryDate}
                      {isExpiring && (
                        <span className="text-xs ml-2">
                          ({daysUntilExpiry} days left)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {isExpiring && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    This hold expires in {daysUntilExpiry} days
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleReleaseHold(hold.id)}
                  className="flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Release Hold
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleExtendHold(hold.id, 3)}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Extend 3 Days
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleExtendHold(hold.id, 7)}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Extend 7 Days
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expired/Released Holds */}
      {(expiredHolds.length > 0 || releasedHolds.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Hold History</h3>
          <div className="grid gap-4">
            {[...expiredHolds, ...releasedHolds].map((hold) => (
              <div key={hold.id} className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-60">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{hold.hotelName} - {hold.roomType}</p>
                    <p className="text-sm text-gray-400">
                      {hold.roomsHeld} rooms held by {hold.heldBy}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(hold.status)}`}>
                      {hold.status}
                    </span>
                    {hold.releasedDate && (
                      <span className="text-xs text-gray-400">
                        Released: {hold.releasedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Hold Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Add New Hold</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hotel Name</label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="e.g., Grand Plaza Hotel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <input
                  type="text"
                  value={formData.roomType}
                  onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="e.g., Deluxe Room"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rooms to Hold</label>
                  <input
                    type="number"
                    value={formData.roomsHeld}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomsHeld: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Held By</label>
                <input
                  type="text"
                  value={formData.heldBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, heldBy: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="e.g., Travel Agency A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hold Reason</label>
                <textarea
                  value={formData.holdReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, holdReason: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                  placeholder="Reason for holding rooms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddHold}>
                Add Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
