export default function Heatmap() {
  const cells = Array.from({ length: 49 }, () =>
    Math.floor(Math.random() * 100)
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="mb-4 font-semibold">Engagement Heatmap</h3>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((v, i) => (
          <div
            key={i}
            className="h-6 rounded"
            style={{ backgroundColor: `rgba(168,85,247,${v / 100})` }}
          />
        ))}
      </div>
    </div>
  );
}
