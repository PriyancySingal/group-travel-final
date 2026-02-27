/**
 * EventSimulationService
 * 
 * Core orchestrator for real-time event simulation.
 * Creates a living, breathing ecosystem where guests influence each other.
 * 
 * Coordinates:
 * - Guest behavior simulation
 * - Engagement propagation (contagion)
 * - Event phase transitions
 * - Network effects
 * - Risk detection
 * - Sentiment analysis
 */

class EventSimulationService {
  constructor() {
    this.simulationRunning = false;
    this.guests = [];
    this.currentPhase = "arrival";
    this.phaseStartTime = Date.now();
    this.phaseDuration = 30000; // 30 seconds per phase
    this.updateCallbacks = [];
    this.simulationInterval = null;

    // Import other services (will be dependency-injected)
    this.behaviorSimulator = null;
    this.engagementPropagator = null;
    this.phaseManager = null;
    this.networkGraph = null;
    this.sentimentAnalyzer = null;
    this.predictionEngine = null;
    this.riskDetector = null;
  }

  /**
   * Initialize simulation with guests and service dependencies
   */
  initialize(guests, services) {
    this.guests = guests.map(g => ({
      ...g,
      // Dynamic state
      messagesSent: 0,
      checkIns: 0,
      activitiesJoined: [],
      lastInteractionAt: new Date().toISOString(),
      sentimentScore: 0,
      dynamicEngagement: 50,
      connections: {}, // { guestId: interactionCount }
      feedback: [],
      // Predictive
      engagementHistory: [50],
      riskFlags: []
    }));

    // Inject services
    this.behaviorSimulator = services.behaviorSimulator;
    this.engagementPropagator = services.engagementPropagator;
    this.phaseManager = services.phaseManager;
    this.networkGraph = services.networkGraph;
    this.sentimentAnalyzer = services.sentimentAnalyzer;
    this.predictionEngine = services.predictionEngine;
    this.riskDetector = services.riskDetector;

    // Initialize network graph
    this.networkGraph.initialize(this.guests);
  }

  /**
   * Start real-time simulation loop
   * Every 3-4 seconds: simulate interactions, propagate engagement, check risks
   */
  startSimulation() {
    if (this.simulationRunning) return;
    this.simulationRunning = true;

    this.simulationInterval = setInterval(() => {
      this.simulationTick();
    }, 3500); // ~3.5 second ticks

    console.log("🎬 Event Simulation started");
  }

  /**
   * Main simulation tick - orchestrates all updates
   */
  simulationTick() {
    // 1. Update event phase if time exceeded
    this.updateEventPhase();

    // 2. Simulate micro-interactions for each guest
    this.guests = this.behaviorSimulator.simulateGuestBehavior(
      this.guests,
      this.currentPhase
    );

    // 3. Propagate engagement (contagion effect)
    this.guests = this.engagementPropagator.propagateEngagement(this.guests);

    // 4. Update network connections
    this.guests = this.networkGraph.updateConnections(
      this.guests,
      this.currentPhase
    );

    // 5. Build engagement history for predictions
    this.guests = this.guests.map(g => ({
      ...g,
      engagementHistory: [
        ...g.engagementHistory.slice(-9), // Keep last 10
        this.calculateEngagement(g)
      ]
    }));

    // 6. Run predictions
    this.guests = this.guests.map(g => ({
      ...g,
      predictedEngagement: this.predictionEngine.predictNextScore(
        g.engagementHistory
      )
    }));

    // 7. Detect risks
    this.guests = this.riskDetector.detectRisks(this.guests, this.currentPhase);

    // 8. Notify all observers
    this.notifyObservers();
  }

  /**
   * Check and transition event phases
   */
  updateEventPhase() {
    const elapsed = Date.now() - this.phaseStartTime;

    if (elapsed > this.phaseDuration) {
      const phases = ["arrival", "networking", "dinner", "winddown"];
      const currentIndex = phases.indexOf(this.currentPhase);
      const nextPhase = phases[(currentIndex + 1) % phases.length];

      this.currentPhase = nextPhase;
      this.phaseStartTime = Date.now();

      console.log(`📍 Event phase: ${nextPhase.toUpperCase()}`);
    }
  }

  /**
   * Core engagement calculation
   * Base 30 + activity bonuses + idle penalties
   */
  calculateEngagement(guest) {
    let score = 30;

    // Activity bonuses
    score += guest.activitiesJoined.length * 10;
    score += guest.messagesSent * 3;
    score += guest.checkIns * 5;

    // Connection bonus
    const connectionCount = Object.values(guest.connections).reduce(
      (a, b) => a + b,
      0
    );
    score += connectionCount * 2;

    // Idle penalty
    const hoursIdle =
      (Date.now() - new Date(guest.lastInteractionAt)) / 3600000;
    if (hoursIdle < 1) score += 8;
    if (hoursIdle > 5) score -= 10;

    // Sentiment influence
    if (guest.sentimentScore > 30) score += 10;
    if (guest.sentimentScore < -30) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Subscribe to simulation updates
   */
  subscribe(callback) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all observers of state update
   */
  notifyObservers() {
    this.updateCallbacks.forEach(callback => {
      callback({
        guests: this.guests,
        currentPhase: this.currentPhase,
        eventHealth: this.calculateEventHealth()
      });
    });
  }

  /**
   * Calculate overall event health (average engagement)
   */
  calculateEventHealth() {
    if (this.guests.length === 0) return 0;
    const avgEngagement =
      this.guests.reduce((sum, g) => sum + this.calculateEngagement(g), 0) /
      this.guests.length;
    return Math.round(avgEngagement);
  }

  /**
   * Stop simulation
   */
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.simulationRunning = false;
    console.log("⏹️ Event Simulation stopped");
  }

  /**
   * Get current simulation state
   */
  getState() {
    return {
      guests: this.guests,
      currentPhase: this.currentPhase,
      eventHealth: this.calculateEventHealth(),
      simulationRunning: this.simulationRunning
    };
  }

  /**
   * Add manual feedback to guest (judges can click "submit feedback")
   */
  submitGuestFeedback(guestId, feedbackText) {
    const guest = this.guests.find(g => g.id === guestId);
    if (!guest) return;

    const sentiment = this.sentimentAnalyzer.analyzeSentiment(feedbackText);

    guest.feedback.push({
      timestamp: new Date().toISOString(),
      text: feedbackText,
      sentiment
    });

    guest.sentimentScore = Math.round(
      guest.feedback.reduce((sum, f) => sum + f.sentiment, 0) /
      guest.feedback.length
    );

    this.notifyObservers();
  }
}

export default EventSimulationService;
