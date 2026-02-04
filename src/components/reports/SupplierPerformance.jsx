export default function SupplierPerformance() {
  const suppliers = [
    { name: "Taj Hotels", rating: 4.8, events: 12, onTime: 95 },
    { name: "Marriott", rating: 4.6, events: 8, onTime: 92 },
    { name: "Catering Co", rating: 4.9, events: 15, onTime: 98 },
    { name: "Transport Plus", rating: 4.4, events: 6, onTime: 88 }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Supplier Performance</h3>
      
      <div className="space-y-4">
        {suppliers.map((supplier, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-white">{supplier.name}</div>
              <div className="text-sm text-gray-400">
                {supplier.events} events • {supplier.onTime}% on-time
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  ⭐ {supplier.rating}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${
                supplier.onTime >= 95 ? 'bg-green-400' : 
                supplier.onTime >= 90 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
