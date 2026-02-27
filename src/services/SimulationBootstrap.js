/**
 * SimulationBootstrap
 * 
 * One-stop initialization for the entire real-time event simulation system.
 * 
 * Usage in React:
 * 
 * const simulation = new SimulationBootstrap();
 * simulation.initialize(guests);
 * simulation.start((state) => {
 *   setGuests(state.guests);
 *   setEventHealth(state.eventHealth);
 * });
 * 
 * return () => simulation.stop();
 */

import EventSimulationService from "./EventSimulationService";
import GuestBehaviorSimulator from "./GuestBehaviorSimulator";
import EngagementPropagationService from "./EngagementPropagationService";
import EventPhaseManager from "./EventPhaseManager";
import NetworkGraphService from "./NetworkGraphService";
import SentimentContextService from "./SentimentContextService";
import PredictionEngine from "./PredictionEngine";
import RiskDetectionService from "./RiskDetectionService";
import AIInsightsGenerator from "./AIInsightsGenerator";
import NetworkingOpportunitiesService from "./NetworkingOpportunitiesService";

class SimulationBootstrap {
  constructor() {
    this.simulation = null;
  }

  /**
   * Initialize simulation with guests
   */
  initialize(guests) {
    // Create fresh simulation instance
    this.simulation = new EventSimulationService();

    // Inject all dependencies
    this.simulation.initialize(guests, {
      behaviorSimulator: GuestBehaviorSimulator,
      engagementPropagator: EngagementPropagationService,
      phaseManager: EventPhaseManager,
      networkGraph: NetworkGraphService,
      sentimentAnalyzer: SentimentContextService,
      predictionEngine: PredictionEngine,
      riskDetector: RiskDetectionService
    });

    return this.simulation;
  }

  /**
   * Start simulation with callback
   */
  start(callback) {
    if (!this.simulation) {
      console.error("Call initialize() first");
      return;
    }

    this.simulation.subscribe((state) => {
      callback(state);
    });

    this.simulation.startSimulation();

    return () => this.stop();
  }

  /**
   * Stop simulation
   */
  stop() {
    if (this.simulation) {
      this.simulation.stopSimulation();
    }
  }

  /**
   * Get current state
   */
  getState() {
    return this.simulation ? this.simulation.getState() : null;
  }

  /**
   * Submit guest feedback (for feedback form)
   */
  submitFeedback(guestId, text) {
    if (this.simulation) {
      this.simulation.submitGuestFeedback(guestId, text);
    }
  }

  /**
   * Get AI insights for current state
   */
  getInsights(state) {
    const { guests, currentPhase, eventHealth } = state;

    // Get at-risk guests using risk detector
    const guestsWithRisks = RiskDetectionService.detectRisks(guests, currentPhase);
    const atRiskGuests = guestsWithRisks.filter(g => g.riskLevel === 'high' || g.riskLevel === 'medium');

    // Generate networking opportunities
    const networkingOps = NetworkingOpportunitiesService.generateOpportunities(guests, currentPhase);

    // Generate insights
    return AIInsightsGenerator.generateInsights(
      guests,
      currentPhase,
      eventHealth,
      networkingOps,
      atRiskGuests
    );
  }

  /**
   * Get networking opportunities
   */
  getNetworkingOpportunities(guests, currentPhase) {
    return NetworkingOpportunitiesService.generateOpportunities(guests, currentPhase);
  }

  /**
   * Get helper utilities for components
   */
  getHelpers() {
    return {
      phaseManager: EventPhaseManager,
      sentimentAnalyzer: SentimentContextService,
      predictionEngine: PredictionEngine,
      riskDetector: RiskDetectionService,
      networkGraph: NetworkGraphService,
      insightsGenerator: AIInsightsGenerator,
      networkingService: NetworkingOpportunitiesService
    };
  }
}

export default SimulationBootstrap;
