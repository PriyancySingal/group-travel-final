import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", guests: 20 },
  { day: "Tue", guests: 45 },
  { day: "Wed", guests: 60 },
  { day: "Thu", guests: 90 },
  { day: "Fri", guests: 120 }
];

export default function GuestsChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-72">
      <h3 className="mb-4 font-semibold">Guest Check-ins</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="guests" stroke="#a855f7" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
