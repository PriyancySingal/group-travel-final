import Interaction from '../models/Interaction.js';
import Guest from '../models/Guest.js';
import AIEngagement from '../models/AIEngagement.js';

// ==========================================
// INTERACTION EVENT SYSTEM
// Tracks all guest-to-guest and guest-to-event interactions
// Builds social graph from real interaction data
// ==========================================

// In-memory fast access stores (hackathon mode - use Redis in production)
const interactionStore = new Map(); // eventId -> Array<Interaction>
const socialGraph = new Map(); // eventId -> Map<guestId -> Set<connectedGuestIds>>
const guestInteractionCounts = new Map(); // eventId -> Map<guestId -> {messages, activities, connections}>

/**
 * Valid interaction types and their engagement weights
 */
const INTERACTION_WEIGHTS = {
  message: 2,
  activity_join: 8,
  activity_leave: -3,
  pairing_accept: 12,
  check_in: 5,
  feedback_positive: 10,
  feedback_negative: -8,
  networking_scan: 15,
  inactivity: -4
};

/**
 * Get or create interaction store for event
 */
const getEventInteractions = (eventId) => {
  if (!interactionStore.has(eventId)) {
    interactionStore.set(eventId, []);
  }
  return interactionStore.get(eventId);
};

/**
 * Get or create social graph for event
 */
const getEventSocialGraph = (eventId) => {
  if (!socialGraph.has(eventId)) {
    socialGraph.set(eventId, new Map());
  }
  return socialGraph.get(eventId);
};

/**
 * Get or create guest interaction counts for event
 */
const getGuestCounts = (eventId, guestId) => {
  if (!guestInteractionCounts.has(eventId)) {
    guestInteractionCounts.set(eventId, new Map());
  }
  const eventCounts = guestInteractionCounts.get(eventId);
  if (!eventCounts.has(guestId)) {
    eventCounts.set(guestId, {
      messages: 0,
      activities: 0,
      connections: 0,
      totalInteractions: 0
    });
  }
  return eventCounts.get(guestId);
};

/**
 * Process an interaction event
 * @param {string} eventId - Event ID
 * @param {Object} interactionData - Interaction data
 * @returns {Object} Updated guest state and social graph info
 */
export const processInteraction = async (eventId, interactionData) => {
  const { guestId, targetGuestId, type, metadata = {} } = interactionData;

  if (!guestId || !type) {
    throw new Error('guestId and type are required');
  }

  // Create interaction record
  const interaction = {
    id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventId,
    guestId,
    targetGuestId: targetGuestId || null,
    type,
    timestamp: new Date(),
    metadata
  };

  // Store in memory
  const eventInteractions = getEventInteractions(eventId);
  eventInteractions.push(interaction);

  // Persist to DB (async, don't block)
  try {
    await Interaction.create(interaction);
  } catch (err) {
    console.error('Failed to persist interaction:', err);
  }

  // Update guest interaction counts
  const counts = getGuestCounts(eventId, guestId);
  counts.totalInteractions++;
  if (type === 'message') counts.messages++;
  if (type === 'activity_join') counts.activities++;
  if (type === 'pairing_accept' || type === 'networking_scan') counts.connections++;

  // Build social graph edge (if target guest involved)
  if (targetGuestId) {
    const graph = getEventSocialGraph(eventId);
    
    // Add bidirectional connection
    if (!graph.has(guestId)) graph.set(guestId, new Set());
    if (!graph.has(targetGuestId)) graph.set(targetGuestId, new Set());
    
    graph.get(guestId).add(targetGuestId);
    graph.get(targetGuestId).add(guestId);
  }

  // Update engagement via engagement engine
  const engagementDelta = INTERACTION_WEIGHTS[type] || 0;
  
  // Update guest engagement in DB
  try {
    const guest = await Guest.findById(guestId);
    if (guest) {
      // Update last activity
      guest.lastInteractionAt = new Date();
      
      // Update engagement score (clamped 0-100)
      const currentEngagement = guest.engagementScore || 30;
      const newEngagement = Math.max(0, Math.min(100, currentEngagement + engagementDelta));
      guest.engagementScore = newEngagement;
      
      // Update connection count from graph
      const graph = getEventSocialGraph(eventId);
      const connections = graph.has(guestId) ? graph.get(guestId).size : 0;
      guest.connectionCount = connections;
      
      await guest.save();
    }
  } catch (err) {
    console.error('Failed to update guest engagement:', err);
  }

  // Update AIEngagement record
  try {
    await AIEngagement.findOneAndUpdate(
      { eventId, guestId },
      {
        $inc: {
          engagementScore: engagementDelta,
          messagesSent: type === 'message' ? 1 : 0,
          groupActivitiesJoined: type === 'activity_join' ? 1 : 0,
          networkingConnectionsMade: (type === 'pairing_accept' || type === 'networking_scan') ? 1 : 0
        },
        $set: { lastActivityAt: new Date() }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error('Failed to update AIEngagement:', err);
  }

  return {
    interaction,
    engagementDelta,
    socialGraph: getSocialGraphForGuest(eventId, guestId),
    interactionCounts: counts
  };
};

/**
 * Get social graph for a specific guest
 */
export const getSocialGraphForGuest = (eventId, guestId) => {
  const graph = getEventSocialGraph(eventId);
  const connections = graph.has(guestId) ? Array.from(graph.get(guestId)) : [];
  
  return {
    guestId,
    connectionCount: connections.length,
    connections,
    networkRole: determineNetworkRole(eventId, guestId)
  };
};

/**
 * Determine network role based on connections
 */
const determineNetworkRole = (eventId, guestId) => {
  const graph = getEventSocialGraph(eventId);
  if (!graph.has(guestId)) return 'isolated';
  
  const connectionCount = graph.get(guestId).size;
  const totalGuests = graph.size;
  
  if (connectionCount === 0) return 'isolated';
  if (connectionCount >= totalGuests * 0.3) return 'connector';
  if (connectionCount >= 3) return 'participant';
  return 'observer';
};

/**
 * Get interaction history for a guest
 */
export const getGuestInteractionHistory = (eventId, guestId, limit = 50) => {
  const interactions = getEventInteractions(eventId);
  return interactions
    .filter(i => i.guestId === guestId || i.targetGuestId === guestId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

/**
 * Get all interactions for an event
 */
export const getEventInteractionsList = (eventId, options = {}) => {
  const { type, since, limit = 100 } = options;
  let interactions = getEventInteractions(eventId);
  
  if (type) {
    interactions = interactions.filter(i => i.type === type);
  }
  
  if (since) {
    const sinceDate = new Date(since);
    interactions = interactions.filter(i => i.timestamp >= sinceDate);
  }
  
  return interactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

/**
 * Get interaction statistics for event
 */
export const getEventInteractionStats = (eventId) => {
  const interactions = getEventInteractions(eventId);
  const graph = getEventSocialGraph(eventId);
  
  const stats = {
    totalInteractions: interactions.length,
    byType: {},
    uniqueGuests: new Set(),
    connectedPairs: 0,
    isolatedGuests: 0,
    connectors: 0,
    mostActiveGuest: null,
    recentActivity: []
  };
  
  // Count by type
  interactions.forEach(i => {
    stats.byType[i.type] = (stats.byType[i.type] || 0) + 1;
    stats.uniqueGuests.add(i.guestId);
    if (i.targetGuestId) stats.uniqueGuests.add(i.targetGuestId);
  });
  
  // Analyze graph
  let maxConnections = 0;
  let mostConnectedGuest = null;
  
  graph.forEach((connections, guestId) => {
    const count = connections.size;
    if (count > maxConnections) {
      maxConnections = count;
      mostConnectedGuest = guestId;
    }
    if (count === 0) stats.isolatedGuests++;
    if (count >= graph.size * 0.3) stats.connectors++;
  });
  
  stats.mostActiveGuest = mostConnectedGuest;
  stats.connectedPairs = Math.floor(Array.from(graph.values()).reduce((sum, set) => sum + set.size, 0) / 2);
  
  // Recent activity (last 10)
  stats.recentActivity = interactions.slice(-10).reverse();
  
  return stats;
};

/**
 * Get recommended pairings based on interaction history
 * Prioritizes guests who haven't interacted yet but should
 */
export const getSmartPairings = (eventId, guests) => {
  const graph = getEventSocialGraph(eventId);
  const pairings = [];
  
  for (let i = 0; i < guests.length; i++) {
    for (let j = i + 1; j < guests.length; j++) {
      const g1 = guests[i];
      const g2 = guests[j];
      
      const g1Id = g1._id || g1.id;
      const g2Id = g2._id || g2.id;
      
      // Skip if already connected
      if (graph.has(g1Id) && graph.get(g1Id).has(g2Id)) continue;
      
      // Calculate compatibility score
      let score = 0.5;
      
      // Shared interests
      const sharedInterests = (g1.interests || []).filter(i => (g2.interests || []).includes(i));
      score += sharedInterests.length * 0.15;
      
      // Complementary personalities
      if (g1.personalityType !== g2.personalityType) score += 0.1;
      
      // Both active participants
      const g1Counts = getGuestCounts(eventId, g1Id);
      const g2Counts = getGuestCounts(eventId, g2Id);
      if (g1Counts.totalInteractions > 2 && g2Counts.totalInteractions > 2) score += 0.1;
      
      // Both looking for networking
      if (g1.openToNetworking && g2.openToNetworking) score += 0.15;
      
      if (score >= 0.6) {
        pairings.push({
          pairId: `${g1Id}_${g2Id}`,
          guest1: { id: g1Id, name: g1.name },
          guest2: { id: g2Id, name: g2.name },
          compatibilityScore: Math.round(score * 100),
          sharedInterests,
          reason: sharedInterests.length > 0 
            ? `Both interested in: ${sharedInterests.join(', ')}`
            : 'Complementary personalities and both active',
          icebreaker: sharedInterests.length > 0
            ? `"I noticed you both enjoy ${sharedInterests[0]}!"`
            : `"You both seem to enjoy ${g1.personalityType === 'extravert' ? 'social' : 'quality'} time at events"`,
          priority: score > 0.8 ? 'high' : score > 0.7 ? 'medium' : 'low'
        });
      }
    }
  }
  
  // Sort by compatibility
  return pairings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

/**
 * Cleanup old event data
 */
export const cleanupEventInteractions = (eventId) => {
  interactionStore.delete(eventId);
  socialGraph.delete(eventId);
  guestInteractionCounts.delete(eventId);
};

export default {
  processInteraction,
  getSocialGraphForGuest,
  getGuestInteractionHistory,
  getEventInteractionsList,
  getEventInteractionStats,
  getSmartPairings,
  cleanupEventInteractions,
  INTERACTION_WEIGHTS
};
