export default function RevenueCard({ title, value, change, period }) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="flex items-center gap-2">
        <div className={`w-0 h-0 border-l-4 border-l-transparent ${isPositive ? 'border-t-green-400' : 'border-t-red-400'} border-r-4 border-r-transparent border-b-4`} />
        <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}% {period}
        </span>
      </div>
    </div>
  );
}
