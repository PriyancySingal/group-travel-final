/**
 * GuestBehaviorSimulator
 * 
 * Simulates realistic micro-interactions for each guest:
 * - Messages sent
 * - Check-ins (joining activities)
 * - Social engagement patterns
 * 
 * Behavior varies by event phase to feel life-like.
 */

class GuestBehaviorSimulator {
  /**
   * Simulate behavior for all guests in current event phase
   */
  simulateGuestBehavior(guests, currentPhase) {
    const phaseMultipliers = {
      arrival: 0.5,      // Slower: people settling in
      networking: 1.5,   // Peak: social hour
      dinner: 1.1,       // Steady: eating and chatting
      winddown: 0.6      // Lower: people getting tired
    };

    const multiplier = phaseMultipliers[currentPhase] || 1;

    return guests.map(guest => {
      // Random chance to send a message (increases with phase multiplier)
      const messageProbability = 0.3 * multiplier;
      const newMessages = Math.random() < messageProbability ? 1 : 0;

      // Random chance to check in (join activity)
      const checkInProbability = 0.2 * multiplier;
      const newCheckIns = Math.random() < checkInProbability ? 1 : 0;

      // Occasional activity join (only during networking/dinner)
      let newActivity = null;
      if ((currentPhase === "networking" || currentPhase === "dinner") &&
        Math.random() < 0.15 * multiplier) {
        newActivity = this.getRandomActivity();
      }

      return {
        ...guest,
        messagesSent: guest.messagesSent + newMessages,
        checkIns: guest.checkIns + newCheckIns,
        activitiesJoined: newActivity
          ? [...guest.activitiesJoined, newActivity]
          : guest.activitiesJoined,
        lastInteractionAt: newMessages > 0 || newCheckIns > 0 || newActivity
          ? new Date().toISOString()
          : guest.lastInteractionAt
      };
    });
  }

  /**
   * Get a random activity name
   */
  getRandomActivity() {
    const activities = [
      "Networking Circle",
      "Dessert Bar",
      "Photo Session",
      "Q&A Panel",
      "Cocktail Hour",
      "Games Zone",
      "VIP Lounge",
      "Group Dinner",
      "Karaoke",
      "Scenic Tour"
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }
}

export default new GuestBehaviorSimulator();
