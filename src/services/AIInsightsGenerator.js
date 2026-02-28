/**
 * AIInsightsGenerator
 * 
 * Generates intelligent, contextual insight statements that appear on the dashboard.
 * 
 * These "AI Insight" blocks make the system feel intelligent and forward-thinking.
 * They combine multiple data points to suggest actions, not just report facts.
 * 
 * Examples:
 * - "Engagement rising among guests with shared dietary preferences. Recommend group dinner table clustering."
 * - "3 guests showing drop-off risk during networking phase. Immediate intervention suggested."
 */

class AIInsightsGenerator {
  /**
   * Generate insights based on current event state
   */
  generateInsights(guests, currentPhase, eventHealth, networkingOps, atRiskGuests) {
    const insights = [];

    // 1. Engagement pattern insights
    const engagementInsight = this.generateEngagementInsight(guests, currentPhase);
    if (engagementInsight) insights.push(engagementInsight);

    // 2. Networking insights
    const networkingInsight = this.generateNetworkingInsight(guests, networkingOps, currentPhase);
    if (networkingInsight) insights.push(networkingInsight);

    // 3. Risk insights
    const riskInsight = this.generateRiskInsight(atRiskGuests, currentPhase);
    if (riskInsight) insights.push(riskInsight);

    // 4. Sentiment insights
    const sentimentInsight = this.generateSentimentInsight(guests, currentPhase);
    if (sentimentInsight) insights.push(sentimentInsight);

    // 5. Phase-specific insights
    const phaseInsight = this.generatePhaseInsight(guests, currentPhase, eventHealth);
    if (phaseInsight) insights.push(phaseInsight);

    // 6. Trend prediction insight
    const predictionInsight = this.generatePredictionInsight(guests, eventHealth);
    if (predictionInsight) insights.push(predictionInsight);

    // Sort by priority and return top 3
    return insights
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
      .slice(0, 3);
  }

  /**
   * Generate engagement pattern insights
   */
  generateEngagementInsight(guests, currentPhase) {
    const avgEngagement = guests.reduce((sum, g) => sum + this.getEngagement(g), 0) / guests.length;
    
    // Find high-engagement clusters
    const highEngagementGuests = guests.filter(g => this.getEngagement(g) > 70);
    const sharedDietaryCluster = this.findSharedFactorCluster(highEngagementGuests, 'dietaryRequirements');

    if (sharedDietaryCluster.length >= 2) {
      return {
        type: 'opportunity',
        priority: 'high',
        icon: '📈',
        title: 'Engagement Clustering Detected',
        text: `High engagement among ${sharedDietaryCluster.length} guests with shared dietary preferences. Recommend group dinner table clustering to amplify social energy.`,
        action: 'Arrange group seating'
      };
    }

    // Check for rising engagement trend
    const risingGuests = guests.filter(g => {
      if (!g.engagementHistory || g.engagementHistory.length < 2) return false;
      const recent = g.engagementHistory.slice(-3);
      return recent[recent.length - 1] > recent[0] + 10;
    });

    if (risingGuests.length >= 3 && currentPhase === 'networking') {
      return {
        type: 'positive',
        priority: 'medium',
        icon: '🚀',
        title: 'Engagement Surge',
        text: `${risingGuests.length} guests showing rising engagement during networking phase. Strike while momentum is high—introduce group activity.`,
        action: 'Launch group challenge'
      };
    }

    // Low engagement warning
    if (avgEngagement < 40 && guests.length > 5) {
      return {
        type: 'warning',
        priority: 'high',
        icon: '⚠️',
        title: 'Low Overall Engagement',
        text: `Event health at ${Math.round(avgEngagement)}%. Energy is below optimal. Consider energizer activity or check-in with quiet guests.`,
        action: 'Deploy energizer'
      };
    }

    return null;
  }

  /**
   * Generate networking insights
   */
  generateNetworkingInsight(guests, opportunities, currentPhase) {
    if (!opportunities || opportunities.length === 0) return null;

    const highCompatOps = opportunities.filter(o => o.compatibilityScore > 75);
    
    if (highCompatOps.length >= 2 && currentPhase === 'networking') {
      return {
        type: 'opportunity',
        priority: 'high',
        icon: '🤝',
        title: 'High-Compatibility Matches Ready',
        text: `${highCompatOps.length} high-compatibility networking opportunities identified. Introduce these pairs now while networking energy is peak.`,
        action: 'Make introductions'
      };
    }

    // Check for dietary-based opportunities
    const dietaryOps = opportunities.filter(o => 
      o.sharedFactors.some(f => f.includes('dietary'))
    );

    if (dietaryOps.length >= 2 && currentPhase === 'dinner') {
      return {
        type: 'opportunity',
        priority: 'medium',
        icon: '🍽️',
        title: 'Dietary Preference Alignment',
        text: `${dietaryOps.length} guests share dietary requirements. Seat them together to create natural conversation and inclusive dining experience.`,
        action: 'Arrange seating'
      };
    }

    // Accessibility support opportunities
    const accessibilityOps = opportunities.filter(o => 
      o.sharedFactors.some(f => f.includes('accessibility'))
    );

    if (accessibilityOps.length >= 1) {
      return {
        type: 'insight',
        priority: 'medium',
        icon: '♿',
        title: 'Supportive Connections Available',
        text: `${accessibilityOps.length} potential peer-support connections identified. Guests with similar needs may benefit from mutual assistance.`,
        action: 'Facilitate connection'
      };
    }

    return null;
  }

  /**
   * Generate risk insights
   */
  generateRiskInsight(atRiskGuests, currentPhase) {
    if (!atRiskGuests || atRiskGuests.length === 0) return null;

    const highRiskCount = atRiskGuests.filter(g => g.riskLevel === 'high').length;
    
    if (highRiskCount >= 3) {
      return {
        type: 'alert',
        priority: 'critical',
        icon: '🚨',
        title: 'Multiple Drop-Off Risks Detected',
        text: `${highRiskCount} guests showing high drop-off risk. Immediate intervention recommended to prevent cascading disengagement.`,
        action: 'Staff intervention'
      };
    }

    // Isolated guests during networking
    const isolatedNetworking = atRiskGuests.filter(g => 
      g.riskFlags.some(f => f.type === 'isolated')
    );

    if (isolatedNetworking.length >= 2 && currentPhase === 'networking') {
      return {
        type: 'warning',
        priority: 'high',
        icon: '⚡',
        title: 'Isolation During Peak Social',
        text: `${isolatedNetworking.length} guests remain unconnected during networking phase. Quick introductions could unlock participation.`,
        action: 'Facilitate intros'
      };
    }

    // Negative sentiment cluster
    const negativeSentiment = atRiskGuests.filter(g => g.sentimentScore < -20);
    if (negativeSentiment.length >= 2) {
      return {
        type: 'alert',
        priority: 'high',
        icon: '💢',
        title: 'Negative Sentiment Cluster',
        text: `${negativeSentiment.length} guests expressing negative sentiment. Risk of mood contagion—address concerns before spread.`,
        action: 'Address concerns'
      };
    }

    if (highRiskCount > 0) {
      return {
        type: 'warning',
        priority: 'medium',
        icon: '⚠️',
        title: 'Guest Attention Needed',
        text: `${highRiskCount} guest${highRiskCount > 1 ? 's' : ''} at risk. Proactive check-in recommended.`,
        action: 'Check in'
      };
    }

    return null;
  }

  /**
   * Generate sentiment insights
   */
  generateSentimentInsight(guests, currentPhase) {
    const guestsWithFeedback = guests.filter(g => g.feedback && g.feedback.length > 0);
    
    if (guestsWithFeedback.length < 2) return null;

    const avgSentiment = guestsWithFeedback.reduce((sum, g) => sum + (g.sentimentScore || 0), 0) / guestsWithFeedback.length;

    // Context-aware sentiment analysis
    if (avgSentiment < -20 && currentPhase === 'dinner') {
      return {
        type: 'alert',
        priority: 'critical',
        icon: '🍽️',
        title: 'Catering Dissatisfaction Risk',
        text: 'Negative feedback during dinner phase suggests catering issues. Immediate quality check recommended before sentiment spreads.',
        action: 'Check catering'
      };
    }

    if (avgSentiment > 40 && currentPhase === 'networking') {
      return {
        type: 'positive',
        priority: 'medium',
        icon: '✨',
        title: 'High Satisfaction During Peak',
        text: 'Strong positive sentiment during networking phase. Capture this energy with photo opportunities or testimonials.',
        action: 'Capture moment'
      };
    }

    // Energy mismatch detection
    const highEnergyNegativeSentiment = guests.filter(g => 
      this.getEngagement(g) > 60 && g.sentimentScore < -10
    );

    if (highEnergyNegativeSentiment.length >= 2) {
      return {
        type: 'warning',
        priority: 'high',
        icon: '🎭',
        title: 'Active But Dissatisfied',
        text: `${highEnergyNegativeSentiment.length} guests are engaged but expressing frustration. Address concerns before energy turns negative.`,
        action: 'Investigate issues'
      };
    }

    return null;
  }

  /**
   * Generate phase-specific insights
   */
  generatePhaseInsight(guests, currentPhase, eventHealth) {
    const phaseInsights = {
      arrival: () => {
        const checkedIn = guests.filter(g => g.checkIns > 0).length;
        const percentage = Math.round((checkedIn / guests.length) * 100);
        
        if (percentage < 50 && guests.length > 5) {
          return {
            type: 'warning',
            priority: 'medium',
            icon: '👋',
            title: 'Slow Arrival Rate',
            text: `Only ${percentage}% of guests have checked in. Consider extending arrival window or sending reminders.`,
            action: 'Send reminders'
          };
        }
        return null;
      },
      
      networking: () => {
        const connectedGuests = guests.filter(g => 
          Object.values(g.connections || {}).length > 0
        ).length;
        const connectionRate = Math.round((connectedGuests / guests.length) * 100);

        if (connectionRate > 60) {
          return {
            type: 'positive',
            priority: 'medium',
            icon: '🕸️',
            title: 'Network Effect Activated',
            text: `${connectionRate}% of guests have formed connections. Engagement contagion is accelerating event energy.`,
            action: 'Amplify momentum'
          };
        }
        return null;
      },
      
      dinner: () => {
        if (eventHealth > 70) {
          return {
            type: 'positive',
            priority: 'low',
            icon: '🍽️',
            title: 'Strong Pre-Dinner Energy',
            text: 'High engagement leading into dinner creates optimal conditions for meaningful table conversations.',
            action: 'Encourage dialogue'
          };
        }
        return null;
      },
      
      winddown: () => {
        const stillActive = guests.filter(g => this.getEngagement(g) > 50).length;
        
        if (stillActive > guests.length * 0.6) {
          return {
            type: 'insight',
            priority: 'low',
            icon: '🌙',
            title: 'Extended Engagement',
            text: `${Math.round((stillActive / guests.length) * 100)}% of guests remain engaged during winddown. Event exceeded typical energy curve.`,
            action: 'Note success'
          };
        }
        return null;
      }
    };

    return phaseInsights[currentPhase]?.() || null;
  }

  /**
   * Generate prediction insights
   */
  generatePredictionInsight(guests, eventHealth) {
    // Calculate trend
    const guestsWithHistory = guests.filter(g => g.engagementHistory && g.engagementHistory.length >= 3);
    
    if (guestsWithHistory.length < 3) return null;

    const trends = guestsWithHistory.map(g => {
      const recent = g.engagementHistory.slice(-3);
      return recent[2] - recent[0];
    });

    const avgTrend = trends.reduce((a, b) => a + b, 0) / trends.length;

    if (avgTrend > 10) {
      const predictedHealth = Math.min(100, Math.round(eventHealth + avgTrend * 0.5));
      return {
        type: 'prediction',
        priority: 'medium',
        icon: '🔮',
        title: 'Positive Trajectory Predicted',
        text: `AI predicts event health will reach ${predictedHealth}% in 20 minutes if current momentum continues. Maintain current approach.`,
        action: 'Stay course'
      };
    }

    if (avgTrend < -10) {
      const predictedHealth = Math.max(0, Math.round(eventHealth + avgTrend * 0.5));
      return {
        type: 'warning',
        priority: 'high',
        icon: '⚠️',
        title: 'Engagement Decline Predicted',
        text: `Trend analysis suggests event health may drop to ${predictedHealth}% without intervention. Consider energizer activity.`,
        action: 'Intervene now'
      };
    }

    return null;
  }

  /**
   * Helper: Get engagement score for guest
   */
  getEngagement(guest) {
    return guest.dynamicScore || 50;
  }

  /**
   * Helper: Find cluster of guests sharing a factor
   */
  findSharedFactorCluster(guests, factorKey) {
    const factorGroups = {};
    
    guests.forEach(guest => {
      const factors = guest[factorKey] || [];
      factors.forEach(factor => {
        if (!factorGroups[factor]) factorGroups[factor] = [];
        factorGroups[factor].push(guest);
      });
    });

    // Return the largest group
    const groups = Object.values(factorGroups);
    return groups.length > 0 ? groups.sort((a, b) => b.length - a.length)[0] : [];
  }

  /**
   * Helper: Get priority weight for sorting
   */
  getPriorityWeight(priority) {
    const weights = { critical: 4, high: 3, medium: 2, low: 1 };
    return weights[priority] || 0;
  }
}

export default new AIInsightsGenerator();
