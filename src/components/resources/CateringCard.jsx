export default function CateringCard() {
  const stats = [
    { label: "Veg", count: 120 },
    { label: "Vegan", count: 40 },
    { label: "Non-Veg", count: 160 }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="mb-4 font-semibold">Catering Demand</h3>

      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between">
            <span>{s.label}</span>
            <span className="text-purple-400 font-semibold">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
