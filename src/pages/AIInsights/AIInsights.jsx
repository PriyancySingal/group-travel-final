import { useEffect, useState } from "react";
import { getInsights, getSocialIntelligence } from "../../services/guestApi";
import "./AIInsights.css";

const DEFAULT_INSIGHTS = {
  socialEngagement: {
    overallScore: 0,
    openness: "Low",
    balance: "Low",
    energy: "Low",
    risks: [],
    insights: [],
    breakdown: {},
    guestScores: []
  },
  networking: { groups: [], supportGuests: [] },
  pairings: [],
  emotions: {
    groupMood: "Neutral",
    distribution: { excited: 0, neutral: 0, tired: 0, disengaged: 0 },
    recommendations: [],
    perGuest: []
  },
  sentiment: {
    counts: { positive: 0, neutral: 0, negative: 0 },
    trend: "Sentiment stable",
    alerts: [],
    actions: [],
    recentFeedback: []
  },
  generatedAt: null
};

const normalizeInsights = (raw) => {
  const next = { ...DEFAULT_INSIGHTS, ...(raw || {}) };

  if (Array.isArray(raw?.socialEngagement)) {
    const list = raw.socialEngagement;
    next.socialEngagement = {
      ...DEFAULT_INSIGHTS.socialEngagement,
      guestScores: list,
      overallScore: Math.round(
        list.reduce((sum, item) => sum + Number(item.score ?? item.interactionScore ?? 0), 0) /
          (list.length || 1)
      )
    };
  } else {
    next.socialEngagement = {
      ...DEFAULT_INSIGHTS.socialEngagement,
      ...(raw?.socialEngagement || {}),
      guestScores: Array.isArray(raw?.socialEngagement?.guestScores)
        ? raw.socialEngagement.guestScores
        : []
    };
  }

  if (Array.isArray(raw?.networking)) {
    next.networking = {
      networkingReadiness: { score: 0, label: "Low Networking Potential" },
      groups: raw.networking,
      topPairings: [],
      recommendedAction: "Introduce guided icebreakers",
      supportGuests: []
    };
  } else {
    next.networking = {
      networkingReadiness: {
        score: Number(raw?.networking?.networkingReadiness?.score || 0),
        label: raw?.networking?.networkingReadiness?.label || "Low Networking Potential"
      },
      groups: Array.isArray(raw?.networking?.groups) ? raw.networking.groups : [],
      topPairings: Array.isArray(raw?.networking?.topPairings) ? raw.networking.topPairings : [],
      recommendedAction: raw?.networking?.recommendedAction || "Introduce guided icebreakers",
      supportGuests: Array.isArray(raw?.networking?.supportGuests) ? raw.networking.supportGuests : []
    };
  }

  if (Array.isArray(raw?.emotions)) {
    next.emotions = {
      ...DEFAULT_INSIGHTS.emotions,
      perGuest: raw.emotions
    };
  } else {
    next.emotions = {
      ...DEFAULT_INSIGHTS.emotions,
      ...(raw?.emotions || {}),
      distribution: {
        ...DEFAULT_INSIGHTS.emotions.distribution,
        ...(raw?.emotions?.distribution || {})
      },
      recommendations: Array.isArray(raw?.emotions?.recommendations)
        ? raw.emotions.recommendations
        : [],
      perGuest: Array.isArray(raw?.emotions?.perGuest) ? raw.emotions.perGuest : []
    };
  }

  next.pairings = Array.isArray(raw?.pairings) ? raw.pairings : [];
  next.sentiment = {
    ...DEFAULT_INSIGHTS.sentiment,
    ...(raw?.sentiment || {}),
    counts: {
      ...DEFAULT_INSIGHTS.sentiment.counts,
      ...(raw?.sentiment?.counts || {})
    },
    alerts: Array.isArray(raw?.sentiment?.alerts) ? raw.sentiment.alerts : [],
    actions: Array.isArray(raw?.sentiment?.actions) ? raw.sentiment.actions : [],
    recentFeedback: Array.isArray(raw?.sentiment?.recentFeedback) ? raw.sentiment.recentFeedback : []
  };

  return next;
};

const adaptSocialIntelligencePayload = (payload = {}) => {
  const data = payload?.data || {};
  const guests = Array.isArray(data.guests) ? data.guests : [];
  const sentiments = data.sentimentTrends?.sentiments || {};

  return {
    socialEngagement: {
      overallScore: Number(data.avgEngagement || 0),
      openness: "Medium",
      balance: "Medium",
      energy: "Medium",
      risks: [],
      insights: [
        `${data.activeParticipants || 0}/${data.totalGuests || guests.length || 0} guests are active`,
        `Real-time engagement is ${data.realTimeAnalysis?.currentEngagementLevel || 0}`
      ],
      breakdown: {},
      guestScores: guests.map((guest) => ({
        guestId: guest.id,
        guestName: guest.name,
        city: "Unknown",
        score: Number(guest.engagementScore || 0),
        preferredInteraction: guest.personalityType || "unspecified",
        isFirstTime: false
      }))
    },
    networking: {
      networkingReadiness: {
        score: Number(data.avgEngagement || 0),
        label: Number(data.avgEngagement || 0) >= 70 ? "High Networking Potential" : "Moderate Networking Potential"
      },
      groups: [],
      topPairings: [],
      recommendedAction:
        Number(data.avgEngagement || 0) < 40
          ? "Introduce guided icebreakers"
          : "Enable open networking session",
      supportGuests: []
    },
    pairings: [],
    emotions: {
      groupMood: Number(data.avgEngagement || 0) >= 70 ? "Excited" : "Neutral",
      distribution: {
        excited: Number(data.avgEngagement || 0) >= 70 ? 60 : 25,
        neutral: Number(data.avgEngagement || 0) >= 70 ? 30 : 55,
        tired: Number(data.avgEngagement || 0) < 40 ? 25 : 10,
        disengaged: Number(data.avgEngagement || 0) < 40 ? 20 : 5
      },
      recommendations: Number(data.avgEngagement || 0) < 40
        ? ["Reduce session length and add breaks.", "Use guided introductions to increase participation."]
        : ["Mood is stable. Continue with current event flow."],
      perGuest: []
    },
    sentiment: {
      counts: {
        positive: Number(sentiments.positive || 0),
        neutral: Number(sentiments.neutral || 0),
        negative: Number(sentiments.negative || 0)
      },
      trend: toTitle(data.sentimentTrends?.trend || "neutral"),
      alerts: [],
      actions: [],
      recentFeedback: []
    },
    generatedAt: new Date().toISOString()
  };
};

const getScoreBand = (score) => {
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Low";
};

const toTitle = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [dataSource, setDataSource] = useState("insights");
  const [insights, setInsights] = useState(DEFAULT_INSIGHTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInsights = async () => {
    setLoading(true);
    setError("");
    try {
      if (dataSource === "social-intelligence") {
        const data = await getSocialIntelligence({});
        const adapted = adaptSocialIntelligencePayload(data);
        setInsights(normalizeInsights(adapted));
      } else {
        const data = await getInsights();
        setInsights(normalizeInsights(data));
      }
    } catch (err) {
      console.error("Failed to load insights:", err);
      if (dataSource === "social-intelligence") {
        setError("Could not load /api/ai/social-intelligence. This endpoint is protected; use valid backend JWT or switch to Insight Engine mode.");
      } else {
        setError("Could not load insights. Check backend server and MongoDB connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
    const interval = setInterval(loadInsights, 10000);
    return () => clearInterval(interval);
  }, [dataSource]);

  if (loading) {
    return (
      <div className="ai-insights-container loading">
        <div className="ai-loader">
          <div className="loader-spinner"></div>
          <p>🤖 AI is analyzing guest data from MongoDB...</p>
        </div>
      </div>
    );
  }

  const social = insights.socialEngagement || DEFAULT_INSIGHTS.socialEngagement;
  const networking = insights.networking || DEFAULT_INSIGHTS.networking;
  const emotions = insights.emotions || DEFAULT_INSIGHTS.emotions;
  const sentiment = insights.sentiment || DEFAULT_INSIGHTS.sentiment;
  const pairings = Array.isArray(insights.pairings) ? insights.pairings : [];

  const guestCount = social.guestScores?.length || 0;
  const topPairScore = pairings.length ? pairings[0].compatibilityScore : 0;
  const activeNetworkingGroups = networking.groups?.length || 0;
  const positiveSentiment = sentiment.counts?.positive || 0;
  const negativeSentiment = sentiment.counts?.negative || 0;
  const totalSentimentSignals =
    (sentiment.counts?.positive || 0) +
    (sentiment.counts?.neutral || 0) +
    (sentiment.counts?.negative || 0);
  const sentimentDirection =
    totalSentimentSignals === 0
      ? "No feedback yet"
      : positiveSentiment >= negativeSentiment
        ? "Positive trend"
        : "Needs attention";
  const socialOpennessMetric = social.dimensionScores?.socialOpenness;
  const interactionBalanceMetric = social.dimensionScores?.interactionBalance;
  const energyMetric = social.dimensionScores?.energyLevel;

  return (
    <div className="ai-insights-container">
      <div className="ai-header">
        <div className="ai-title-section">
          <h1>🤖 AI-Powered Social Intelligence</h1>
          <p>Hackathon MVP: live intelligence generated from current MongoDB guest data</p>
          {insights.generatedAt && (
            <p>Last generated: {new Date(insights.generatedAt).toLocaleString()}</p>
          )}
          {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
        </div>
        <button className="btn-refresh-insights" onClick={loadInsights}>
          🔄 Refresh Analysis
        </button>
      </div>

      <div className="source-switch">
        <button
          className={`source-btn ${dataSource === "insights" ? "active" : ""}`}
          onClick={() => setDataSource("insights")}
        >
          Insight Engine
        </button>
        <button
          className={`source-btn ${dataSource === "social-intelligence" ? "active" : ""}`}
          onClick={() => setDataSource("social-intelligence")}
        >
          Social Intelligence API
        </button>
      </div>

      <div className="mvp-summary">
        <div className="mvp-summary-card">
          <span className="mvp-label">Guests analyzed</span>
          <strong className="mvp-value">{guestCount}</strong>
        </div>
        <div className="mvp-summary-card">
          <span className="mvp-label">Engagement score</span>
          <strong className="mvp-value">{social.overallScore}</strong>
          <span className="mvp-sub">{getScoreBand(social.overallScore)} confidence signal</span>
        </div>
        <div className="mvp-summary-card">
          <span className="mvp-label">Networking sessions</span>
          <strong className="mvp-value">{activeNetworkingGroups}</strong>
          <span className="mvp-sub">auto-created from shared interests</span>
        </div>
        <div className="mvp-summary-card">
          <span className="mvp-label">Best pairing score</span>
          <strong className="mvp-value">{topPairScore}%</strong>
        </div>
        <div className="mvp-summary-card">
          <span className="mvp-label">Sentiment health</span>
          <strong className="mvp-value">{sentimentDirection}</strong>
          <span className="mvp-sub">{positiveSentiment} positive / {negativeSentiment} negative</span>
        </div>
      </div>

      <div className="ai-tabs">
        <button className={`tab-btn ${activeTab === "engagement" ? "active" : ""}`} onClick={() => setActiveTab("engagement")}>
          👥 Social Engagement
        </button>
        <button className={`tab-btn ${activeTab === "networking" ? "active" : ""}`} onClick={() => setActiveTab("networking")}>
          🤝 Networking
        </button>
        <button className={`tab-btn ${activeTab === "pairings" ? "active" : ""}`} onClick={() => setActiveTab("pairings")}>
          💑 Guest Pairings
        </button>
        <button className={`tab-btn ${activeTab === "emotions" ? "active" : ""}`} onClick={() => setActiveTab("emotions")}>
          😊 Emotional Intelligence
        </button>
        <button className={`tab-btn ${activeTab === "sentiment" ? "active" : ""}`} onClick={() => setActiveTab("sentiment")}>
          💬 Sentiment Analysis
        </button>
      </div>

      <div className="ai-content">
        {activeTab === "engagement" && (
          <div className="tab-content engagement-tab">
            <h2>Social Engagement Prediction</h2>
            <div className="engagement-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Engagement Score</div>
                  <div className="metric-value">{social.overallScore}</div>
                  <div className="metric-info">Derived from interests, interaction style, first-time flag, and energy</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Social Openness</div>
                  <div className="metric-value">
                    {socialOpennessMetric ? `${socialOpennessMetric.label} (${socialOpennessMetric.score})` : social.openness}
                  </div>
                  {socialOpennessMetric?.reason && <div className="metric-info">{socialOpennessMetric.reason}</div>}
                </div>
                <div className="metric-card">
                  <div className="metric-label">Interaction Balance</div>
                  <div className="metric-value">
                    {interactionBalanceMetric ? `${interactionBalanceMetric.label} (${interactionBalanceMetric.score})` : social.balance}
                  </div>
                  {interactionBalanceMetric?.reason && <div className="metric-info">{interactionBalanceMetric.reason}</div>}
                </div>
                <div className="metric-card">
                  <div className="metric-label">Energy Level</div>
                  <div className="metric-value">
                    {energyMetric ? `${energyMetric.label} (${energyMetric.score})` : social.energy}
                  </div>
                  {energyMetric?.reason && <div className="metric-info">{energyMetric.reason}</div>}
                </div>
              </div>
            </div>

            <div className="prediction-section">
              <h3>Insights</h3>
              <div className="recommendations-list">
                {(social.insights || []).map((item, index) => (
                  <div key={`${item}_${index}`} className="recommendation-item">
                    <div className="rec-content">
                      <strong>{item}</strong>
                    </div>
                  </div>
                ))}
                {(social.risks || []).map((risk, index) => (
                  <div key={`${risk}_${index}`} className="recommendation-item priority-high">
                    <div className="rec-content">
                      <strong>Risk: {risk}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="prediction-section">
              <h3>Per Guest Scores</h3>
              <div className="guests-prediction-grid">
                {(social.guestScores || []).map((item) => (
                  <div key={item.guestId} className="prediction-card">
                    <div className="card-header">
                      <h4>{item.guestName}</h4>
                      <span className="interaction-score">{item.score}%</span>
                    </div>
                    <div className="card-body">
                      <div className="prediction-item"><span className="label">Style</span><span className="value">{toTitle(item.preferredInteraction || "unspecified")}</span></div>
                      <div className="prediction-item"><span className="label">City</span><span className="value">{item.city}</span></div>
                      <div className="prediction-item"><span className="label">First Time</span><span className="value">{item.isFirstTime ? "Yes" : "No"}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              {(social.guestScores || []).length === 0 && (
                <div className="empty-state"><p>Add guests to generate engagement scores.</p></div>
              )}
            </div>
          </div>
        )}

        {activeTab === "networking" && (
          <div className="tab-content networking-tab">
            <h2>Networking Opportunities</h2>
            <div className="engagement-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Networking Readiness</div>
                  <div className="metric-value">
                    {networking.networkingReadiness?.score || 0}
                  </div>
                  <div className="metric-info">
                    {networking.networkingReadiness?.label || "Low Networking Potential"}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Recommended Action</div>
                  <div className="metric-value" style={{ fontSize: 20 }}>
                    {networking.recommendedAction || "Introduce guided icebreakers"}
                  </div>
                </div>
              </div>
            </div>

            {(networking.supportGuests || []).length > 0 && (
              <div className="prediction-section">
                <h3>Support Focus</h3>
                <div className="participant-list">
                  {networking.supportGuests.map((item) => (
                    <span key={item} className="participant-tag">{item}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="networking-grid">
              {(networking.groups || []).map((group) => (
                <div key={group.id} className="networking-card">
                  <div className="card-header">
                    <h3>{group.interest}</h3>
                    <span className="participant-badge">{group.count}</span>
                  </div>
                  <div className="card-body">
                    <p className="description">{group.reason || "Interest-based networking cluster"}</p>
                    <div className="detail-item">
                      <span className="icon">⏰</span>
                      <span className="text">{toTitle(group.bestTime || group.time || "evening")}</span>
                    </div>
                    <div className="detail-item" style={{ marginTop: 8 }}>
                      <span className="icon">🏷️</span>
                      <span className="text">{group.sessionType || group.type || "Open Mixer"}</span>
                    </div>
                    <div className="participant-list">
                      {group.participants.map((p) => (
                        <span key={p.id} className="participant-tag">{p.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(networking.groups || []).length === 0 && (
              <div className="empty-state"><p>No networking groups yet. Add guests with overlapping interests.</p></div>
            )}

          </div>
        )}

        {activeTab === "pairings" && (
          <div className="tab-content pairings-tab">
            <h2>Recommended Guest Pairings</h2>
            <div className="pairings-list">
              {pairings.map((pairing) => (
                <div key={pairing.pairId} className="pairing-card">
                  <div className="pairing-header">
                    <div className="guests-pair">
                      <span className="guest">{pairing.guest1.name}</span>
                      <span className="separator">💑</span>
                      <span className="guest">{pairing.guest2.name}</span>
                    </div>
                    <span className="compatibility-badge">{pairing.compatibilityScore}% Match</span>
                  </div>
                  <div className="pairing-body">
                    <div className="shared-interests">
                      <strong>Shared interests:</strong>
                      <div className="interests-list">
                        {(pairing.sharedInterests || []).map((interest) => (
                          <span key={interest} className="interest-tag">{interest}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pairings.length === 0 && (
              <div className="empty-state"><p>Pairings appear once at least two guests have meaningful overlap.</p></div>
            )}
          </div>
        )}

        {activeTab === "emotions" && (
          <div className="tab-content emotional-tab">
            <h2>Emotional Intelligence</h2>
            <div className="engagement-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Overall Group Mood</div>
                  <div className="metric-value">{emotions.groupMood}</div>
                </div>
              </div>
            </div>

            <div className="prediction-section">
              <h3>Mood Distribution</h3>
              <div className="participant-list">
                <span className="participant-tag">😊 Excited: {emotions.distribution?.excited || 0}%</span>
                <span className="participant-tag">😐 Neutral: {emotions.distribution?.neutral || 0}%</span>
                <span className="participant-tag">😴 Tired: {emotions.distribution?.tired || 0}%</span>
                <span className="participant-tag">😶 Disengaged: {emotions.distribution?.disengaged || 0}%</span>
              </div>
            </div>

            <div className="prediction-section">
              <h3>Actionable Recommendations</h3>
              <div className="recommendations-list">
                {(emotions.recommendations || []).map((item, index) => (
                  <div key={`${item}_${index}`} className="recommendation-item">
                    <div className="rec-content">
                      <strong>{item}</strong>
                    </div>
                  </div>
                ))}
              </div>
              {(emotions.recommendations || []).length === 0 && (
                <div className="empty-state"><p>No emotional risk currently detected.</p></div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sentiment" && (
          <div className="tab-content sentiment-tab">
            <h2>Sentiment Analysis</h2>
            <div className="engagement-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Positive</div>
                  <div className="metric-value">{sentiment.counts?.positive || 0}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Neutral</div>
                  <div className="metric-value">{sentiment.counts?.neutral || 0}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Negative</div>
                  <div className="metric-value">{sentiment.counts?.negative || 0}</div>
                </div>
              </div>
            </div>

            <div className="prediction-section">
              <h3>Sentiment Trend</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <div className="rec-content">
                    <strong>{sentiment.trend || "Sentiment stable"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {(sentiment.alerts || []).length > 0 && (
              <div className="prediction-section">
                <h3>Alerts</h3>
                <div className="recommendations-list">
                  {(sentiment.alerts || []).map((item, index) => (
                    <div key={`${item}_${index}`} className="recommendation-item priority-high">
                      <div className="rec-content">
                        <strong>{item}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(sentiment.actions || []).length > 0 && (
              <div className="prediction-section">
                <h3>Suggested Actions</h3>
                <div className="recommendations-list">
                  {(sentiment.actions || []).map((item, index) => (
                    <div key={`${item}_${index}`} className="recommendation-item">
                      <div className="rec-content">
                        <strong>{item}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="prediction-section">
              <h3>Recent Feedback</h3>
              <div className="recommendations-list">
                {(sentiment.recentFeedback || []).map((entry) => (
                  <div key={`${entry.guestId}_${entry.updatedAt}`} className="recommendation-item">
                    <div className="rec-content">
                      <strong>{entry.guestName} ({entry.sentiment})</strong>
                      <p>{entry.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(sentiment.recentFeedback || []).length === 0 && (
                <div className="empty-state"><p>No guest feedback captured yet.</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
