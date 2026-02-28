import React, { useState, useEffect, useRef } from "react";
import BehavioralSimulationService from "../../services/BehavioralSimulationService";
import GuestPreferencesService from "../Guests/GuestPreferencesService";
import "./LiveEventDashboard.css";

/**
 * LiveEventDashboard
 *
 * Real-time event simulation dashboard using the 4-Layer Behavioral Model:
 * - Layer 1: Base Social Propensity (Static Personality)
 * - Layer 2: Live Engagement Signals (Dynamic with Time Decay)
 * - Layer 3: Emotional State Model (Trend-Based)
 * - Layer 4: Network Graph Influence (Connector Detection)
 */

const LiveEventDashboard = () => {
  const [guests, setGuests] = useState([]);
  const [currentPhase, setCurrentPhase] = useState("arrival");
  const [eventHealth, setEventHealth] = useState(50);
  const [eventHealthTrend, setEventHealthTrend] = useState("stable");
  const [dropOffRisk, setDropOffRisk] = useState("low");
  const [networkMetrics, setNetworkMetrics] = useState({ totalConnections: 0, avgConnectionsPerGuest: 0, mostConnected: null, isolated: [] });
  const [atRiskGuests, setAtRiskGuests] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const simulationRef = useRef(null);

  // Initialize simulation on mount
  useEffect(() => {
    const localGuests = GuestPreferencesService.getAllGuests();

    if (localGuests && localGuests.length > 0) {
      BehavioralSimulationService.initialize(localGuests);
      BehavioralSimulationService.start();

      const unsubscribe = BehavioralSimulationService.subscribe((data) => {
        if (data.type === "tick" || data.type === "phase_change") {
          const state = BehavioralSimulationService.getState();
          setGuests(state.guests || []);
          setCurrentPhase(state.phase);
          setEventHealth(state.eventEnergy?.score || 50);
          setEventHealthTrend(state.eventEnergy?.trend || "stable");
          setDropOffRisk(state.eventEnergy?.dropRisk || "low");
          setNetworkMetrics({
            totalConnections: state.stats?.connectorCount || 0,
            avgConnectionsPerGuest: state.guests?.length > 0 ? (state.guests.reduce((sum, g) => sum + g.connectionCount, 0) / state.guests.length).toFixed(1) : 0,
            mostConnected: state.guests?.find((g) => g.networkRole === "connector"),
            isolated: state.guests?.filter((g) => g.networkRole === "isolated") || [],
          });
          setAtRiskGuests(state.guests?.filter((g) => g.riskLevel === "high" || g.riskLevel === "medium") || []);
          setAiInsights(state.insights || []);
          setPulseEffect(true);
          setTimeout(() => setPulseEffect(false), 500);
        }
      });

      simulationRef.current = { unsubscribe };
    }

    return () => {
      if (simulationRef.current?.unsubscribe) simulationRef.current.unsubscribe();
      BehavioralSimulationService.stop();
    };
  }, []);

  const handleSubmitFeedback = () => {
    if (!selectedGuest || !feedbackText.trim()) return;
    BehavioralSimulationService.submitFeedback(selectedGuest.id, feedbackText);
    setFeedbackText("");
    setShowFeedbackForm(false);
    alert("Feedback recorded and analyzed by behavioral model");
  };

  const getEmotionalEmoji = (guest) => {
    const map = { excited: "🎉", content: "😊", neutral: "😐", fatigued: "😴", disengaged: "😞", stressed: "😰" };
    return map[guest.emotionalState] || "😐";
  };

  const getPhaseInfo = () => {
    const info = {
      arrival: { title: "Arrival", emoji: "🛬", description: "Guests arriving and settling in" },
      networking: { title: "Networking", emoji: "🤝", description: "Peak social interaction period" },
      dinner: { title: "Dinner", emoji: "🍽️", description: "Dining and casual conversation" },
      winddown: { title: "Wind Down", emoji: "🌅", description: "Event concluding" },
    };
    return { phase: currentPhase, ...info[currentPhase] };
  };

  const getRiskColor = (level) => ({ high: "#ef4444", medium: "#f59e0b", low: "#10b981" }[level] || "#6b7280");
  const getEngagementColor = (score) => score >= 75 ? "#10b981" : score >= 50 ? "#3b82f6" : score >= 30 ? "#f59e0b" : "#ef4444";
  const getTrendArrow = (trend) => trend === "rising" ? "↗️" : trend === "falling" ? "↘️" : "➡️";
  const getDropOffRiskText = (risk) => risk === "high" ? "⚠️ High Risk" : risk === "medium" ? "⚡ Monitor" : "✅ Low Risk";

  const phaseInfo = getPhaseInfo();

  return (
    <div className={`live-event-dashboard ${pulseEffect ? "pulse-update" : ""}`}>
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎉 Live Event Intelligence</h1>
          <p>4-Layer Behavioral Model • Real-time Social Dynamics</p>
        </div>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
      </div>

      <div className="hero-metrics">
        <div className="health-index-card">
          <div className="health-header">
            <span className="health-label">Event Health Index</span>
            <span className={`trend-indicator ${eventHealthTrend}`}>
              {getTrendArrow(eventHealthTrend)} {eventHealthTrend}
            </span>
          </div>
          <div className="health-score">
            <span className="score-number">{eventHealth}</span>
            <span className="score-percent">%</span>
          </div>
          <div className="health-bar-container">
            <div className="health-bar" style={{ width: `${eventHealth}%`, backgroundColor: getEngagementColor(eventHealth) }}></div>
          </div>
          <div className="health-meta">
            <span className="drop-off-risk">{getDropOffRiskText(dropOffRisk)}</span>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-pill">
            <span className="stat-icon">{phaseInfo.emoji}</span>
            <div className="stat-content">
              <span className="stat-label">Phase</span>
              <span className="stat-value">{phaseInfo.title}</span>
            </div>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">👥</span>
            <div className="stat-content">
              <span className="stat-label">Active</span>
              <span className="stat-value">{guests.filter((g) => g.engagementScore > 0).length}/{guests.length}</span>
            </div>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">🕸️</span>
            <div className="stat-content">
              <span className="stat-label">Connectors</span>
              <span className="stat-value">{guests.filter((g) => g.networkRole === "connector").length}</span>
            </div>
          </div>
          <div className="stat-pill alert">
            <span className="stat-icon">⚠️</span>
            <div className="stat-content">
              <span className="stat-label">At Risk</span>
              <span className="stat-value" style={{ color: getRiskColor("high") }}>{atRiskGuests.length}</span>
            </div>
          </div>
        </div>
      </div>

      {aiInsights.length > 0 && (
        <div className="ai-insights-section">
          <h3 className="section-title"><span className="ai-icon">🤖</span> AI Insights</h3>
          <div className="insights-grid">
            {aiInsights.map((insight, idx) => (
              <div key={`insight-${idx}`} className={`insight-card ${insight.type} priority-${insight.priority}`}>
                <div className="insight-header">
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-title">{insight.title}</span>
                </div>
                <p className="insight-text">{insight.text}</p>
                {insight.action && (
                  <div className="insight-action">
                    <span className="action-label">Suggested:</span>
                    <span className="action-value">{insight.action}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-tabs">
        <button className={`tab-button ${selectedTab === "overview" ? "active" : ""}`} onClick={() => setSelectedTab("overview")}>👁️ Overview</button>
        <button className={`tab-button ${selectedTab === "engagement" ? "active" : ""}`} onClick={() => setSelectedTab("engagement")}>📊 Engagement</button>
        <button className={`tab-button ${selectedTab === "network" ? "active" : ""}`} onClick={() => setSelectedTab("network")}>🕸️ Network</button>
        <button className={`tab-button ${selectedTab === "risks" ? "active" : ""}`} onClick={() => setSelectedTab("risks")}>⚠️ Risks</button>
        <button className={`tab-button ${selectedTab === "sentiment" ? "active" : ""}`} onClick={() => setSelectedTab("sentiment")}>💬 Sentiment</button>
      </div>

      <div className="dashboard-content">
        {selectedTab === "overview" && (
          <div className="tab-section">
            <div className="overview-grid">
              <div className="overview-card phase-card">
                <h3>Current Phase</h3>
                <div className="phase-display">
                  <span className="phase-emoji-large">{phaseInfo.emoji}</span>
                  <div className="phase-info">
                    <span className="phase-title">{phaseInfo.title}</span>
                    <span className="phase-desc">{phaseInfo.description}</span>
                  </div>
                </div>
              </div>
              <div className="overview-card">
                <h3>🔥 Top Performers</h3>
                <div className="top-performers">
                  {guests.sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 5).map((guest, idx) => (
                    <div key={`top-${idx}`} className="performer-item">
                      <span className="rank">#{idx + 1}</span>
                      <span className="name">{guest.name}</span>
                      <div className="mini-bar">
                        <div className="mini-fill" style={{ width: `${guest.engagementScore}%`, backgroundColor: getEngagementColor(guest.engagementScore) }}></div>
                      </div>
                      <span className="score">{guest.engagementScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overview-card predictions-card">
                <h3>🔮 Predictions</h3>
                <div className="prediction-item">
                  <span className="pred-label">20min Forecast:</span>
                  <span className="pred-value">{Math.min(100, Math.round(eventHealth + (eventHealthTrend === "rising" ? 5 : eventHealthTrend === "falling" ? -5 : 0)))}%</span>
                </div>
                <div className="prediction-item">
                  <span className="pred-label">Trend:</span>
                  <span className={`pred-trend ${eventHealthTrend}`}>{getTrendArrow(eventHealthTrend)} {eventHealthTrend}</span>
                </div>
                <div className="prediction-item">
                  <span className="pred-label">Base Propensity:</span>
                  <span className="pred-value">{guests.length > 0 ? Math.round(guests.reduce((sum, g) => sum + g.basePropensity, 0) / guests.length) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "engagement" && (
          <div className="tab-section">
            <h2>📊 Live Engagement Scores</h2>
            <div className="guests-list">
              {guests.sort((a, b) => b.engagementScore - a.engagementScore).map((guest, idx) => (
                <div key={`${guest.id}-engagement-${idx}`} className="guest-engagement-card">
                  <div className="guest-header">
                    <div className="guest-info">
                      <span className="guest-rank">#{idx + 1}</span>
                      <span className="guest-name">{guest.name}</span>
                      {guest.riskLevel === "high" && <span className="risk-badge">⚠️</span>}
                      {guest.networkRole === "connector" && <span className="connector-badge">👑</span>}
                    </div>
                    <div className="guest-score-section">
                      <span className="engagement-score">{guest.engagementScore}%</span>
                      {guest.prediction && <span className="predicted-score">→ {guest.prediction.prediction}%</span>}
                    </div>
                  </div>
                  <div className="engagement-bar">
                    <div className="engagement-fill" style={{ width: `${guest.engagementScore}%`, backgroundColor: getEngagementColor(guest.engagementScore) }}></div>
                  </div>
                  <div className="guest-meta">
                    <span className="meta-item">🧬 Base: {guest.basePropensity}%</span>
                    <span className="meta-item">📈 {guest.trend}</span>
                    <span className="meta-item">🕸️ {guest.networkRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "network" && (
          <div className="tab-section">
            <h2>🕸️ Network Analysis</h2>
            <div className="network-grid">
              <div className="network-stat-card highlight">
                <span className="stat-icon-large">👑</span>
                <h3>Social Connectors</h3>
                <p className="stat-number">{guests.filter((g) => g.networkRole === "connector").length}</p>
                <p className="stat-desc">Guests driving interactions</p>
              </div>
              <div className="network-stat-card warning">
                <span className="stat-icon-large">🏝️</span>
                <h3>Isolated Guests</h3>
                <p className="stat-number">{guests.filter((g) => g.networkRole === "isolated").length}</p>
                {networkMetrics.isolated.length > 0 && (
                  <div className="isolated-list">
                    {networkMetrics.isolated.slice(0, 3).map((g, idx) => <span key={idx} className="isolated-name">{g.name}</span>)}
                    {networkMetrics.isolated.length > 3 && <span className="more-indicator">+{networkMetrics.isolated.length - 3} more</span>}
                  </div>
                )}
              </div>
              <div className="network-stat-card">
                <span className="stat-icon-large">📊</span>
                <h3>Network Health</h3>
                <div className="health-metrics">
                  <div className="health-metric"><span className="metric-label">Avg Connections</span><span className="metric-value">{networkMetrics.avgConnectionsPerGuest}</span></div>
                  <div className="health-metric"><span className="metric-label">Total Influence</span><span className="metric-value">{guests.reduce((sum, g) => sum + g.influenceScore, 0)}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "risks" && (
          <div className="tab-section">
            <h2>⚠️ Risk Detection & Alerts</h2>
            {atRiskGuests.length > 0 ? (
              <div className="risks-list">
                {atRiskGuests.map((guest, idx) => (
                  <div key={`risk-${idx}`} className={`risk-card level-${guest.riskLevel}`}>
                    <div className="risk-header">
                      <span className={`risk-badge ${guest.riskLevel}`}>{guest.riskLevel.toUpperCase()}</span>
                      <span className="guest-name">{guest.name}</span>
                      <span className="engagement-mini">{guest.engagementScore}%</span>
                    </div>
                    <div className="risk-flags">
                      {guest.riskFlags?.map((flag, fIdx) => <div key={`flag-${fIdx}`} className="risk-flag">{flag.message}</div>)}
                    </div>
                    {guest.riskFlags?.[0]?.recommendation && (
                      <div className="recommended-action"><strong>💡 Action:</strong> {guest.riskFlags[0].recommendation}</div>
                    )}
                    <button className="btn-check-in" onClick={() => { setSelectedGuest(guest); setShowFeedbackForm(true); }}>Check In</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state positive"><span className="success-icon">✅</span><p>No at-risk guests detected! Event is running smoothly.</p></div>
            )}
          </div>
        )}

        {selectedTab === "sentiment" && (
          <div className="tab-section">
            <h2>💬 Guest Sentiment & Mood</h2>
            <div className="sentiment-grid">
              {guests.map((guest, idx) => (
                <div key={`sentiment-${idx}`} className="sentiment-card">
                  <div className="sentiment-header">
                    <span className="sentiment-emoji">{getEmotionalEmoji(guest)}</span>
                    <div className="sentiment-info">
                      <span className="guest-name">{guest.name}</span>
                      <span className={`mood-badge ${guest.emotionalState}`}>{guest.emotionalState}</span>
                    </div>
                  </div>
                  <div className="mood-details">
                    <div className="mood-stat"><span className="label">Energy:</span><span className={`value energy-${guest.energyLevel}`}>{guest.energyLevel}</span></div>
                    <div className="mood-stat"><span className="label">Stress:</span><span className={`value stress-${guest.stressLevel}`}>{guest.stressLevel}</span></div>
                  </div>
                  {guest.sentimentScore !== 0 && <div className={`sentiment-score ${guest.sentimentScore > 0 ? "positive" : "negative"}`}>Feedback: {guest.sentimentScore > 0 ? "+" : ""}{guest.sentimentScore}</div>}
                  <button className="btn-add-feedback" onClick={() => { setSelectedGuest(guest); setShowFeedbackForm(true); }}>Add Feedback</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFeedbackForm && selectedGuest && (
        <div className="feedback-modal" onClick={() => setShowFeedbackForm(false)}>
          <div className="feedback-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Feedback for {selectedGuest.name}</h3>
            <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Share your observations..." className="feedback-input" />
            <div className="feedback-buttons">
              <button className="btn-primary" onClick={handleSubmitFeedback}>Submit Feedback</button>
              <button className="btn-secondary" onClick={() => setShowFeedbackForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveEventDashboard;
