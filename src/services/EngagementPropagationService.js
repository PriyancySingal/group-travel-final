/**
 * EngagementPropagationService
 * 
 * Makes engagement contagious - guests influence each other's energy.
 * 
 * Core principle: If nearby guests (similar engagement level) are active,
 * they pull others up. FOMO effect.
 * 
 * Creates ripple effects that make the dashboard feel like a living ecosystem.
 */

class EngagementPropagationService {
  /**
   * Propagate engagement scores based on nearby guests
   * Similar engagement levels influence each other
   */
  propagateEngagement(guests) {
    return guests.map(guest => {
      // Find nearby guests (within 20 engagement points)
      const nearbyGuests = guests.filter(other =>
        other.id !== guest.id &&
        Math.abs(this.calculateEngagement(other) - this.calculateEngagement(guest)) < 20
      );

      if (nearbyGuests.length === 0) {
        return { ...guest, dynamicScore: this.calculateEngagement(guest) };
      }

      // Calculate influence from nearby guests
      const nearbyEngagement =
        nearbyGuests.reduce((sum, g) => sum + this.calculateEngagement(g), 0) /
        nearbyGuests.length;

      // 70% personal score, 30% nearby influence
      const blendedScore =
        this.calculateEngagement(guest) * 0.7 + nearbyEngagement * 0.3;

      return {
        ...guest,
        dynamicScore: Math.round(blendedScore)
      };
    });
  }

  /**
   * Calculate engagement for a guest
   */
  calculateEngagement(guest) {
    let score = 30;

    score += guest.activitiesJoined.length * 10;
    score += guest.messagesSent * 3;
    score += guest.checkIns * 5;

    const connectionCount = Object.values(guest.connections || {}).reduce(
      (a, b) => a + b,
      0
    );
    score += connectionCount * 2;

    const hoursIdle =
      (Date.now() - new Date(guest.lastInteractionAt)) / 3600000;
    if (hoursIdle < 1) score += 8;
    if (hoursIdle > 5) score -= 10;

    if (guest.sentimentScore > 30) score += 10;
    if (guest.sentimentScore < -30) score -= 15;

    return Math.max(0, Math.min(100, score));
  }
}

export default new EngagementPropagationService();
