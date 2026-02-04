import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Happy", value: 80 },
  { name: "Neutral", value: 15 },
  { name: "Negative", value: 5 }
];

export default function SentimentChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-72">
      <h3 className="mb-4 font-semibold">Guest Sentiment</h3>

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
