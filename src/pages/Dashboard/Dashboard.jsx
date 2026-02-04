import { useNavigate } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import GuestsChart from "../../components/dashboard/GuestsChart";
import SentimentChart from "../../components/dashboard/SentimentChart";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Command Center</h1>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Guests" value="324" sub="+12 today" />
        <StatCard title="Rooms Used" value="142" sub="92% utilization" />
        <StatCard title="Mood Score" value="87%" sub="Very Positive" />
        <StatCard title="Active Events" value="3" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <GuestsChart />
        <SentimentChart />
      </div>

      {/* Feed */}
      <ActivityFeed />
    </div>
  );
}
