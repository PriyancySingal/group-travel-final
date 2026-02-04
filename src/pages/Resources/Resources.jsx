import RoomGrid from "../../components/resources/RoomGrid";
import CateringCard from "../../components/resources/CateringCard";
import StatCard from "../../components/dashboard/StatCard";

export default function Resources() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Resources</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Rooms" value="160" />
        <StatCard title="Utilization" value="92%" />
        <StatCard title="Meals Served" value="320" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RoomGrid />
        <CateringCard />
      </div>
    </div>
  );
}
