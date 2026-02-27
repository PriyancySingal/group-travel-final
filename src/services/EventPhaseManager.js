/**
 * EventPhaseManager
 * 
 * Manages event lifecycle: Arrival → Networking → Dinner → Winddown
 * 
 * Each phase has different characteristics:
 * - Different behavior intensities
 * - Different activity types
 * - Different sentiment patterns
 * 
 * Phases auto-transition to create sense of event progression.
 */

class EventPhaseManager {
  constructor() {
    this.phases = ["arrival", "networking", "dinner", "winddown"];
    this.phaseDescriptions = {
      arrival: {
        emoji: "👋",
        title: "Arrival & Welcome",
        description: "Guests arriving, settling in",
        messageMultiplier: 0.5,
        activityMultiplier: 0.3,
        expectedMood: "Neutral"
      },
      networking: {
        emoji: "🤝",
        title: "Networking Peak",
        description: "Peak social engagement time",
        messageMultiplier: 1.5,
        activityMultiplier: 1.5,
        expectedMood: "Excited"
      },
      dinner: {
        emoji: "🍽️",
        title: "Group Dinner",
        description: "Shared meal and conversation",
        messageMultiplier: 1.1,
        activityMultiplier: 0.9,
        expectedMood: "Content"
      },
      winddown: {
        emoji: "🌙",
        title: "Wind Down",
        description: "Relaxing, winding down",
        messageMultiplier: 0.6,
        activityMultiplier: 0.4,
        expectedMood: "Relaxed"
      }
    };
  }

  /**
   * Get description of current phase
   */
  getPhaseInfo(phase) {
    return this.phaseDescriptions[phase] || this.phaseDescriptions.arrival;
  }

  /**
   * Get activity recommendations based on phase
   */
  getPhaseActivities(phase) {
    const activities = {
      arrival: ["Check-in", "Grab Refreshment", "Settle in"],
      networking: ["Networking Circle", "Icebreaker Games", "Speed Networking"],
      dinner: ["Group Dinner", "Table Conversations", "Dessert"],
      winddown: ["Lounge Area", "Photo Memories", "Closing Remarks"]
    };
    return activities[phase] || [];
  }

  /**
   * Get expected engagement multiplier for phase
   */
  getPhaseMultiplier(phase) {
    const multipliers = {
      arrival: 0.5,
      networking: 1.5,
      dinner: 1.1,
      winddown: 0.6
    };
    return multipliers[phase] || 1;
  }
}

export default new EventPhaseManager();
