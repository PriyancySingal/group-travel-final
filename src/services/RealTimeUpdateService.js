/**
 * Real-Time Update Service
 * Handles real-time data synchronization for event updates
 * Supports both WebSocket and polling mechanisms
 */

class RealTimeUpdateService {
  static wsConnection = null;
  static eventListeners = new Map();
  static pollInterval = null;
  static pollIntervalTime = 3000; // 3 seconds

  /**
   * Initialize WebSocket connection for real-time updates
   */
  static initializeWebSocket(eventId, onUpdate) {
    // Use import.meta.env for Vite (not process.env)
    const wsUrl = import.meta.env.VITE_WS_URL || `ws://localhost:5001/ws/events/${eventId}`;

    try {
      // Skip WebSocket connection if in development and URL looks invalid
      if (!wsUrl || wsUrl.includes('undefined')) {
        console.warn("WebSocket URL not configured, using polling instead");
        this.fallbackToPolling(eventId, onUpdate);
        return;
      }

      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log("WebSocket connected for event:", eventId);
        this.registerListener(eventId, onUpdate);
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingUpdate(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.fallbackToPolling(eventId, onUpdate);
      };

      this.wsConnection.onclose = () => {
        console.log("WebSocket disconnected");
        this.fallbackToPolling(eventId, onUpdate);
      };
    } catch (error) {
      console.error("WebSocket initialization failed:", error);
      this.fallbackToPolling(eventId, onUpdate);
    }
  }

  /**
   * Fallback to polling if WebSocket is unavailable
   */
  static fallbackToPolling(eventId, onUpdate) {
    console.log("Falling back to polling for event:", eventId);

    if (this.pollInterval) clearInterval(this.pollInterval);

    this.pollInterval = setInterval(() => {
      this.pollEventUpdates(eventId, onUpdate);
    }, this.pollIntervalTime);
  }

  /**
   * Poll for event updates
   */
  static async pollEventUpdates(eventId, onUpdate) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/events/${eventId}/updates?since=${this.getLastUpdateTime(eventId)}`
      );

      if (!response.ok) throw new Error("Failed to fetch updates");

      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(update => {
          this.handleIncomingUpdate(update);
        });
      }
    } catch (error) {
      console.error("Error polling event updates:", error);
    }
  }

  /**
   * Handle incoming update from WebSocket or polling
   */
  static handleIncomingUpdate(update) {
    const listeners = this.eventListeners.get(update.eventId) || [];
    listeners.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error("Error processing update:", error);
      }
    });
  }

  /**
   * Register listener for event updates
   */
  static registerListener(eventId, callback) {
    if (!this.eventListeners.has(eventId)) {
      this.eventListeners.set(eventId, []);
    }
    this.eventListeners.get(eventId).push(callback);
  }

  /**
   * Unregister listener
   */
  static unregisterListener(eventId, callback) {
    const listeners = this.eventListeners.get(eventId) || [];
    const filtered = listeners.filter(cb => cb !== callback);
    this.eventListeners.set(eventId, filtered);
  }

  /**
   * Send update to WebSocket (admin action)
   */
  static sendUpdate(eventId, updateData) {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: "update",
        eventId,
        ...updateData
      }));
    }
  }

  /**
   * Get last update timestamp for event
   */
  static getLastUpdateTime(eventId) {
    const key = `event_${eventId}_lastUpdate`;
    return localStorage.getItem(key) || new Date(0).toISOString();
  }

  /**
   * Set last update timestamp
   */
  static setLastUpdateTime(eventId, timestamp) {
    const key = `event_${eventId}_lastUpdate`;
    localStorage.setItem(key, timestamp);
  }

  /**
   * Simulate real-time push update (for demo purposes)
   */
  static simulateUpdate(eventId, updateData) {
    const update = {
      eventId,
      timestamp: new Date(),
      type: updateData.type || "general",
      ...updateData
    };
    this.handleIncomingUpdate(update);
  }

  /**
   * Cleanup WebSocket connection
   */
  static closeConnection() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Check connection status
   */
  static isConnected() {
    return this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  static getConnectionStatus() {
    if (!this.wsConnection) {
      return "disconnected";
    }

    switch (this.wsConnection.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }
}

export default RealTimeUpdateService;
