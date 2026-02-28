/**
 * RiskDetectionService
 * 
 * Identifies at-risk guests needing attention.
 * 
 * Risk factors:
 * - Low engagement (< 30)
 * - No interactions in 2+ hours
 * - Negative sentiment (< -30)
 * - Isolated (0 connections)
 * - Dropping engagement trend
 * 
 * Triggers alerts for event staff/organizers.
 */

class RiskDetectionService {
  /**
   * Detect all risks for all guests
   */
  detectRisks(guests, currentPhase) {
    return guests.map(guest => {
      const risks = [];

      // Risk 1: Low engagement
      if (this.calculateEngagement(guest) < 30) {
        risks.push({
          level: "high",
          type: "low_engagement",
          message: "Low engagement score"
        });
      }

      // Risk 2: Idle for extended period
      const hoursSinceInteraction =
        (Date.now() - new Date(guest.lastInteractionAt)) / 3600000;
      if (hoursSinceInteraction > 2) {
        risks.push({
          level: "medium",
          type: "idle",
          message: `No activity for ${Math.round(hoursSinceInteraction)} hours`
        });
      }

      // Risk 3: Negative sentiment
      if (guest.sentimentScore < -30) {
        risks.push({
          level: "high",
          type: "negative_sentiment",
          message: "Negative feedback detected"
        });
      }

      // Risk 4: Isolation (no connections)
      const connectionCount = Object.values(guest.connections || {}).reduce(
        (a, b) => a + b,
        0
      );
      if (
        connectionCount === 0 &&
        currentPhase !== "arrival" &&
        guest.checkIns > 0
      ) {
        risks.push({
          level: "medium",
          type: "isolated",
          message: "No connections formed yet"
        });
      }

      // Risk 5: Dropping engagement trend
      if (guest.engagementHistory && guest.engagementHistory.length > 3) {
        const recent = guest.engagementHistory.slice(-3);
        const trend = recent[2] - recent[0];

        if (trend < -15) {
          risks.push({
            level: "medium",
            type: "dropping_engagement",
            message: "Engagement trending downward"
          });
        }
      }

      // Risk 6: Special needs not flagged
      if (
        (guest.specialNeeds?.length > 0 || guest.mobilityAssistance) &&
        guest.checkIns === 0
      ) {
        risks.push({
          level: "low",
          type: "special_needs_unaddressed",
          message: "Special needs guest not participating yet"
        });
      }

      return {
        ...guest,
        riskFlags: risks,
        riskLevel: this.calculateRiskLevel(risks)
      };
    });
  }

  /**
   * Calculate overall risk level for a guest
   */
  calculateRiskLevel(risks) {
    if (risks.length === 0) return "low";

    const highRisks = risks.filter(r => r.level === "high").length;
    const mediumRisks = risks.filter(r => r.level === "medium").length;

    if (highRisks > 0) return "high";
    if (mediumRisks >= 2) return "medium";
    if (mediumRisks > 0) return "low";

    return "low";
  }

  /**
   * Get guests that need immediate attention
   */
  getAtRiskGuests(guests) {
    return guests.filter(g => g.riskLevel === "high" || g.riskLevel === "medium");
  }

  /**
   * Generate recommended actions
   */
  getRecommendedAction(guest) {
    if (!guest.riskFlags || guest.riskFlags.length === 0) {
      return null;
    }

    const highestRisk = guest.riskFlags[0];

    const actions = {
      low_engagement: `Invite ${guest.name} to a nearby activity or group conversation`,
      idle: `Check in on ${guest.name} - they've been quiet for a while`,
      negative_sentiment: `Follow up with ${guest.name} about their experience`,
      isolated: `Introduce ${guest.name} to others with shared interests`,
      dropping_engagement: `Engage ${guest.name} with a new activity or group`,
      special_needs_unaddressed: `Ensure ${guest.name}'s special needs are being accommodated`
    };

    return actions[highestRisk.type] || "Monitor guest";
  }

  /**
   * Calculate engagement helper
   */
  calculateEngagement(guest) {
    let score = 30;
    score += guest.activitiesJoined?.length * 10 || 0;
    score += guest.messagesSent * 3;
    score += guest.checkIns * 5;
    const hoursIdle =
      (Date.now() - new Date(guest.lastInteractionAt)) / 3600000;
    if (hoursIdle < 1) score += 8;
    if (hoursIdle > 5) score -= 10;
    if (guest.sentimentScore > 30) score += 10;
    if (guest.sentimentScore < -30) score -= 15;
    return Math.max(0, Math.min(100, score));
  }
}

export default new RiskDetectionService();
