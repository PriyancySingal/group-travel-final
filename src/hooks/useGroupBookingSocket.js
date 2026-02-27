/**
 * useGroupBookingSocket Hook
 * 
 * A React hook that manages Socket.io connections for group booking real-time updates
 * 
 * USAGE EXAMPLE:
 * ═════════════════════════════════════════════════════════════════════════════════════
 * 
 * In your React component:
 * 
 * function GroupDashboard() {
 *   const {
 *     connected,
 *     bookingUpdates,
 *     memberAdded,
 *     pricingUpdated,
 *     error,
 *     sendMessage
 *   } = useGroupBookingSocket("booking-123");
 * 
 *   return (
 *     <div>
 *       {connected ? "✅ Connected" : "⏳ Connecting..."}
 *       {error && <div className="error">{error}</div>}
 *       {bookingUpdates && <div>Status: {bookingUpdates.status}</div>}
 *     </div>
 *   );
 * }
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const useGroupBookingSocket = (bookingId) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [bookingUpdates, setBookingUpdates] = useState(null);
  const [memberAdded, setMemberAdded] = useState(null);
  const [pricingUpdated, setPricingUpdated] = useState(null);
  const [statusChanged, setStatusChanged] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const socketRef = useRef(null);

  const sendMessage = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      autoConnect: true
    });

    // Connection established
    socketRef.current.on("connect", () => {
      console.log("✅ Socket.io connected");
      setConnected(true);
      setError(null);

      // Join the specific group chat room
      if (bookingId) {
        socketRef.current.emit("joinGroupChat", { bookingId });
      }
    });

    // Connection error
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.io error:", error);
      setError("Failed to connect to real-time updates");
    });

    // Disconnected
    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket.io disconnected");
      setConnected(false);
    });

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Listen: New member added to group
     */
    socketRef.current.on("memberAdded", (data) => {
      console.log("📍 New member added:", data);
      setMemberAdded({
        ...data,
        timestamp: new Date()
      });

      // Clear after 5 seconds
      setTimeout(() => setMemberAdded(null), 5000);
    });

    /**
     * Listen: Member confirmed participation
     */
    socketRef.current.on("memberConfirmed", (data) => {
      console.log("✅ Member confirmed:", data);
      setBookingUpdates((prev) => ({
        ...prev,
        confirmedCount: data.confirmedCount,
        lastUpdate: new Date()
      }));
    });

    /**
     * Listen: Pricing updated
     */
    socketRef.current.on("pricingUpdated", (data) => {
      console.log("💰 Pricing updated:", data);
      setPricingUpdated({
        ...data,
        timestamp: new Date()
      });

      // Clear after 5 seconds
      setTimeout(() => setPricingUpdated(null), 5000);
    });

    /**
     * Listen: Booking status changed
     */
    socketRef.current.on("bookingStatusChanged", (data) => {
      console.log("🔄 Booking status changed:", data);
      setStatusChanged({
        ...data,
        timestamp: new Date()
      });

      setBookingUpdates((prev) => ({
        ...prev,
        status: data.newStatus
      }));
    });

    /**
     * Listen: Availability alert
     */
    socketRef.current.on("availabilityAlert", (data) => {
      console.warn("⚠️ Availability alert:", data);
      setAlerts((prev) => [...prev, { ...data, id: Date.now() }]);

      // Remove alert after 10 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== data.id));
      }, 10000);
    });

    /**
     * Listen: Surge price alert
     */
    socketRef.current.on("surgePriceAlert", (data) => {
      console.warn("🔥 Surge price alert:", data);
      setAlerts((prev) => [...prev, { ...data, type: "surge", id: Date.now() }]);

      // Remove alert after 15 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== data.id));
      }, 15000);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        if (bookingId) {
          socketRef.current.emit("leaveGroupChat", { bookingId });
        }
        socketRef.current.disconnect();
      }
    };
  }, [bookingId]);

  return {
    connected,
    error,
    bookingUpdates,
    memberAdded,
    pricingUpdated,
    statusChanged,
    alerts,
    sendMessage,
    socket: socketRef.current
  };
};

/**
 * useAdminDashboardSocket Hook
 *
 * For admin dashboard real-time monitoring
 *
 * USAGE:
 * ═════════════════════════════════════════════════════════════════════════════════════
 *
 * function AdminDashboard() {
 *   const {
 *     connected,
 *     newBookings,
 *     updates,
 *     metrics
 *   } = useAdminDashboardSocket();
 *
 *   return (
 *     <div>
 *       {newBookings.map(b => <BookingCard key={b.bookingId} {...b} />)}
 *     </div>
 *   );
 * }
 */

export const useAdminDashboardSocket = () => {
  const [connected, setConnected] = useState(false);
  const [newBookings, setNewBookings] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Admin Socket.io connected");
      setConnected(true);
      setError(null);

      // Join admin dashboard room
      socketRef.current.emit("joinAdminDashboard");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.io error:", error);
      setError("Failed to connect to admin dashboard");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Admin Socket.io disconnected");
      setConnected(false);
    });

    // ═══════════════════════════════════════════════════════════════
    // ADMIN EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Listen: New group booking created
     */
    socketRef.current.on("newGroupBookingCreated", (data) => {
      console.log("🆕 New group booking:", data);
      setNewBookings((prev) => [
        {
          ...data,
          receivedAt: new Date()
        },
        ...prev
      ]);
    });

    /**
     * Listen: Group updated (member added, etc.)
     */
    socketRef.current.on("groupUpdated", (data) => {
      console.log("🔄 Group updated:", data);
      setUpdates((prev) => [...prev, { ...data, timestamp: new Date() }]);
    });

    /**
     * Listen: Booking status changed
     */
    socketRef.current.on("bookingStatusChanged", (data) => {
      console.log("📋 Booking status changed:", data);
      setUpdates((prev) => [...prev, { ...data, type: "status_change", timestamp: new Date() }]);
    });

    /**
     * Listen: Surge price alert
     */
    socketRef.current.on("surgePriceAlert", (data) => {
      console.log("🔥 Surge price alert:", data);
      setUpdates((prev) => [...prev, { ...data, type: "surge", timestamp: new Date() }]);
    });

    /**
     * Listen: Dashboard metrics update
     */
    socketRef.current.on("dashboardUpdate", (data) => {
      console.log("📊 Dashboard update:", data);
      setMetrics({
        ...data,
        lastUpdated: new Date()
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    connected,
    newBookings,
    updates,
    metrics,
    error,
    socket: socketRef.current
  };
};

/**
 * HELPER: Toast Notification Component
 * 
 * Use this to display real-time alerts
 */
export const useRealtimeNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info", duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  return {
    notification,
    showNotification
  };
};

/**
 * EXAMPLE: Complete Group Dashboard with Real-Time Updates
 * 
 * ═════════════════════════════════════════════════════════════════════════════════════
 * 
 * import { useGroupBookingSocket, useRealtimeNotification } from "./useGroupBookingSocket";
 * 
 * function GroupDashboard() {
 *   const bookingId = useParams().id;
 *   const {
 *     connected,
 *     memberAdded,
 *     pricingUpdated,
 *     alerts
 *   } = useGroupBookingSocket(bookingId);
 * 
 *   const { notification, showNotification } = useRealtimeNotification();
 * 
 *   useEffect(() => {
 *     if (memberAdded) {
 *       showNotification(
 *         `${memberAdded.memberName} joined the group!`,
 *         "success"
 *       );
 *     }
 *   }, [memberAdded]);
 * 
 *   useEffect(() => {
 *     if (pricingUpdated) {
 *       showNotification(
 *         `Pricing updated: ₹${pricingUpdated.finalTotal}`,
 *         "info"
 *       );
 *     }
 *   }, [pricingUpdated]);
 * 
 *   return (
 *     <div className="group-dashboard">
 *       <div className="connection-status">
 *         {connected ? "🟢 Connected" : "🔴 Connecting..."}
 *       </div>
 * 
 *       {alerts.map(alert => (
 *         <AlertBanner key={alert.id} alert={alert} />
 *       ))}
 * 
 *       {notification && (
 *         <Toast
 *           message={notification.message}
 *           type={notification.type}
 *         />
 *       )}
 * 
 *       {/* Rest of dashboard... */}
 *     </div>
 *   );
 * }
 * 
 * export default GroupDashboard;
 */

export default useGroupBookingSocket;
