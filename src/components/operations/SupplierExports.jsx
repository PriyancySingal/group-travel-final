import { useState } from "react";

export default function SupplierExports() {
  const [suppliers, setSuppliers] = useState([
    {
      name: "Taj Hotels",
      type: "Accommodation",
      contact: "Mr. Rajesh +91-9876543210",
      status: "confirmed",
      requirements: "15 rooms, check-in 9AM",
      lastUpdate: "2 hours ago"
    },
    {
      name: "Gourmet Catering",
      type: "Catering",
      contact: "Ms. Priya +91-9876543211",
      status: "confirmed",
      requirements: "320 pax, vegetarian options",
      lastUpdate: "1 hour ago"
    },
    {
      name: "City Transport",
      type: "Transport",
      contact: "Mr. Ahmed +91-9876543212",
      status: "delayed",
      requirements: "8 vehicles, airport transfers",
      lastUpdate: "30 min ago"
    },
    {
      name: "Event Decorators",
      type: "Decoration",
      contact: "Ms. Anjali +91-9876543213",
      status: "confirmed",
      requirements: "Main hall, stage setup",
      lastUpdate: "3 hours ago"
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20';
      case 'delayed': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const exportSupplierData = (format) => {
    // In real implementation, this would generate and download the file
    alert(`Exporting supplier data as ${format.toUpperCase()}...`);
  };

  const sendReminder = (supplierName) => {
    alert(`Reminder sent to ${supplierName}`);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Supplier Management</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => exportSupplierData('excel')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg text-sm"
          >
            Export Excel
          </button>
          <button 
            onClick={() => exportSupplierData('pdf')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-lg text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Supplier Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">3</div>
          <div className="text-xs text-gray-400">Confirmed</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">1</div>
          <div className="text-xs text-gray-400">Delayed</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">0</div>
          <div className="text-xs text-gray-400">Cancelled</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">4</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
      </div>

      {/* Supplier List */}
      <div className="space-y-3">
        {suppliers.map((supplier, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-medium text-white">{supplier.name}</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(supplier.status)}`}>
                    {supplier.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Type:</div>
                    <div className="text-white">{supplier.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Contact:</div>
                    <div className="text-white">{supplier.contact}</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="text-gray-400 text-sm">Requirements:</div>
                  <div className="text-white text-sm">{supplier.requirements}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-gray-400">
                  Updated: {supplier.lastUpdate}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => sendReminder(supplier.name)}
                    className="text-purple-400 hover:text-purple-300 text-xs"
                  >
                    Remind
                  </button>
                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Next supplier check-in: 30 minutes
          </div>
          <div className="flex gap-3">
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Send Bulk Reminder →
            </button>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Schedule Check-ins →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
