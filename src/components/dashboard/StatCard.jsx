export default function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      {sub && <p className="text-xs text-purple-400 mt-1">{sub}</p>}
    </div>
  );
}
