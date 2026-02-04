import InsightCard from "../../components/ai/InsightCard";
import PairingList from "../../components/ai/PairingList";
import Heatmap from "../../components/ai/Heatmap";

export default function AIInsights() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">AI Insights</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <InsightCard
          title="Low Engagement Alert"
          text="Workshop B attendance dropped 30%. Consider merging sessions."
        />

        <InsightCard
          title="Catering Optimization"
          text="Increase vegetarian meals by 15% based on demand trends."
        />

        <InsightCard
          title="Schedule Suggestion"
          text="Move networking session to evening for higher participation."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PairingList />
        <Heatmap />
      </div>
    </div>
  );
}
