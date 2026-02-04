import { useState } from "react";
import Button from "../ui/Button";
import { Plus, X, Package, MapPin, Calendar, Users } from "lucide-react";

export default function PackageBuilder() {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Standard Weekend Package",
      duration: "3 Days / 2 Nights",
      basePrice: 15000,
      inclusions: ["Accommodation", "Breakfast", "Airport Transfer"],
      hotels: ["Grand Plaza Hotel", "City Inn"],
      transport: "Included",
      meals: "Breakfast Only",
      activities: ["City Tour", "Welcome Dinner"],
      cutoffDate: "2026-03-15",
      status: "active"
    },
    {
      id: 2,
      name: "Premium Business Package",
      duration: "5 Days / 4 Nights",
      basePrice: 35000,
      inclusions: ["5-Star Accommodation", "All Meals", "Airport Transfer", "Conference Room"],
      hotels: ["Luxury Suites International"],
      transport: "Premium Vehicle",
      meals: "All Inclusive",
      activities: ["Business Meetings", "Golf Session", "Spa Access"],
      cutoffDate: "2026-03-10",
      status: "active"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    basePrice: "",
    inclusions: [],
    hotels: [],
    transport: "",
    meals: "",
    activities: [],
    cutoffDate: ""
  });

  const handleAddPackage = () => {
    if (editingPackage) {
      setPackages(packages.map(pkg => 
        pkg.id === editingPackage.id 
          ? { ...pkg, ...formData, id: editingPackage.id, status: "active" }
          : pkg
      ));
    } else {
      const newPackage = {
        id: Date.now(),
        ...formData,
        status: "active"
      };
      setPackages([...packages, newPackage]);
    }

    setFormData({
      name: "",
      duration: "",
      basePrice: "",
      inclusions: [],
      hotels: [],
      transport: "",
      meals: "",
      activities: [],
      cutoffDate: ""
    });
    setShowAddForm(false);
    setEditingPackage(null);
  };

  const handleEdit = (pkg) => {
    setFormData({
      name: pkg.name,
      duration: pkg.duration,
      basePrice: pkg.basePrice,
      inclusions: pkg.inclusions,
      hotels: pkg.hotels,
      transport: pkg.transport,
      meals: pkg.meals,
      activities: pkg.activities,
      cutoffDate: pkg.cutoffDate
    });
    setEditingPackage(pkg);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const addToArray = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 text-purple-400" />
          Package Builder
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Existing Packages */}
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  {pkg.duration}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Base Price</p>
                <p className="text-lg font-semibold text-green-400">₹{pkg.basePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cutoff Date</p>
                <p className="text-sm text-white">{pkg.cutoffDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Inclusions</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.inclusions.map((inc, idx) => (
                    <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                      {inc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Hotels</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.hotels.map((hotel, idx) => (
                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {hotel}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Transport</p>
                  <p className="text-sm text-white">{pkg.transport}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Meals</p>
                  <p className="text-sm text-white">{pkg.meals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Activities</p>
                  <div className="flex flex-wrap gap-1">
                    {pkg.activities.map((act, idx) => (
                      <span key={idx} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Package Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingPackage ? "Edit Package" : "Add New Package"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPackage(null);
                  setFormData({
                    name: "",
                    duration: "",
                    basePrice: "",
                    inclusions: [],
                    hotels: [],
                    transport: "",
                    meals: "",
                    activities: [],
                    cutoffDate: ""
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Package Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="e.g., Standard Weekend Package"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="e.g., 3 Days / 2 Nights"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cutoff Date</label>
                  <input
                    type="date"
                    value={formData.cutoffDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, cutoffDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-sm font-medium mb-2">Inclusions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add inclusion"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('inclusions', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addToArray('inclusions', input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.inclusions.map((inc, idx) => (
                    <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {inc}
                      <button onClick={() => removeFromArray('inclusions', idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div>
                <label className="block text-sm font-medium mb-2">Hotels</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add hotel"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('hotels', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addToArray('hotels', input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.hotels.map((hotel, idx) => (
                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {hotel}
                      <button onClick={() => removeFromArray('hotels', idx)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Transport</label>
                  <select
                    value={formData.transport}
                    onChange={(e) => setFormData(prev => ({ ...prev, transport: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select Transport</option>
                    <option value="Included">Included</option>
                    <option value="Premium Vehicle">Premium Vehicle</option>
                    <option value="Standard Vehicle">Standard Vehicle</option>
                    <option value="Not Included">Not Included</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meals</label>
                  <select
                    value={formData.meals}
                    onChange={(e) => setFormData(prev => ({ ...prev, meals: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select Meals</option>
                    <option value="Breakfast Only">Breakfast Only</option>
                    <option value="All Inclusive">All Inclusive</option>
                    <option value="Half Board">Half Board</option>
                    <option value="Not Included">Not Included</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Activities</label>
                  <input
                    type="text"
                    value={formData.activities.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      activities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                    }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="City Tour, Welcome Dinner"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPackage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPackage}>
                {editingPackage ? "Update Package" : "Add Package"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
