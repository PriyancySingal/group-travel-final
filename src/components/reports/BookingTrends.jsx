import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const bookingData = [
  { month: "Jan", bookings: 45, revenue: 2.2 },
  { month: "Feb", bookings: 52, revenue: 2.8 },
  { month: "Mar", bookings: 48, revenue: 2.5 },
  { month: "Apr", bookings: 61, revenue: 3.1 },
  { month: "May", bookings: 58, revenue: 2.9 },
  { month: "Jun", bookings: 67, revenue: 3.4 }
];

export default function BookingTrends() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Booking Trends (6 Months)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={bookingData}>
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #374151" }}
            formatter={(value, name) => [
              name === "bookings" ? `${value} bookings` : `₹${value}L`,
              name === "bookings" ? "Bookings" : "Revenue"
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="bookings" 
            stroke="#a855f7" 
            strokeWidth={2}
            dot={{ fill: "#a855f7" }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#ec4899" 
            strokeWidth={2}
            dot={{ fill: "#ec4899" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
