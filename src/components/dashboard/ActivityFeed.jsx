const activities = [
  "Room 204 reassigned",
  "15 guests checked in",
  "Catering updated to vegetarian",
  "Schedule changed for Hall B",
  "New feedback submitted"
];

export default function ActivityFeed() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-72 overflow-y-auto">
      <h3 className="mb-4 font-semibold">Live Activity</h3>

      <div className="space-y-3 text-sm text-gray-300">
        {activities.map((a, i) => (
          <div key={i} className="border-b border-white/10 pb-2">
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}
