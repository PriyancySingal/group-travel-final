/**
 * AI-Powered Social Intelligence Layer Service
 * Handles guest interaction prediction, networking opportunities, and emotional intelligence
 * Now connected to backend MongoDB for real-time data
 */

const API_BASE_URL = '/api/ai';

import AuthService from './AuthService';

class AISocialIntelligenceService {
  constructor() {
    this.predictions = new Map();
    this.sentimentHistory = [];
    this.engagementMetrics = new Map();
    this.currentEventId = null;
    this.isUsingBackend = true;
  }

  // Set the current event ID for API calls
  setEventId(eventId) {
    this.currentEventId = eventId;
  }

  // Micro dynamic variation (controlled drift)
  microDrift() {
    const minute = new Date().getMinutes();
    return Math.sin(minute / 5) * 3; // Small oscillation between -3 and +3
  }

  // Dynamic energy calculation based on guests
  calculateEnergy(guests) {
    if (!guests.length) return 0;

    const base =
      40 +
      guests.length * 2 +
      guests.filter(g => g.personalityType === "extravert").length * 4 +
      guests.filter(g => g.personalityType === "ambivert").length * 2;

    const drift = this.microDrift();

    return Math.min(90, Math.max(30, Math.round(base + drift)));
  }

  // Dynamic participation rate based on social personality
  calculateParticipation(guests) {
    if (!guests.length) return 0;

    const sociallyInclined =
      guests.filter(g =>
        g.personalityType === "extravert" ||
        g.personalityType === "ambivert"
      ).length;

    const ratio = sociallyInclined / guests.length;

    const drift = this.microDrift() / 5;

    return Math.min(100, Math.round(ratio * 100 + drift));
  }

  // Calculate trend based on previous energy
  previousEnergies = new Map();
  calculateTrend(eventId, currentEnergy) {
    const previous = this.previousEnergies.get(eventId) || currentEnergy;
    this.previousEnergies.set(eventId, currentEnergy);

    const diff = currentEnergy - previous;
    if (diff > 2) return "Increasing";
    if (diff < -2) return "Decreasing";
    return "Stable";
  }

  // ============== API CALLS ==============

  // Fetch guests data from backend
  async fetchGuestsFromBackend(eventId) {
    try {
      // always attempt backend if we have a token or we think backend should be used
      this.isUsingBackend = !!AuthService.getToken();
      const headers = { 'Content-Type': 'application/json' };
      const token = AuthService.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/guests-data/${eventId}`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          // authentication issue; let caller fallback but don't permanently disable
          console.warn('AI backend request unauthorized');
          return null;
        }
        throw new Error('Failed to fetch guests data');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching guests from backend:', error);
      return null;
    }
  }

  // Fetch all predictions from backend
  async fetchPredictionsFromBackend(eventId) {
    try {
      this.isUsingBackend = !!AuthService.getToken();
      const headers = { 'Content-Type': 'application/json' };
      const token = AuthService.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/predictions/${eventId}`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('AI backend request unauthorized');
          return null;
        }
        throw new Error('Failed to fetch predictions');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching predictions from backend:', error);
      return null;
    }
  }

  // Subscribe to live prediction stream (EventSource)
  subscribeToPredictionStream(eventId, onPrediction, onError) {
    const token = AuthService.getToken();
    let url = `${API_BASE_URL}/predictions-stream/${eventId}`;
    if (token) {
      // add token in query string for SSE auth
      url += `?token=${token}`;
    }
    const source = new EventSource(url);

    source.addEventListener('prediction', (e) => {
      try {
        const data = JSON.parse(e.data);
        onPrediction(data);
      } catch (err) {
        console.error('Failed to parse SSE prediction event', err);
      }
    });
    source.addEventListener('error', (e) => {
      console.error('Prediction stream error', e);
      if (onError) onError(e);
    });

    return source; // caller can close via source.close()
  }

  // Track engagement to backend
  async trackEngagementToBackend(engagementData) {
    try {
      const response = await fetch(`${API_BASE_URL}/track-engagement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(engagementData)
      });

      if (!response.ok) {
        throw new Error('Failed to track engagement');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error tracking engagement:', error);
      return null;
    }
  }

  // Track engagement EVENT (new event-driven system)
  async trackEngagementEvent({ eventId, guestId, eventType, metadata = {} }) {
    try {
      const token = AuthService.getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/track-event`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ eventId, guestId, eventType, metadata })
      });

      if (!response.ok) {
        throw new Error('Failed to track engagement event');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error tracking engagement event:', error);
      return null;
    }
  }

  // Track sentiment to backend
  async trackSentimentToBackend(sentimentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/track-sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sentimentData)
      });

      if (!response.ok) {
        throw new Error('Failed to track sentiment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error tracking sentiment:', error);
      return null;
    }
  }

  // Get engagement stats
  async getEngagementStats(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/engagement-stats/${eventId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch engagement stats');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
      return null;
    }
  }

  // Get sentiment analytics
  async getSentimentAnalytics(eventId, timeRange = 60) {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment-analytics/${eventId}?timeRange=${timeRange}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch sentiment analytics');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching sentiment analytics:', error);
      return null;
    }
  }

  // ============== INTERACTION EVENT TRACKING =============

  /**
   * Record a guest interaction event
   * @param {string} eventId - Event ID
   * @param {Object} interactionData - { guestId, targetGuestId, type, metadata }
   */
  async recordInteraction(eventId, { guestId, targetGuestId, type, metadata = {} }) {
    try {
      const token = AuthService.getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/interactions/${eventId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ guestId, targetGuestId, type, metadata })
      });

      if (!response.ok) {
        throw new Error('Failed to record interaction');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error recording interaction:', error);
      return null;
    }
  }

  /**
   * Get interaction history for an event
   * @param {string} eventId - Event ID
   * @param {Object} options - { type, since, limit }
   */
  async getInteractions(eventId, options = {}) {
    try {
      const { type, since, limit = 100 } = options;
      const token = AuthService.getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const queryParams = new URLSearchParams();
      if (type) queryParams.append('type', type);
      if (since) queryParams.append('since', since);
      queryParams.append('limit', limit);

      const response = await fetch(`${API_BASE_URL}/interactions/${eventId}?${queryParams}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interactions');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return null;
    }
  }

  /**
   * Get interaction statistics for an event
   * @param {string} eventId - Event ID
   */
  async getInteractionStats(eventId) {
    try {
      const token = AuthService.getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/interactions/${eventId}/stats`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interaction stats');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching interaction stats:', error);
      return null;
    }
  }

  /**
   * Get smart pairings based on interaction history
   * @param {string} eventId - Event ID
   */
  async getSmartPairings(eventId) {
    try {
      const token = AuthService.getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/smart-pairings/${eventId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch smart pairings');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching smart pairings:', error);
      return null;
    }
  }

  // ============== SOCIAL ENGAGEMENT PREDICTION =============

  /**
   * Predict how guests might interact based on profiles
   * @param {Array} guests - List of guests with profiles
   * @returns {Array} Guest interaction predictions
   */
  predictGuestInteractions(guests) {
    const predictions = [];

    for (const guest of guests) {
      const interactionProfile = {
        guestId: guest.id || guest._id,
        guestName: guest.name,
        interactionScore: this.calculateInteractionScore(guest),
        socialPreferences: this.determineSocialPreferences(guest),
        preferredInteractionStyle: this.identifyInteractionStyle(guest),
        riskFactors: this.identifyRiskFactors(guest),
      };

      predictions.push(interactionProfile);
      this.predictions.set(guest.id || guest._id, interactionProfile);
    }

    return predictions;
  }

  /**
   * Calculate interaction score for a guest (0-100)
   */
  calculateInteractionScore(guest) {
    let score = 50; // baseline

    // Factor 1: Social media activity level (0-20 points)
    if (guest.socialMediaActivity) {
      score += Math.min(guest.socialMediaActivity / 5, 20);
    }

    // Factor 2: Event attendance history (0-15 points)
    if (guest.eventAttendanceCount) {
      score += Math.min(guest.eventAttendanceCount * 1.5, 15);
    }

    // Factor 3: Shared interests (0-15 points)
    if (guest.interests && guest.interests.length > 0) {
      score += Math.min(guest.interests.length * 3, 15);
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Determine social preferences from guest profile
   */
  determineSocialPreferences(guest) {
    return {
      networkingFriendly: guest.openToNetworking !== false,
      groupActivityPreference: guest.groupActivityPreference || 'moderate',
      introvertExtravert: this.analyzePersonalityTrait(guest),
      communicationStyle: guest.communicationStyle || 'balanced',
      interestAreas: guest.interests || [],
      professionalFocus: guest.professionalInterests || [],
      hobbyInterests: guest.hobbyInterests || [],
    };
  }

  /**
   * Identify interaction style (introvert/extravert/ambivert)
   */
  identifyInteractionStyle(guest) {
    const style = guest.personalityType || 'ambivert';
    const styleMap = {
      introvert: {
        name: 'Introvert',
        preference: 'Small group conversations',
        optimalGroupSize: '2-4',
        energyDrain: 'Large events',
        suggestion: 'One-on-one networking sessions',
      },
      extravert: {
        name: 'Extravert',
        preference: 'Large group activities',
        optimalGroupSize: '8-15',
        energyDrain: 'Quiet individual activities',
        suggestion: 'Group games and networking events',
      },
      ambivert: {
        name: 'Ambivert',
        preference: 'Flexible social engagement',
        optimalGroupSize: '4-8',
        energyDrain: 'Extreme social or solitary situations',
        suggestion: 'Balanced mix of group and small activities',
      },
    };

    return styleMap[style] || styleMap['ambivert'];
  }

  /**
   * Identify potential risk factors for guest engagement
   */
  identifyRiskFactors(guest) {
    const risks = [];

    if (guest.firstTimeEvent) {
      risks.push({ type: 'FIRST_TIME', severity: 'medium', suggestion: 'Assign buddy or welcome session' });
    }

    if (guest.introverted && guest.likesMixingWithStrangers === false) {
      risks.push({ type: 'SOCIAL_ANXIETY', severity: 'medium', suggestion: 'Provide structured small group activities' });
    }

    if (guest.languageBarrier) {
      risks.push({ type: 'LANGUAGE_BARRIER', severity: 'high', suggestion: 'Provide translator or language-matched groups' });
    }

    return risks;
  }

  // ============== NETWORKING OPPORTUNITIES =============

  /**
   * Suggest networking sessions based on guest interests
   */
  suggestNetworkingOpportunities(guests) {
    const opportunities = [];
    const interestGroups = this.groupGuestsByInterests(guests);

    for (const [interest, groupMembers] of interestGroups) {
      if (groupMembers.length >= 2) {
        opportunities.push({
          id: `network_${interest}`,
          type: 'INTEREST_BASED_NETWORKING',
          interest: interest,
          title: `${interest} Networking Session`,
          description: `Connect with fellow enthusiasts interested in ${interest}`,
          suggestedParticipants: groupMembers.map(g => ({ id: g.id || g._id, name: g.name })),
          participantCount: groupMembers.length,
          duration: '45 minutes',
          format: 'Structured networking with icebreaker activities',
          bestTime: this.findOptimalSessionTime(groupMembers),
          expectedOutcome: `Build professional connections in ${interest}`,
        });
      }
    }

    return opportunities;
  }

  /**
   * Group guests by shared interests
   */
  groupGuestsByInterests(guests) {
    const interestMap = new Map();

    for (const guest of guests) {
      const interests = guest.interests || [];
      for (const interest of interests) {
        if (!interestMap.has(interest)) {
          interestMap.set(interest, []);
        }
        interestMap.get(interest).push(guest);
      }
    }

    return interestMap;
  }

  /**
   * Find optimal session time based on guest preferences
   */
  findOptimalSessionTime(guests) {
    const timeSlots = ['Morning (9-11 AM)', 'Late Morning (11-1 PM)', 'Afternoon (2-4 PM)', 'Early Evening (5-7 PM)'];

    const preferences = timeSlots.map(slot => ({
      slot,
      score: guests.filter(g => g.preferredTimeSlots?.includes(slot)).length,
    }));

    const best = preferences.sort((a, b) => b.score - a.score)[0];
    return best?.slot || 'Afternoon (2-4 PM)';
  }

  // ============== GUEST PAIRING =============

  /**
   * Identify ideal guest pairings for activities
   */
  suggestGuestPairings(guests, activity = 'general') {
    const pairings = [];
    const compatibility = this.calculateGuestCompatibility(guests);

    // Sort by compatibility score
    const sortedPairs = Array.from(compatibility.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.floor(guests.length / 2));

    for (const [pairKey, score] of sortedPairs) {
      const [guest1Id, guest2Id] = pairKey.split('_');
      const guest1 = guests.find(g => (g.id || g._id) === guest1Id);
      const guest2 = guests.find(g => (g.id || g._id) === guest2Id);

      if (guest1 && guest2) {
        pairings.push({
          pairId: pairKey,
          guest1: { id: guest1.id || guest1._id, name: guest1.name },
          guest2: { id: guest2.id || guest2._id, name: guest2.name },
          compatibilityScore: Math.round(score * 100),
          sharedInterests: this.findSharedInterests(guest1, guest2),
          suggestedActivity: this.suggestActivityForPair(guest1, guest2, activity),
          interactionPrediction: this.predictPairInteraction(guest1, guest2),
        });
      }
    }

    return pairings;
  }

  /**
   * Calculate compatibility between all guest pairs
   */
  calculateGuestCompatibility(guests) {
    const compatibility = new Map();

    for (let i = 0; i < guests.length; i++) {
      for (let j = i + 1; j < guests.length; j++) {
        const guest1 = guests[i];
        const guest2 = guests[j];
        const pairKey = `${guest1.id || guest1._id}_${guest2.id || guest2._id}`;

        let score = 0.5;

        // Shared interests boost compatibility
        const sharedInterests = (guest1.interests || []).filter(i =>
          (guest2.interests || []).includes(i)
        );
        score += sharedInterests.length * 0.15;

        // Similar personality types boost compatibility
        if (guest1.personalityType === guest2.personalityType) {
          score += 0.2;
        }

        // Complementary personality types
        if (
          (guest1.personalityType === 'introvert' && guest2.personalityType === 'extravert') ||
          (guest1.personalityType === 'extravert' && guest2.personalityType === 'introvert')
        ) {
          score += 0.15;
        }

        // Professional background match
        if (guest1.professionalIndustry === guest2.professionalIndustry) {
          score += 0.1;
        }

        // Hobbyist interests match
        const sharedHobbies = (guest1.hobbyInterests || []).filter(h =>
          (guest2.hobbyInterests || []).includes(h)
        );
        score += sharedHobbies.length * 0.1;

        compatibility.set(pairKey, Math.min(score, 1));
      }
    }

    return compatibility;
  }

  /**
   * Find shared interests between two guests
   */
  findSharedInterests(guest1, guest2) {
    const interests1 = new Set(guest1.interests || []);
    const interests2 = new Set(guest2.interests || []);
    return Array.from(interests1).filter(i => interests2.has(i));
  }

  /**
   * Suggest activity for a guest pair
   */
  suggestActivityForPair(guest1, guest2, activity) {
    const sharedInterests = this.findSharedInterests(guest1, guest2);

    if (sharedInterests.includes('sports')) return 'Team sports or golf activity';
    if (sharedInterests.includes('travel')) return 'Travel story sharing session';
    if (sharedInterests.includes('technology')) return 'Tech talk or innovation workshop';
    if (sharedInterests.includes('food')) return 'Culinary experience or food tasting';
    if (sharedInterests.includes('arts')) return 'Art gallery tour or creative workshop';

    return 'General networking or dinner conversation';
  }

  /**
   * Predict interaction quality for a pair
   */
  predictPairInteraction(guest1, guest2) {
    const prediction = {
      engagementPotential: 'High',
      conversationStarterTopics: this.findSharedInterests(guest1, guest2),
      potentialChallenges: [],
      icereakerSuggestion: '',
    };

    // Check for potential challenges
    if (guest1.language !== guest2.language && guest1.language !== 'English' && guest2.language !== 'English') {
      prediction.potentialChallenges.push('Language barrier');
    }

    // Suggest icebreaker
    const sharedInterests = this.findSharedInterests(guest1, guest2);
    if (sharedInterests.length > 0) {
      prediction.icereakerSuggestion = `"I noticed we both enjoy ${sharedInterests[0]}! Have you tried...?"`;
    } else {
      prediction.icereakerSuggestion = `"What brings you to this event? Are you looking to meet new people or learn about ${guest1.interests?.[0] || 'the destination'}?"`;
    }

    return prediction;
  }

  // ============== REAL-TIME ENGAGEMENT =============

  /**
   * Analyze real-time guest engagement
   */
  analyzeRealTimeEngagement(guests) {
    const currentEngagementLevel = this.calculateEnergy(guests);
    const participationRate = this.calculateParticipation(guests);
    const momentum = this.calculateTrend(this.currentEventId, currentEngagementLevel);

    const analysis = {
      currentEngagementLevel: currentEngagementLevel,
      participationRate: participationRate,
      engagementTrends: {
        momentum: momentum,
        peakActivityTime: '2-4 PM',
        lowActivityPeriods: ['After lunch (1-2 PM)']
      },
      recommendations: [],
      suggestedScheduleAdjustments: [],
    };

    // Generate recommendations
    if (analysis.currentEngagementLevel < 40) {
      analysis.recommendations.push({
        priority: 'HIGH',
        action: 'Boost engagement with high-energy activity',
        suggestion: 'Switch to team games, icebreakers, or impromptu networking',
      });
    }

    if (analysis.participationRate < 60) {
      analysis.recommendations.push({
        priority: 'MEDIUM',
        action: 'Increase participation',
        suggestion: 'Make current activity more inclusive or switch to optional interest groups',
      });
    }

    return analysis;
  }

  calculateEngagementLevel(eventData) {
    let score = 50;

    if (eventData.activeParticipants) {
      score = (eventData.activeParticipants / eventData.totalGuests) * 100;
    }

    if (eventData.feedbackScore) {
      score = (score + eventData.feedbackScore) / 2;
    }

    return Math.round(score);
  }

  calculateParticipationRate(eventData) {
    if (!eventData.totalGuests || eventData.totalGuests === 0) return 0;
    return Math.round((eventData.activeParticipants / eventData.totalGuests) * 100);
  }

  identifyEngagementTrends(eventData) {
    return {
      momentum: eventData.engagementScore > 70 ? 'Increasing' : eventData.engagementScore < 40 ? 'Decreasing' : 'Stable',
      peakActivityTime: eventData.peakActivityTime || '2-4 PM',
      lowActivityPeriods: eventData.lowActivityPeriods || ['After lunch (1-2 PM)'],
    };
  }

  // ============== EMOTIONAL INTELLIGENCE =============

  /**
   * Predict guest emotional states and suggest optimal activities
   */
  predictGuestEmotionalStates(guests) {
    const emotionalProfiles = [];

    for (const guest of guests) {
      const profile = {
        guestId: guest.id || guest._id,
        guestName: guest.name,
        predictedEmotionalState: this.analyzeEmotionalState(guest),
        recommendedActivityType: this.suggestActivityByEmotionalState(guest),
        wellnessRecommendations: this.generateWellnessRecommendations(guest),
      };

      emotionalProfiles.push(profile);
    }

    return emotionalProfiles;
  }

  /**
   * Analyze emotional state from guest profile
   */
  analyzeEmotionalState(guest) {
    let dominantEmotion = guest.emotionalState || 'neutral';
    const emotionalIndicators = {};

    // Analyze social media activity
    if (guest.recentSocialActivity) {
      const activitySentiment = this.analyzeSocialMediaSentiment(guest.recentSocialActivity);
      emotionalIndicators['social_engagement'] = activitySentiment;
    }

    // Check app feedback if any
    if (guest.appFeedbackHistory && guest.appFeedbackHistory.length > 0) {
      const recentFeedback = guest.appFeedbackHistory[guest.appFeedbackHistory.length - 1];
      emotionalIndicators['app_feedback'] = recentFeedback;
    }

    // Override based on energy/stress levels
    if (guest.energyLevel === 'low') {
      dominantEmotion = 'tired';
    } else if (guest.engagementScore > 80) {
      dominantEmotion = 'excited';
    } else if (guest.engagementScore < 30) {
      dominantEmotion = 'disengaged';
    }

    return {
      state: dominantEmotion,
      confidence: Math.min(0.5 + (guest.appFeedbackHistory?.length || 0) * 0.1, 1),
      indicators: emotionalIndicators,
      energyLevel: guest.energyLevel || 'moderate',
      stressLevel: guest.stressLevel || 'normal',
    };
  }

  /**
   * Analyze sentiment from social media activity
   */
  analyzeSocialMediaSentiment(activity) {
    if (!activity) return 'neutral';

    const positiveKeywords = ['exciting', 'amazing', 'love', 'great', 'wonderful', 'fantastic'];
    const negativeKeywords = ['boring', 'tired', 'stressed', 'disappointed', 'frustrated'];

    const activityLower = activity.toLowerCase();
    const positiveMatches = positiveKeywords.filter(k => activityLower.includes(k)).length;
    const negativeMatches = negativeKeywords.filter(k => activityLower.includes(k)).length;

    if (positiveMatches > negativeMatches) return 'positive';
    if (negativeMatches > positiveMatches) return 'negative';
    return 'neutral';
  }

  /**
   * Suggest activity based on emotional state
   */
  suggestActivityByEmotionalState(guest) {
    const state = guest.emotionalState || guest.predictedEmotionalState?.state || 'neutral';

    const activityMap = {
      excited: {
        type: 'High-Energy Activities',
        suggestions: ['Team sports', 'Group games', 'Dance or music events', 'Adventure activities'],
        duration: '60+ minutes',
      },
      happy: {
        type: 'Balanced Activities',
        suggestions: ['Networking sessions', 'Workshops', 'Cultural events'],
        duration: '45-60 minutes',
      },
      neutral: {
        type: 'Balanced Activities',
        suggestions: ['Networking sessions', 'Skill-building workshops', 'Cultural events', 'Casual networking'],
        duration: '45-60 minutes',
      },
      tired: {
        type: 'Relaxing Activities',
        suggestions: ['Spa/wellness session', 'Meditation break', 'Scenic walk', 'Casual conversation'],
        duration: '30-45 minutes',
      },
      disengaged: {
        type: 'Re-engagement Activities',
        suggestions: ['Interest-based small group', 'One-on-one mentoring', 'Personalized consulting', 'VIP experience'],
        duration: '30-45 minutes',
      },
      stressed: {
        type: 'Stress Relief Activities',
        suggestions: ['Mindfulness session', 'Quiet break', 'Wellness activities'],
        duration: '20-30 minutes',
      },
    };

    return activityMap[state] || activityMap['neutral'];
  }

  /**
   * Generate personalized wellness recommendations
   */
  generateWellnessRecommendations(guest) {
    const recommendations = [];

    if (guest.stressLevel === 'high') {
      recommendations.push({
        type: 'STRESS_MANAGEMENT',
        suggestion: 'Mindfulness session or quiet break',
        duration: '15 minutes',
        priority: 'HIGH',
      });
    }

    if (guest.energyLevel === 'low') {
      recommendations.push({
        type: 'ENERGY_BOOST',
        suggestion: 'Light snack and refreshment break',
        duration: '10 minutes',
        priority: 'HIGH',
      });
    }

    if (guest.socialExhaustion) {
      recommendations.push({
        type: 'SOCIAL_RECOVERY',
        suggestion: 'Quiet time or one-on-one conversation',
        duration: '20 minutes',
        priority: 'MEDIUM',
      });
    }

    return recommendations;
  }

  // ============== SENTIMENT ANALYSIS =============

  /**
   * Track and analyze sentiment from guest feedback
   */
  trackSentiment(feedback) {
    const sentimentEntry = {
      timestamp: new Date(),
      guestId: feedback.guestId,
      sentiment: this.analyzeSentiment(feedback.text),
      score: feedback.rating || 0,
      topic: feedback.topic || 'general',
      rawFeedback: feedback.text,
    };

    this.sentimentHistory.push(sentimentEntry);
    return sentimentEntry;
  }

  /**
   * Analyze sentiment from text feedback
   */
  analyzeSentiment(text) {
    if (!text) return 'neutral';

    const positiveWords = ['great', 'wonderful', 'amazing', 'loved', 'excellent', 'fantastic', 'awesome'];
    const negativeWords = ['terrible', 'bad', 'poor', 'disappointing', 'awful', 'hate', 'boring'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Get sentiment trends over time
   */
  getSentimentTrends(timeWindowMinutes = 60) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowMinutes * 60000);

    const recentFeedback = this.sentimentHistory.filter(
      entry => new Date(entry.timestamp) > windowStart
    );

    const sentimentCounts = {
      positive: recentFeedback.filter(f => f.sentiment === 'positive').length,
      neutral: recentFeedback.filter(f => f.sentiment === 'neutral').length,
      negative: recentFeedback.filter(f => f.sentiment === 'negative').length,
    };

    return {
      timeWindow: `Last ${timeWindowMinutes} minutes`,
      totalFeedback: recentFeedback.length,
      sentiments: sentimentCounts,
      trend: this.determineTrend(sentimentCounts),
      actionRequired: sentimentCounts.negative > sentimentCounts.positive,
    };
  }

  /**
   * Determine overall sentiment trend
   */
  determineTrend(sentimentCounts) {
    const total = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
    if (total === 0) return 'insufficient_data';

    const positiveRatio = sentimentCounts.positive / total;
    if (positiveRatio > 0.6) return 'very_positive';
    if (positiveRatio > 0.4) return 'positive';
    if (positiveRatio < 0.2) return 'negative';
    return 'neutral';
  }

  // ============== HELPER METHODS =============

  analyzePersonalityTrait(guest) {
    const type = guest.personalityType || 'ambivert';
    const traits = {
      introvert: 'Reserved, prefers small groups',
      extravert: 'Outgoing, enjoys large groups',
      ambivert: 'Balanced, flexible social style',
    };
    return traits[type] || traits['ambivert'];
  }

  // ============== COMBINED LOAD METHOD =============

  /**
   * Load all AI predictions - tries backend first, falls back to local
   */
  async loadAllPredictions(eventId, guests = []) {
    // Try to fetch from backend
    if (this.isUsingBackend && eventId) {
      const backendData = await this.fetchPredictionsFromBackend(eventId);
      if (backendData) {
        return backendData;
      }
    }

    // Fallback to local calculation with provided guests
    return {
      interactions: this.predictGuestInteractions(guests),
      networking: this.suggestNetworkingOpportunities(guests),
      pairings: this.suggestGuestPairings(guests),
      emotionalStates: this.predictGuestEmotionalStates(guests),
      sentimentTrends: this.getSentimentTrends(),
      realTimeAnalysis: this.analyzeRealTimeEngagement(guests),
    };
  }
}

export default new AISocialIntelligenceService();

