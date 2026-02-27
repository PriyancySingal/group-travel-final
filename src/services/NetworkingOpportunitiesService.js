/**
 * NetworkingOpportunitiesService
 * 
 * Generates real-time networking opportunities based on live guest behavior.
 * 
 * Logic:
 * - If engagement difference < 15 AND shared interests > 0 AND not yet connected
 * - Then suggest networking opportunity
 * 
 * Uses shared dietary, special needs, engagement similarity to create
 * truly dynamic recommendations that evolve as the event progresses.
 */

class NetworkingOpportunitiesService {
  /**
   * Generate networking opportunities from current guest state
   */
  generateOpportunities(guests, currentPhase) {
    const opportunities = [];
    const suggestions = [];

    // Compare every pair of guests
    for (let i = 0; i < guests.length; i++) {
      for (let j = i + 1; j < guests.length; j++) {
        const a = guests[i];
        const b = guests[j];

        const opportunity = this.evaluatePair(a, b, currentPhase);
        
        if (opportunity) {
          suggestions.push(opportunity);
        }
      }
    }

    // Sort by compatibility score and take top 5
    suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Group related suggestions into session opportunities
    const topSuggestions = suggestions.slice(0, 8);
    
    // Create networking opportunities from top pairs
    topSuggestions.forEach((suggestion, idx) => {
      opportunities.push({
        id: `network-${idx}-${Date.now()}`,
        title: this.generateTitle(suggestion),
        description: suggestion.reason,
        participants: [suggestion.guestA, suggestion.guestB],
        compatibilityScore: suggestion.compatibilityScore,
        sharedFactors: suggestion.sharedFactors,
        format: this.determineFormat(suggestion),
        bestTime: this.determineBestTime(currentPhase),
        duration: "15-20 min",
        icebreaker: this.generateIcebreaker(suggestion),
        urgency: suggestion.urgency || 'normal'
      });
    });

    return opportunities.slice(0, 5);
  }

  /**
   * Evaluate a pair of guests for networking potential
   */
  evaluatePair(guestA, guestB, currentPhase) {
    const sharedFactors = [];
    let compatibilityScore = 0;

    // Factor 1: Engagement similarity (max 25 points)
    const engagementA = this.calculateEngagement(guestA);
    const engagementB = this.calculateEngagement(guestB);
    const engagementGap = Math.abs(engagementA - engagementB);
    
    if (engagementGap < 15) {
      compatibilityScore += 25;
      sharedFactors.push("Similar engagement level");
    } else if (engagementGap < 30) {
      compatibilityScore += 15;
      sharedFactors.push("Compatible energy levels");
    }

    // Factor 2: Shared dietary requirements (max 20 points)
    if (guestA.dietaryRequirements && guestB.dietaryRequirements) {
      const sharedDiet = guestA.dietaryRequirements.filter(d => 
        guestB.dietaryRequirements.includes(d)
      );
      if (sharedDiet.length > 0) {
        compatibilityScore += 20;
        sharedFactors.push(`Shared dietary: ${sharedDiet.join(', ')}`);
      }
    }

    // Factor 3: Shared special needs (max 20 points)
    if (guestA.specialNeeds && guestB.specialNeeds) {
      const sharedNeeds = guestA.specialNeeds.filter(n => 
        guestB.specialNeeds.includes(n)
      );
      if (sharedNeeds.length > 0) {
        compatibilityScore += 20;
        sharedFactors.push("Common accessibility needs");
      }
    }

    // Factor 4: Complementary personality traits (max 15 points)
    if (guestA.personality && guestB.personality) {
      const complementaryPairs = [
        ['extrovert', 'ambivert'],
        ['introvert', 'ambivert'],
        ['planner', 'spontaneous']
      ];
      
      const isComplementary = complementaryPairs.some(
        pair => pair.includes(guestA.personality) && pair.includes(guestB.personality)
      );
      
      if (isComplementary) {
        compatibilityScore += 15;
        sharedFactors.push("Complementary personalities");
      }
    }

    // Factor 5: No existing connection (required for new opportunities)
    const existingConnection = (guestA.connections?.[guestB.id] || 0) > 0;
    if (existingConnection) {
      compatibilityScore -= 30; // Penalize existing connections
    } else {
      sharedFactors.push("New connection opportunity");
    }

    // Factor 6: Both guests have some engagement (min threshold)
    if (engagementA < 15 || engagementB < 15) {
      return null; // Skip if either guest is completely disengaged
    }

    // Minimum threshold for suggestion
    if (compatibilityScore < 40) {
      return null;
    }

    // Determine urgency based on phase and engagement
    let urgency = 'normal';
    if (currentPhase === 'networking' && engagementGap < 10) {
      urgency = 'high';
    }
    if (engagementA > 60 && engagementB > 60) {
      urgency = 'high'; // High-energy guests should connect
    }

    return {
      guestA,
      guestB,
      compatibilityScore: Math.min(100, compatibilityScore),
      sharedFactors,
      reason: this.generateReason(sharedFactors, guestA, guestB),
      engagementGap,
      urgency
    };
  }

  /**
   * Calculate engagement for a guest
   */
  calculateEngagement(guest) {
    let score = 30;
    score += (guest.activitiesJoined?.length || 0) * 10;
    score += (guest.messagesSent || 0) * 3;
    score += (guest.checkIns || 0) * 5;
    
    const connectionCount = Object.values(guest.connections || {}).reduce(
      (a, b) => a + b, 0
    );
    score += connectionCount * 2;

    const hoursIdle = (Date.now() - new Date(guest.lastInteractionAt || Date.now())) / 3600000;
    if (hoursIdle < 1) score += 8;
    if (hoursIdle > 5) score -= 10;

    if (guest.sentimentScore > 30) score += 10;
    if (guest.sentimentScore < -30) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate a title for the opportunity
   */
  generateTitle(suggestion) {
    const { guestA, guestB, sharedFactors } = suggestion;
    
    if (sharedFactors.some(f => f.includes('dietary'))) {
      return `Dinner Table Connection: ${guestA.name} & ${guestB.name}`;
    }
    
    if (sharedFactors.some(f => f.includes('accessibility'))) {
      return `Supportive Connection: ${guestA.name} & ${guestB.name}`;
    }
    
    if (suggestion.compatibilityScore > 80) {
      return `High-Potential Match: ${guestA.name} & ${guestB.name}`;
    }
    
    return `Networking Opportunity: ${guestA.name} & ${guestB.name}`;
  }

  /**
   * Generate human-readable reason
   */
  generateReason(sharedFactors, guestA, guestB) {
    const factors = sharedFactors.filter(f => 
      !f.includes('New connection') && !f.includes('Similar engagement')
    );
    
    if (factors.length > 0) {
      return `${guestA.name} and ${guestB.name} have ${factors[0].toLowerCase()}. Their energy levels are aligned for meaningful conversation.`;
    }
    
    return `${guestA.name} and ${guestB.name} show similar engagement patterns. They would benefit from meeting during this phase.`;
  }

  /**
   * Determine best format for this opportunity
   */
  determineFormat(suggestion) {
    const score = suggestion.compatibilityScore;
    
    if (score > 80) return "One-on-one introduction";
    if (score > 60) return "Small group mixer";
    return "Casual introduction";
  }

  /**
   * Determine best time based on phase
   */
  determineBestTime(currentPhase) {
    const times = {
      arrival: "After check-in",
      networking: "Now - peak social time",
      dinner: "During meal service",
      winddown: "Before closing"
    };
    return times[currentPhase] || "Next available moment";
  }

  /**
   * Generate contextual icebreaker
   */
  generateIcebreaker(suggestion) {
    const { guestA, guestB, sharedFactors } = suggestion;
    
    if (sharedFactors.some(f => f.includes('dietary'))) {
      return `Ask about their favorite ${guestA.dietaryRequirements?.[0] || 'cuisine'} restaurants`;
    }
    
    if (sharedFactors.some(f => f.includes('personality'))) {
      return `Discuss how you both approach planning events`;
    }
    
    return `Ask about their experience at the event so far`;
  }

  /**
   * Get networking statistics
   */
  getStats(opportunities) {
    if (opportunities.length === 0) {
      return {
        totalOpportunities: 0,
        highCompatibility: 0,
        averageScore: 0,
        dietaryMatches: 0,
        accessibilityMatches: 0
      };
    }

    const highCompatibility = opportunities.filter(o => o.compatibilityScore > 70).length;
    const dietaryMatches = opportunities.filter(o => 
      o.sharedFactors.some(f => f.includes('dietary'))
    ).length;
    const accessibilityMatches = opportunities.filter(o => 
      o.sharedFactors.some(f => f.includes('accessibility'))
    ).length;

    return {
      totalOpportunities: opportunities.length,
      highCompatibility,
      averageScore: Math.round(
        opportunities.reduce((sum, o) => sum + o.compatibilityScore, 0) / opportunities.length
      ),
      dietaryMatches,
      accessibilityMatches
    };
  }
}

export default new NetworkingOpportunitiesService();
