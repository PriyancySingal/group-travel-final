import Guest from '../models/Guest.js';
import interactionEngine from './interactionEngine.js';

// ==========================================
// INTELLIGENT NETWORKING ENGINE
// Based on 4 signals: Complementarity, Context, Momentum, History
// ==========================================

/**
 * Calculate networking opportunity score between two guests
 * Formula:
 *   networkScore =
 *     sharedScore * 0.4 +
 *     (100 - engagementGap) * 0.3 +
 *     (noPriorInteraction ? 20 : 0) +
 *     influenceBoost
 */
export const calculateNetworkingScore = (guestA, guestB, interactionHistory) => {
  // 1️⃣ SHARED CONTEXT SCORE (dietary, special needs, interests, goals)
  let sharedScore = 0;
  
  // Dietary overlap
  const dietA = guestA.dietaryRequirements || [];
  const dietB = guestB.dietaryRequirements || [];
  const sharedDiet = dietA.filter(d => dietB.includes(d)).length;
  sharedScore += sharedDiet * 10;
  
  // Special needs compatibility
  const needsA = guestA.specialNeeds || [];
  const needsB = guestB.specialNeeds || [];
  const sharedNeeds = needsA.filter(n => needsB.includes(n)).length;
  sharedScore += sharedNeeds * 8;
  
  // Interests overlap
  const interestsA = guestA.interests || [];
  const interestsB = guestB.interests || [];
  const sharedInterests = interestsA.filter(i => interestsB.includes(i));
  sharedScore += sharedInterests.length * 12;
  
  // Goals alignment
  const goalsA = guestA.goals || [];
  const goalsB = guestB.goals || [];
  const sharedGoals = goalsA.filter(g => goalsB.includes(g));
  sharedScore += sharedGoals.length * 10;
  
  // 2️⃣ COMPLEMENTARITY (engagement gap)
  const scoreA = guestA.engagementScore || 30;
  const scoreB = guestB.engagementScore || 30;
  const engagementGap = Math.abs(scoreA - scoreB);
  const complementarityScore = Math.max(0, 100 - engagementGap);
  
  // Special case: High engagement + Low connection = strategic pairing
  let influenceBoost = 0;
  const graph = interactionEngine.getEventSocialGraph(guestA.eventId?.toString());
  if (graph) {
    const connectionsA = graph.has(guestA._id?.toString()) ? graph.get(guestA._id.toString()).size : 0;
    const connectionsB = graph.has(guestB._id?.toString()) ? graph.get(guestB._id.toString()).size : 0;
    
    // If one is high influence (many connections) and other is isolated
    const totalGuests = graph.size;
    if ((connectionsA > totalGuests * 0.3 && connectionsB === 0) ||
        (connectionsB > totalGuests * 0.3 && connectionsA === 0)) {
      influenceBoost = 15;
    }
  }
  
  // 3️⃣ INTERACTION HISTORY FILTER
  const g1Id = guestA._id?.toString();
  const g2Id = guestB._id?.toString();
  const priorInteractions = interactionHistory || [];
  const interactionCount = priorInteractions.filter(
    i => (i.guestId === g1Id && i.targetGuestId === g2Id) ||
         (i.guestId === g2Id && i.targetGuestId === g1Id)
  ).length;
  
  const noPriorBoost = interactionCount === 0 ? 20 : 0;
  
  // 4️⃣ ENGAGEMENT MOMENTUM MATCHING
  const trendA = guestA.engagementTrend || 'stable';
  const trendB = guestB.engagementTrend || 'stable';
  let momentumBoost = 0;
  
  // Both rising → great for group session
  if (trendA === 'rising' && trendB === 'rising') {
    momentumBoost = 10;
  }
  // One falling, one stable → rescue pairing
  else if ((trendA === 'falling' && trendB === 'stable') ||
           (trendB === 'falling' && trendA === 'stable')) {
    momentumBoost = 8;
  }
  
  // Final score calculation
  const networkScore = 
    (sharedScore * 0.4) +
    (complementarityScore * 0.3) +
    noPriorBoost +
    influenceBoost +
    momentumBoost;
  
  // Normalize to 0-100
  const normalizedScore = Math.min(100, Math.round(networkScore));
  
  // Build reason string
  const reasons = [];
  if (sharedDiet > 0) reasons.push(`${sharedDiet} shared dietary preference${sharedDiet > 1 ? 's' : ''}`);
  if (sharedInterests.length > 0) reasons.push(`Interested in: ${sharedInterests.slice(0, 2).join(', ')}`);
  if (sharedGoals.length > 0) reasons.push(`Both seeking: ${sharedGoals[0]}`);
  if (influenceBoost > 0) reasons.push('Strategic: Connector ↔ Isolated guest');
  if (trendA === 'rising' && trendB === 'rising') reasons.push('Both showing rising engagement');
  if (interactionCount === 0) reasons.push('No prior interaction (fresh connection)');
  
  return {
    score: normalizedScore,
    reasons: reasons.length > 0 ? reasons : ['Complementary personalities'],
    sharedInterests: sharedInterests.slice(0, 3),
    engagementGap,
    interactionCount,
    isStrategic: influenceBoost > 0
  };
};

/**
 * Get recommended networking format based on guest profiles
 */
const getRecommendedFormat = (guestA, guestB, score) => {
  const p1 = guestA.personalityType || 'ambivert';
  const p2 = guestB.personalityType || 'ambivert';
  
  // Both introverts → quiet setting
  if (p1 === 'introvert' && p2 === 'introvert') {
    return {
      format: 'One-on-one quiet conversation',
      duration: '15-20 minutes',
      location: 'Private lounge or quiet corner',
      setting: 'Low noise, comfortable seating'
    };
  }
  
  // Both extraverts → energetic
  if (p1 === 'extravert' && p2 === 'extravert') {
    return {
      format: 'High-energy networking activity',
      duration: '30-45 minutes',
      location: 'Main networking area or activity space',
      setting: 'Group-friendly, interactive'
    };
  }
  
  // Mixed → balanced
  if ((p1 === 'introvert' && p2 === 'extravert') ||
      (p1 === 'extravert' && p2 === 'introvert')) {
    return {
      format: 'Curated small group table',
      duration: '20-30 minutes',
      location: 'Semi-private seating area',
      setting: 'Moderate energy, facilitator optional'
    };
  }
  
  // Default for ambivert
  return {
    format: 'Casual networking conversation',
    duration: '20 minutes',
    location: 'Networking lounge',
    setting: 'Relaxed, open-ended'
  };
};

/**
 * Get networking opportunities for an event
 */
export const getNetworkingOpportunities = async (eventId) => {
  // Get all guests for this event
  const guests = await Guest.find({ eventId });
  
  if (guests.length < 2) {
    return { opportunities: [], clusters: [], stats: { total: 0 } };
  }
  
  // Get interaction history for this event
  const interactionHistory = interactionEngine.getEventInteractionsList(eventId, { limit: 1000 });
  
  // Calculate scores for all pairs
  const opportunities = [];
  
  for (let i = 0; i < guests.length; i++) {
    for (let j = i + 1; j < guests.length; j++) {
      const guestA = guests[i];
      const guestB = guests[j];
      
      // Skip if either is unavailable
      if (guestA.status === 'unavailable' || guestB.status === 'unavailable') continue;
      
      // Skip if different locations (unless high compatibility)
      if (guestA.currentLocation !== guestB.currentLocation) {
        // Still consider if very high potential compatibility
        const quickScore = calculateNetworkingScore(guestA, guestB, interactionHistory);
        if (quickScore.score < 70) continue;
      }
      
      const result = calculateNetworkingScore(guestA, guestB, interactionHistory);
      
      // Only include if score is decent
      if (result.score >= 50) {
        const format = getRecommendedFormat(guestA, guestB, result.score);
        
        opportunities.push({
          id: `opp_${guestA._id}_${guestB._id}`,
          guest1: {
            id: guestA._id,
            name: guestA.name,
            personalityType: guestA.personalityType || 'ambivert',
            engagementScore: guestA.engagementScore || 30,
            engagementTrend: guestA.engagementTrend || 'stable',
            location: guestA.currentLocation || 'lobby'
          },
          guest2: {
            id: guestB._id,
            name: guestB.name,
            personalityType: guestB.personalityType || 'ambivert',
            engagementScore: guestB.engagementScore || 30,
            engagementTrend: guestB.engagementTrend || 'stable',
            location: guestB.currentLocation || 'lobby'
          },
          compatibilityScore: result.score,
          reasons: result.reasons,
          sharedInterests: result.sharedInterests,
          isStrategic: result.isStrategic,
          recommendedFormat: format,
          priority: result.score >= 80 ? 'high' : result.score >= 65 ? 'medium' : 'low'
        });
      }
    }
  }
  
  // Sort by score descending
  opportunities.sort((a, b) => b.compatibilityScore - a.compatibilityCompatibilityScore);
  
  // Detect clusters (micro networking circles)
  const clusters = detectClusters(guests, opportunities);
  
  // Get stats
  const stats = {
    total: opportunities.length,
    highPriority: opportunities.filter(o => o.priority === 'high').length,
    mediumPriority: opportunities.filter(o => o.priority === 'medium').length,
    lowPriority: opportunities.filter(o => o.priority === 'low').length,
    strategic: opportunities.filter(o => o.isStrategic).length,
    clusters: clusters.length
  };
  
  return {
    opportunities: opportunities.slice(0, 20), // Top 20
    clusters,
    stats
  };
};

/**
 * Detect micro networking circles (clusters of 3+ guests)
 */
const detectClusters = (guests, opportunities) => {
  const clusters = [];
  const processed = new Set();
  
  // Build adjacency list from opportunities
  const adj = new Map();
  opportunities.forEach(opp => {
    const g1 = opp.guest1.id.toString();
    const g2 = opp.guest2.id.toString();
    
    if (!adj.has(g1)) adj.set(g1, []);
    if (!adj.has(g2)) adj.set(g2, []);
    
    adj.get(g1).push({ id: g2, score: opp.compatibilityScore, name: opp.guest2.name });
    adj.get(g2).push({ id: g1, score: opp.compatibilityScore, name: opp.guest1.name });
  });
  
  // Find cliques of 3+ with high mutual compatibility
  const guestIds = Array.from(adj.keys());
  
  for (let i = 0; i < guestIds.length; i++) {
    if (processed.has(guestIds[i])) continue;
    
    const g1 = guestIds[i];
    const neighbors1 = adj.get(g1) || [];
    
    for (const n1 of neighbors1) {
      if (processed.has(n1.id)) continue;
      
      const neighbors2 = adj.get(n1.id) || [];
      const mutualNeighbors = neighbors2.filter(n2 => 
        neighbors1.some(n => n.id === n2.id && n.id !== g1)
      );
      
      if (mutualNeighbors.length > 0) {
        // Found a triangle or larger
        const clusterMembers = [
          { id: g1, name: neighbors1[0]?.name || 'Guest' },
          { id: n1.id, name: n1.name },
          ...mutualNeighbors.slice(0, 2).map(n => ({ id: n.id, name: n.name }))
        ];
        
        const avgScore = Math.round(
          (neighbors1.find(n => n.id === n1.id)?.score || 0 +
           mutualNeighbors[0]?.score || 0) / 2
        );
        
        clusters.push({
          id: `cluster_${clusters.length}`,
          members: clusterMembers,
          memberCount: clusterMembers.length,
          avgCompatibility: avgScore,
          format: 'Micro networking circle',
          duration: '30-45 minutes',
          reason: 'High mutual compatibility detected'
        });
        
        processed.add(g1);
        processed.add(n1.id);
        mutualNeighbors.slice(0, 2).forEach(n => processed.add(n.id));
        
        if (clusters.length >= 5) break; // Limit to 5 clusters
      }
    }
    
    if (clusters.length >= 5) break;
  }
  
  return clusters;
};

/**
 * Get isolated guests who need networking help
 */
export const getIsolatedGuests = async (eventId) => {
  const graph = interactionEngine.getEventSocialGraph(eventId);
  const guests = await Guest.find({ eventId, status: { $ne: 'unavailable' } });
  
  const isolated = [];
  
  for (const guest of guests) {
    const guestId = guest._id.toString();
    const connections = graph.has(guestId) ? graph.get(guestId).size : 0;
    const engagement = guest.engagementScore || 30;
    const trend = guest.engagementTrend || 'stable';
    
    // Isolated if: 0 connections AND (low engagement OR falling trend)
    if (connections === 0 && (engagement < 40 || trend === 'falling')) {
      isolated.push({
        guestId: guest._id,
        name: guest.name,
        engagementScore: engagement,
        engagementTrend: trend,
        location: guest.currentLocation || 'unknown',
        riskLevel: engagement < 30 ? 'high' : 'medium',
        reason: trend === 'falling' 
          ? 'Declining engagement, needs re-engagement'
          : 'No connections formed yet'
      });
    }
  }
  
  return isolated.sort((a, b) => a.engagementScore - b.engagementScore);
};

/**
 * Get connectors (guests who can help others)
 */
export const getConnectors = async (eventId) => {
  const graph = interactionEngine.getEventSocialGraph(eventId);
  const guests = await Guest.find({ eventId });
  
  const connectors = [];
  const totalGuests = guests.length;
  
  for (const guest of guests) {
    const guestId = guest._id.toString();
    const connections = graph.has(guestId) ? graph.get(guestId).size : 0;
    
    // Connector if connected to >30% of guests
    if (connections > totalGuests * 0.3) {
      connectors.push({
        guestId: guest._id,
        name: guest.name,
        connectionCount: connections,
        networkReach: Math.round((connections / totalGuests) * 100),
        engagementScore: guest.engagementScore || 30,
        canHelp: Math.floor(connections / 3) // Rough estimate of isolated guests they could help
      });
    }
  }
  
  return connectors.sort((a, b) => b.connectionCount - a.connectionCount);
};

export default {
  calculateNetworkingScore,
  getNetworkingOpportunities,
  getIsolatedGuests,
  getConnectors
};
