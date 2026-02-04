import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { time: "9AM", value: 40 },
  { time: "11AM", value: 80 },
  { time: "1PM", value: 120 },
  { time: "3PM", value: 95 },
  { time: "5PM", value: 70 }
];

export default function AttendanceChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-72">
      <h3 className="mb-4 font-semibold">Attendance Trend</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#a855f7" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
