import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Excellent", value: 180 },
  { name: "Good", value: 95 },
  { name: "Average", value: 30 },
  { name: "Poor", value: 5 }
];

export default function SatisfactionChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-72">
      <h3 className="mb-4 font-semibold">Guest Satisfaction</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="value" fill="#ec4899" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
