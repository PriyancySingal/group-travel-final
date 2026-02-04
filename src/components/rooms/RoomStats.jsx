import StatCard from "../dashboard/StatCard";

export default function RoomStats({ rooms }) {
  const total = rooms.length;
  const capacity = rooms.reduce((a, r) => a + r.capacity, 0);
  const filled = rooms.reduce((a, r) => a + r.guests.length, 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <StatCard title="Total Rooms" value={total} />
      <StatCard title="Total Capacity" value={capacity} />
      <StatCard title="Utilization" value={`${Math.round((filled / capacity) * 100)}%`} />
    </div>
  );
}
