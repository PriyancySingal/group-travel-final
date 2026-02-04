import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function InsightCard({ title, insight, type = "info", trend = null }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default:
        return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/20";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "trend":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-purple-500/10 border-purple-500/20";
    }
  };

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-6 ${getBgColor()}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={`font-medium ${
                trend.positive ? "text-green-400" : "text-red-400"
              }`}>
                {trend.positive ? "↑" : "↓"} {trend.value}%
              </span>
              <span className="text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
