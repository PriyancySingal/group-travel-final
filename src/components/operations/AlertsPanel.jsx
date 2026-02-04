import { useState } from "react";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Room 206 AC Failure",
      description: "Air conditioning not working, needs immediate attention",
      time: "2 min ago",
      resolved: false
    },
    {
      id: 2,
      type: "warning",
      title: "Catering Delay",
      description: "Lunch service running 15 minutes behind schedule",
      time: "5 min ago",
      resolved: false
    },
    {
      id: 3,
      type: "info",
      title: "VIP Guest Arrival",
      description: "Mr. Rajat Malhotra arriving in 30 minutes",
      time: "10 min ago",
      resolved: false
    },
    {
      id: 4,
      type: "success",
      title: "Transport Arrived",
      description: "All guest transport vehicles have arrived on time",
      time: "15 min ago",
      resolved: true
    }
  ]);

  const getAlertStyle = (type, resolved) => {
    if (resolved) return 'border-gray-500/30 bg-gray-500/10';
    
    switch(type) {
      case 'critical': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'border-blue-500/30 bg-blue-500/10';
      case 'success': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Alerts & Exceptions</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeAlerts.length > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm text-gray-400">
            {activeAlerts.length} active
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`border rounded-xl p-4 ${getAlertStyle(alert.type, alert.resolved)} ${
              alert.resolved ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-lg">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="font-medium text-white">{alert.title}</div>
                  <div className="text-sm text-gray-300 mt-1">{alert.description}</div>
                  <div className="text-xs text-gray-500 mt-2">{alert.time}</div>
                </div>
              </div>
              
              {!alert.resolved && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeAlerts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-green-400 text-2xl mb-2">✅</div>
          <div className="text-gray-400">All systems operational</div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Last updated: Just now
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View Alert History →
        </button>
      </div>
    </div>
  );
}
