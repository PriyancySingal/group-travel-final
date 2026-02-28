/**
 * SentimentContextService
 * 
 * Analyzes sentiment from guest feedback.
 * Scores sentiment contextually based on event phase.
 * 
 * Example:
 * - Negative feedback during networking = Major concern
 * - Negative feedback during winddown = Expected (people tired)
 * 
 * Generates operational alerts tied to actionable insights.
 */

class SentimentContextService {
  constructor() {
    this.positiveWords = [
      "great",
      "amazing",
      "good",
      "love",
      "fun",
      "excellent",
      "wonderful",
      "fantastic",
      "awesome",
      "incredible"
    ];

    this.negativeWords = [
      "bad",
      "boring",
      "tired",
      "crowded",
      "slow",
      "uncomfortable",
      "disappointed",
      "frustrating",
      "terrible",
      "hate"
    ];
  }

  /**
   * Analyze sentiment of feedback text
   * Returns score from -100 to +100
   */
  analyzeSentiment(text) {
    if (!text || text.length === 0) return 0;

    let score = 0;
    const words = text.toLowerCase().split(/\s+/);

    words.forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[.,!?;:]/g, "");

      if (this.positiveWords.includes(cleanWord)) score += 10;
      if (this.negativeWords.includes(cleanWord)) score -= 10;
    });

    // Normalize to -100 to +100
    return Math.max(-100, Math.min(100, score));
  }

  /**
   * Get emotional state from engagement and sentiment
   */
  getEmotionalState(guest) {
    const engagement = this.calculateEngagement(guest);
    const sentiment = guest.sentimentScore || 0;

    if (engagement > 70 && sentiment > 0) {
      return {
        mood: "Excited",
        energy: "High",
        stress: "Low"
      };
    }

    if (engagement > 50 && sentiment >= 0) {
      return {
        mood: "Content",
        energy: "Moderate",
        stress: "Normal"
      };
    }

    if (engagement < 30 && sentiment < -20) {
      return {
        mood: "Overwhelmed",
        energy: "Low",
        stress: "Elevated"
      };
    }

    if (engagement < 30) {
      return {
        mood: "Withdrawn",
        energy: "Low",
        stress: "Moderate"
      };
    }

    return {
      mood: "Neutral",
      energy: "Moderate",
      stress: "Normal"
    };
  }

  /**
   * Generate context-aware insights
   */
  generateInsight(guest, currentPhase) {
    const state = this.getEmotionalState(guest);

    if (currentPhase === "networking" && state.energy === "Low") {
      return {
        type: "concern",
        text: `${guest.name} seems withdrawn during peak networking. Consider a friendly check-in.`
      };
    }

    if (guest.sentimentScore < -30) {
      return {
        type: "alert",
        text: `${guest.name} has shared negative feedback. Follow-up recommended.`
      };
    }

    if (guest.sentimentScore > 50 && state.energy === "High") {
      return {
        type: "positive",
        text: `${guest.name} is having an amazing time! Their energy is infectious.`
      };
    }

    if (state.stress === "Elevated") {
      return {
        type: "concern",
        text: `${guest.name} may be stressed. Offer quiet space or assistance.`
      };
    }

    return null;
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

export default new SentimentContextService();
