import { useState } from "react";

const ResourceAllocation = () => {
  const [alerts] = useState([
    { id: 1, type: "catering", message: "Vegetarian meal requests increased by 35%", time: "2 mins ago" },
    { id: 2, type: "space", message: "Table 5 & 6 clustering detected - suggested merge", time: "5 mins ago" },
    { id: 3, type: "activity", message: "Networking lounge at 95% capacity", time: "1 min ago" }
  ]);

  const venueSpaces = [
    { id: 1, name: "Main Dining Hall", capacity: 200, current: 180, status: "optimal" },
    { id: 2, name: "Breakout Room A", capacity: 50, current: 48, status: "high" },
    { id: 3, name: "Networking Lounge", capacity: 75, current: 72, status: "critical" },
    { id: 4, name: "Conference Room", capacity: 100, current: 65, status: "optimal" }
  ];

  const cateringMetrics = {
    vegetarian: { percentage: 65, trend: "up" },
    vegan: { percentage: 42, trend: "up" },
    glutenFree: { percentage: 28, trend: "stable" },
    traditional: { percentage: 35, trend: "down" }
  };

  const activityResources = [
    { name: "Team Building Activity", demand: 92, allocatedStaff: 6, needed: 8, status: "critical" },
    { name: "Yoga Session", demand: 45, allocatedStaff: 2, needed: 2, status: "optimal" },
    { name: "Cooking Demo", demand: 78, allocatedStaff: 4, needed: 5, status: "warning" },
    { name: "Networking Event", demand: 88, allocatedStaff: 5, needed: 7, status: "warning" }
  ];

  return (
    <div className="container fade-in">
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{
          fontSize: "54px",
          fontWeight: "700",
          marginBottom: "15px",
          background: "linear-gradient(90deg, #38bdf8, #2563eb)",
          WebkitBackgroundClip: "text",
          color: "transparent"
        }}>
          3. Dynamic Resource Allocation
        </h1>
        <p style={{ color: "#c7d2fe", fontSize: "16px", maxWidth: "700px" }}>
          Real-time resource optimization for venues, catering, and activities to enhance guest experience
        </p>
      </div>

      {/* Real-Time Alerts */}
      <div className="glass-card" style={{ marginBottom: "32px", borderColor: "rgba(251, 146, 60, 0.3)", background: "rgba(251, 146, 60, 0.05)" }}>
        <h3 style={{ color: "#fb923c", marginBottom: "20px", fontSize: "20px" }}>🚨 Real-Time Alerts</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              borderLeft: `3px solid ${alert.type === "catering" ? "#f59e0b" : alert.type === "space" ? "#38bdf8" : "#ef4444"}`,
              borderRadius: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#f8fafc" }}>{alert.message}</span>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Dynamic Venue & Space Adjustments */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "24px", fontSize: "24px" }}>
          1. Dynamic Venue & Space Adjustments
        </h2>
        
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ color: "#f8fafc", marginBottom: "12px", fontSize: "16px" }}>Reconfigurable Event Spaces</h4>
          <p style={{ color: "#c7d2fe", marginBottom: "20px", lineHeight: "1.6" }}>
            Based on real-time guest behavior, the platform suggests reconfigurations of event spaces (dining tables, breakout rooms). When smaller groups cluster together for more engagement, the system can combine tables or shift spaces for better interaction.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {venueSpaces.map(space => (
            <div key={space.id} style={{
              padding: "16px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: `1px solid rgba(56, 189, 248, ${space.status === "critical" ? 0.6 : 0.2})`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <h5 style={{ color: "#f8fafc", margin: 0 }}>{space.name}</h5>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: space.status === "critical" ? "rgba(239, 68, 68, 0.2)" : space.status === "high" ? "rgba(251, 146, 60, 0.2)" : "rgba(34, 197, 94, 0.2)",
                  color: space.status === "critical" ? "#ef4444" : space.status === "high" ? "#fb923c" : "#22c55e"
                }}>
                  {space.status.toUpperCase()}
                </span>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                  <span style={{ color: "#cbd5f1" }}>Occupancy</span>
                  <span style={{ color: "#38bdf8" }}>{space.current}/{space.capacity}</span>
                </div>
                <div style={{
                  width: "100%",
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(space.current / space.capacity) * 100}%`,
                    height: "100%",
                    background: space.status === "critical" ? "#ef4444" : space.status === "high" ? "#fb923c" : "#22c55e",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Real-Time Catering Adjustments */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "24px", fontSize: "24px" }}>
          2. Real-Time Catering Adjustments
        </h2>
        
        <p style={{ color: "#c7d2fe", marginBottom: "20px", lineHeight: "1.6" }}>
          The platform tracks guest preferences and real-time feedback to adjust catering options. It alerts the catering team to adjust meals based on guest demands and dietary preferences.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {Object.entries(cateringMetrics).map(([key, value]) => (
            <div key={key} style={{
              padding: "16px",
              background: "rgba(56, 189, 248, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              textAlign: "center"
            }}>
              <h5 style={{ color: "#f8fafc", margin: "0 0 12px 0", textTransform: "capitalize" }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h5>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#38bdf8", marginBottom: "8px" }}>
                {value.percentage}%
              </div>
              <span style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "600",
                background: value.trend === "up" ? "rgba(34, 197, 94, 0.2)" : value.trend === "down" ? "rgba(239, 68, 68, 0.2)" : "rgba(148, 163, 184, 0.2)",
                color: value.trend === "up" ? "#22c55e" : value.trend === "down" ? "#ef4444" : "#94a3b8"
              }}>
                {value.trend === "up" ? "📈 " : value.trend === "down" ? "📉 " : "➡️ "}{value.trend}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(251, 146, 60, 0.1)", borderRadius: "12px", border: "1px solid rgba(251, 146, 60, 0.3)" }}>
          <h5 style={{ color: "#fb923c", margin: "0 0 10px 0" }}>⚠️ Catering Team Alerts</h5>
          <ul style={{ color: "#cbd5f1", margin: 0, paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Increase vegetarian options by 40% (guests showing strong preference)</li>
            <li>Monitor vegan cross-contamination (uptick in vegan requests)</li>
            <li>Restock gluten-free bread (2 hours supply remaining)</li>
          </ul>
        </div>
      </div>

      {/* 3. Activity-Based Resource Allocation */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "24px", fontSize: "24px" }}>
          3. Activity-Based Resource Allocation
        </h2>
        
        <p style={{ color: "#c7d2fe", marginBottom: "20px", lineHeight: "1.6" }}>
          Based on real-time participation, the system allocates additional resources (seating, materials, staff) for high-demand activities.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {activityResources.map((activity, idx) => (
            <div key={idx} style={{
              padding: "16px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: `1px solid rgba(${activity.status === "critical" ? "239, 68, 68" : activity.status === "warning" ? "251, 146, 60" : "34, 197, 94"}, 0.3)`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <h5 style={{ color: "#f8fafc", margin: 0 }}>{activity.name}</h5>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: activity.status === "critical" ? "rgba(239, 68, 68, 0.2)" : activity.status === "warning" ? "rgba(251, 146, 60, 0.2)" : "rgba(34, 197, 94, 0.2)",
                  color: activity.status === "critical" ? "#ef4444" : activity.status === "warning" ? "#fb923c" : "#22c55e"
                }}>
                  {activity.status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Demand</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#38bdf8" }}>{activity.demand}%</div>
                    <div style={{
                      width: "60px",
                      height: "4px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "2px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${activity.demand}%`,
                        height: "100%",
                        background: "#38bdf8"
                      }} />
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Staff Allocated</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e" }}>{activity.allocatedStaff}</div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Staff Needed</div>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: activity.needed > activity.allocatedStaff ? "#ef4444" : "#22c55e"
                  }}>
                    {activity.needed}{activity.needed > activity.allocatedStaff && " ⚠️"}
                  </div>
                </div>
              </div>

              {activity.needed > activity.allocatedStaff && (
                <div style={{
                  padding: "10px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderLeft: "3px solid #ef4444",
                  borderRadius: "4px",
                  color: "#fca5a5",
                  fontSize: "13px"
                }}>
                  ⚡ {activity.needed - activity.allocatedStaff} additional staff member(s) needed for optimal service
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Benefits */}
      <div className="glass-card" style={{ background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(37, 99, 235, 0.1))", borderColor: "rgba(56, 189, 248, 0.4)" }}>
        <h3 style={{ color: "#38bdf8", marginBottom: "20px", fontSize: "22px" }}>✨ Key Benefits</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>🎯</span>
            <div>
              <h5 style={{ color: "#f8fafc", margin: "0 0 5px 0" }}>Enhanced Guest Experience</h5>
              <p style={{ color: "#cbd5f1", margin: 0, fontSize: "13px" }}>Spaces and services adapt to real-time needs</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>💰</span>
            <div>
              <h5 style={{ color: "#f8fafc", margin: "0 0 5px 0" }}>Cost Optimization</h5>
              <p style={{ color: "#cbd5f1", margin: 0, fontSize: "13px" }}>Reduce waste and unnecessary resource allocation</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>👥</span>
            <div>
              <h5 style={{ color: "#f8fafc", margin: "0 0 5px 0" }}>Staff Efficiency</h5>
              <p style={{ color: "#cbd5f1", margin: 0, fontSize: "13px" }}>Smart allocation ensures adequate team coverage</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>📊</span>
            <div>
              <h5 style={{ color: "#f8fafc", margin: "0 0 5px 0" }}>Data-Driven Insights</h5>
              <p style={{ color: "#cbd5f1", margin: 0, fontSize: "13px" }}>Real-time analytics for better decision-making</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
