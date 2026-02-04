export default function StockCounter({ title, value, sub, status = "normal" }) {
  const getStatusColor = () => {
    switch (status) {
      case "low": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case "low": return "bg-red-500/20";
      case "medium": return "bg-yellow-500/20";
      case "high": return "bg-green-500/20";
      default: return "bg-white/5";
    }
  };

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${getStatusBg()}`}>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${getStatusColor()}`}>{value}</h2>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
