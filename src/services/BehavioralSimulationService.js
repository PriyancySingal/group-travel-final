/**
 * BehavioralSimulationService.js
 *
 * Signal-driven simulation that feeds the BehavioralModelEngine.
 *
 * PRINCIPLE: Simulation modifies ACTIVITY SIGNALS, not engagement directly.
 * The MODEL calculates engagement from those signals.
 *
 * This makes the system feel like a real behavioral modeling engine.
 */

import BehavioralModelEngine from "./BehavioralModelEngine";

class BehavioralSimulationService {
  constructor() {
    this.model = BehavioralModelEngine;
    this.isRunning = false;
    this.simulationInterval = null;
    this.eventPhase = "arrival"; // arrival, networking, dinner, winddown
    this.phaseStartTime = Date.now();
    this.observers = [];

    // Phase configurations affecting guest behavior
    this.phaseConfig = {
      arrival: {
        duration: 30000, // 30 seconds per phase for demo
        messageProbability: 0.2,
        activityProbability: 0.1,
        connectionProbability: 0.05,
        description: "Guests arriving and settling in",
      },
      networking: {
        duration: 30000,
        messageProbability: 0.5,
        activityProbability: 0.3,
        connectionProbability: 0.25,
        description: "Peak social interaction period",
      },
      dinner: {
        duration: 30000,
        messageProbability: 0.3,
        activityProbability: 0.2,
        connectionProbability: 0.15,
        description: "Dining and casual conversation",
      },
      winddown: {
        duration: 30000,
        messageProbability: 0.15,
        activityProbability: 0.05,
        connectionProbability: 0.05,
        description: "Event winding down, lower energy",
      },
    };

    // Guest behavior profiles (affects how they respond to phases)
    this.behaviorProfiles = {
      social_butterfly: {
        messageBoost: 1.5,
        connectionBoost: 2.0,
        activityBoost: 1.2,
        propensityRange: [60, 80],
      },
      moderate: {
        messageBoost: 1.0,
        connectionBoost: 1.0,
        activityBoost: 1.0,
        propensityRange: [40, 60],
      },
      reserved: {
        messageBoost: 0.4,
        connectionBoost: 0.3,
        activityBoost: 0.5,
        propensityRange: [20, 40],
      },
    };
  }

  /**
   * Initialize simulation with guest data.
   */
  initialize(guests) {
    // Reset model
    this.model.reset();

    // Initialize each guest in the model
    for (const guest of guests) {
      // Assign behavior profile based on base propensity
      const modelGuest = this.model.initializeGuest(guest);
      modelGuest.behaviorProfile = this.assignBehaviorProfile(
        modelGuest.basePropensity
      );
    }

    // Set initial phase
    this.eventPhase = "arrival";
    this.phaseStartTime = Date.now();

    return this.model.getSystemState();
  }

  assignBehaviorProfile(propensity) {
    if (propensity >= 60) return "social_butterfly";
    if (propensity >= 40) return "moderate";
    return "reserved";
  }

  /**
   * Start the simulation loop.
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    // Run simulation tick every 3.5 seconds
    this.simulationInterval = setInterval(() => {
      this.simulationTick();
    }, 3500);

    // Phase transition check every second
    this.phaseInterval = setInterval(() => {
      this.checkPhaseTransition();
    }, 1000);

    return true;
  }

  /**
   * Stop the simulation.
   */
  stop() {
    this.isRunning = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.phaseInterval) {
      clearInterval(this.phaseInterval);
      this.phaseInterval = null;
    }
    return true;
  }

  /**
   * Check if we should transition to next phase.
   */
  checkPhaseTransition() {
    const phase = this.phaseConfig[this.eventPhase];
    const elapsed = Date.now() - this.phaseStartTime;

    if (elapsed >= phase.duration) {
      this.transitionPhase();
    }
  }

  /**
   * Transition to next event phase.
   */
  transitionPhase() {
    const phases = ["arrival", "networking", "dinner", "winddown"];
    const currentIndex = phases.indexOf(this.eventPhase);
    const nextIndex = (currentIndex + 1) % phases.length;

    this.eventPhase = phases[nextIndex];
    this.phaseStartTime = Date.now();

    // Notify observers of phase change
    this.notifyObservers({
      type: "phase_change",
      phase: this.eventPhase,
      description: this.phaseConfig[this.eventPhase].description,
    });
  }

  /**
   * Main simulation tick.
   * Modifies activity signals, lets model calculate engagement.
   */
  simulationTick() {
    if (!this.isRunning) return;

    const phase = this.phaseConfig[this.eventPhase];
    const guests = this.model.getAllGuestStates();

    // For each guest, generate activity signals
    for (const guestState of guests) {
      const guest = this.model.guests.get(guestState.id);
      if (!guest) continue;

      const profile = this.behaviorProfiles[guest.behaviorProfile];

      // Generate messages (affected by phase and profile)
      if (Math.random() < phase.messageProbability * profile.messageBoost) {
        const messageCount = Math.floor(Math.random() * 2) + 1;
        this.model.recordActivity(guest.id, "message", { count: messageCount });
      }

      // Generate activity joins
      if (Math.random() < phase.activityProbability * profile.activityBoost) {
        this.model.recordActivity(guest.id, "activity_join");
      }

      // Generate connections (networking phase has higher probability)
      if (
        Math.random() <
        phase.connectionProbability * profile.connectionBoost
      ) {
        // Find a random other guest to connect with
        const otherGuests = guests.filter((g) => g.id !== guest.id);
        if (otherGuests.length > 0) {
          const target =
            otherGuests[Math.floor(Math.random() * otherGuests.length)];
          this.model.recordActivity(guest.id, "connection", {
            connectedGuestId: target.id,
          });
        }
      }

      // Occasional check-ins
      if (Math.random() < 0.1) {
        this.model.recordActivity(guest.id, "check_in");
      }
    }

    // Update all guest engagement scores based on new signals
    const eventEnergy = this.model.calculateEventEnergy().score;
    for (const guestState of guests) {
      this.model.updateEngagement(guestState.id, eventEnergy);
    }

    // Recalculate emotional states periodically
    for (const guestState of guests) {
      if (guestState.engagementHistory.length % 3 === 0) {
        this.model.updateEmotionalState(guestState.id);
      }
    }

    // Detect risks
    this.model.detectRisks();

    // Get complete system state
    const systemState = this.model.getSystemState();

    // Notify observers
    this.notifyObservers({
      type: "tick",
      phase: this.eventPhase,
      state: systemState,
    });

    return systemState;
  }

  /**
   * Submit guest feedback (sentiment analysis).
   */
  submitFeedback(guestId, text, sentiment) {
    // Auto-detect sentiment if not provided
    if (!sentiment) {
      sentiment = this.detectSentiment(text);
    }

    const result = this.model.recordActivity(guest.id, "feedback", {
      sentiment,
      text,
    });

    this.notifyObservers({
      type: "feedback",
      guestId,
      sentiment,
      text,
    });

    return result;
  }

  detectSentiment(text) {
    const positiveWords = [
      "great",
      "excellent",
      "amazing",
      "love",
      "fantastic",
      "awesome",
      "good",
      "happy",
      "enjoy",
      "wonderful",
    ];
    const negativeWords = [
      "terrible",
      "awful",
      "hate",
      "bad",
      "poor",
      "disappointing",
      "boring",
      "sad",
      "unhappy",
      "frustrated",
    ];

    const lowerText = text.toLowerCase();
    const posCount = positiveWords.filter((w) => lowerText.includes(w)).length;
    const negCount = negativeWords.filter((w) => lowerText.includes(w)).length;

    if (posCount > negCount) return "positive";
    if (negCount > posCount) return "negative";
    return "neutral";
  }

  /**
   * Get recommended action for at-risk guest.
   */
  getRecommendedAction(guestId) {
    const guest = this.model.getGuestState(guestId);
    if (!guest || guest.riskFlags.length === 0) return null;

    // Prioritize highest severity risk
    const highRisk = guest.riskFlags.find((r) => r.severity === "high");
    const risk = highRisk || guest.riskFlags[0];

    return risk.recommendation;
  }

  /**
   * Subscribe to simulation updates.
   */
  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  notifyObservers(data) {
    this.observers.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error("Observer error:", err);
      }
    });
  }

  /**
   * Get current system state.
   */
  getState() {
    return {
      phase: this.eventPhase,
      phaseDescription: this.phaseConfig[this.eventPhase].description,
      phaseElapsed: Date.now() - this.phaseStartTime,
      isRunning: this.isRunning,
      ...this.model.getSystemState(),
    };
  }

  /**
   * Get phase info for display.
   */
  getPhaseInfo() {
    const phaseInfo = {
      arrival: {
        title: "Arrival",
        emoji: "🛬",
        description: "Guests arriving and settling in. Lower activity expected.",
      },
      networking: {
        title: "Networking",
        emoji: "🤝",
        description: "Peak social interaction. High engagement expected.",
      },
      dinner: {
        title: "Dinner",
        emoji: "🍽️",
        description: "Dining and casual conversation. Moderate engagement.",
      },
      winddown: {
        title: "Wind Down",
        emoji: "🌅",
        description: "Event concluding. Energy levels decreasing.",
      },
    };

    return {
      phase: this.eventPhase,
      ...phaseInfo[this.eventPhase],
    };
  }
}

export default new BehavioralSimulationService();
