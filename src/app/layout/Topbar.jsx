export default function Topbar() {
  return (
    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900">
      <h2 className="text-lg font-semibold">Event Command Center</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Planner</span>
        <div className="w-9 h-9 rounded-full bg-purple-600" />
      </div>
    </div>
  );
}
