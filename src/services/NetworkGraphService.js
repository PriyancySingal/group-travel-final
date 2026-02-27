/**
 * NetworkGraphService
 * 
 * Builds and maintains social network graph.
 * Tracks connections between guests.
 * 
 * Identifies:
 * - Most connected guests (social hubs)
 * - Isolated guests (at-risk)
 * - Network clusters
 * - Emerging relationships
 * 
 * Creates "LinkedIn-style" analytics view.
 */

class NetworkGraphService {
  constructor() {
    this.connections = {}; // { guestId: { otherId: count, ... }, ... }
  }

  /**
   * Initialize graph with guests
   */
  initialize(guests) {
    this.connections = {};
    guests.forEach(g => {
      this.connections[g.id] = g.connections || {};
    });
  }

  /**
   * Update connections based on interactions
   */
  updateConnections(guests, currentPhase) {
    return guests.map(guest => {
      // During networking phase, create new connections
      if (currentPhase === "networking" && Math.random() < 0.2) {
        const potentialConnection = guests[
          Math.floor(Math.random() * guests.length)
        ];

        if (potentialConnection.id !== guest.id) {
          const connections = { ...guest.connections };
          const otherId = potentialConnection.id;

          connections[otherId] = (connections[otherId] || 0) + 1;

          return { ...guest, connections };
        }
      }

      return guest;
    });
  }

  /**
   * Get network metrics
   */
  getNetworkMetrics(guests) {
    const metrics = {
      mostConnected: null,
      isolated: [],
      totalConnections: 0,
      avgConnectionsPerGuest: 0
    };

    if (guests.length === 0) return metrics;

    let maxConnections = -1;
    let totalConnections = 0;

    guests.forEach(guest => {
      const connectionCount = Object.values(guest.connections || {}).reduce(
        (a, b) => a + b,
        0
      );

      totalConnections += connectionCount;

      if (connectionCount > maxConnections) {
        maxConnections = connectionCount;
        metrics.mostConnected = { guest, connectionCount };
      }

      if (connectionCount === 0) {
        metrics.isolated.push(guest);
      }
    });

    metrics.totalConnections = totalConnections;
    metrics.avgConnectionsPerGuest = Math.round(
      totalConnections / guests.length
    );

    return metrics;
  }

  /**
   * Find network clusters (groups of highly connected guests)
   */
  findClusters(guests, threshold = 2) {
    const clusters = [];
    const visited = new Set();

    guests.forEach(guest => {
      if (visited.has(guest.id)) return;

      const cluster = this.dfsCluster(guest, guests, visited, threshold);

      if (cluster.length > 0) {
        clusters.push(cluster);
      }
    });

    return clusters;
  }

  /**
   * DFS to find connected cluster
   */
  dfsCluster(guest, allGuests, visited, threshold) {
    const cluster = [];
    const stack = [guest];

    while (stack.length > 0) {
      const current = stack.pop();

      if (visited.has(current.id)) continue;

      visited.add(current.id);
      cluster.push(current);

      // Find connected guests
      const connections = current.connections || {};
      Object.keys(connections).forEach(connectedId => {
        if (connections[connectedId] >= threshold && !visited.has(connectedId)) {
          const connectedGuest = allGuests.find(g => g.id === connectedId);
          if (connectedGuest) {
            stack.push(connectedGuest);
          }
        }
      });
    }

    return cluster;
  }
}

export default new NetworkGraphService();
