import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const utilizationData = [
  { name: "Rooms", used: 85, total: 100 },
  { name: "Catering", used: 92, total: 100 },
  { name: "Transport", used: 78, total: 100 },
  { name: "Activities", used: 95, total: 100 }
];

const satisfactionData = [
  { name: "Excellent", value: 65, color: "#10b981" },
  { name: "Good", value: 25, color: "#3b82f6" },
  { name: "Average", value: 8, color: "#f59e0b" },
  { name: "Poor", value: 2, color: "#ef4444" }
];

export default function UtilizationChart() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Resource Utilization */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Resource Utilization</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={utilizationData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #374151" }}
            />
            <Bar dataKey="used" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Guest Satisfaction */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Guest Satisfaction</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={satisfactionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {satisfactionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #374151" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {satisfactionData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-gray-300">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
