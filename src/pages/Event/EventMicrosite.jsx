// import { useState, useEffect } from "react";
// import EventInventory from "./EventInventory";
// import EventSchedule from "./EventSchedule";
// import GuestItinerary from "./GuestItinerary";
// import EventUpdatesPanel from "./EventUpdatesPanel";
// import GuestPersonalization from "./GuestPersonalization";
// import EventCoordinationService from "../../services/EventCoordinationService";
// import RealTimeUpdateService from "../../services/RealTimeUpdateService";
// import { useParams } from "react-router-dom";

// const EventMicrosite =()=> {
//   const { id } = useParams(); 
//   const eventId = id;
//   const guestId = 1;
//   const [activeTab, setActiveTab] = useState("overview");
//   const [event, setEvent] = useState(null);
//   const [schedule, setSchedule] = useState([]);
//   const [itinerary, setItinerary] = useState(null);
//   const [guestInfo, setGuestInfo] = useState(null);
//   const [updates, setUpdates] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize event data
//   useEffect(() => {
//     try {
//       const eventData = EventCoordinationService.getEventById(eventId);
//       const scheduleData = EventCoordinationService.getEventSchedule(eventId);
//       const itineraryData = EventCoordinationService.getGuestItinerary(guestId, eventId);
//       const guestInfoData = EventCoordinationService.getGuestPersonalization(guestId, eventId);
//       const updatesData = EventCoordinationService.getEventUpdates(eventId);
//       const statsData = EventCoordinationService.getEventStats(eventId);

//       setEvent(eventData);
//       setSchedule(scheduleData);
//       setItinerary(itineraryData);
//       setGuestInfo(guestInfoData);
//       setUpdates(updatesData);
//       setStats(statsData);

//       if (!eventData) {
//         setError(`Event with ID ${eventId} not found. Available events: 1, 2, 3`);
//       }
//     } catch (err) {
//       console.error("Error loading event data:", err);
//       setError(err.message);
//     }

//     // Subscribe to real-time updates
//     if (autoRefresh) {
//       const unsubscribe = EventCoordinationService.subscribeToUpdates((newUpdate) => {
//         if (newUpdate.eventId === eventId) {
//           setUpdates(prev => [newUpdate, ...prev]);
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, [eventId, guestId, autoRefresh]);

//   // Initialize real-time connection
//   useEffect(() => {
//     if (autoRefresh) {
//       RealTimeUpdateService.initializeWebSocket(eventId, (update) => {
//         if (update.eventId === eventId) {
//           setUpdates(prev => [update, ...prev]);
//         }
//       });

//       return () => {
//         RealTimeUpdateService.closeConnection();
//       };
//     }
//   }, [eventId, autoRefresh]);

//   const handleUpdateRead = (updateId) => {
//     EventCoordinationService.markUpdateAsRead(updateId);
//     setUpdates(prev => prev.map(u => u.id === updateId ? { ...u, read: true } : u));
//   };

//   const handleToggleAutoRefresh = () => {
//     setAutoRefresh(!autoRefresh);
//   };

//   const tabs = [
//     { id: "overview", label: "📋 Overview", icon: "overview" },
//     { id: "schedule", label: "📅 Schedule", icon: "schedule" },
//     { id: "itinerary", label: "👤 My Itinerary", icon: "itinerary" },
//     { id: "personalization", label: "🎯 My Info", icon: "personalization" },
//     { id: "updates", label: "⚡ Updates", icon: "updates", badge: updates.filter(u => !u.read).length },
//     { id: "inventory", label: "📦 Inventory", icon: "inventory" },
//   ];

//   if (error) {
//     return (
//       <div style={{ 
//         marginTop: "60px", 
//         textAlign: "center", 
//         padding: "40px",
//         color: "white",
//         maxWidth: "1400px",
//         margin: "0 auto"
//       }}>
//         <h2 style={{ color: "#ff6b6b" }}>❌ Error Loading Event</h2>
//         <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>{error}</p>
//         <p style={{ opacity: "0.7" }}>Try using eventId: 1, 2, or 3</p>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div style={{ 
//         marginTop: "60px", 
//         textAlign: "center", 
//         padding: "40px 20px",
//         color: "white",
//         maxWidth: "1400px",
//         margin: "0 auto"
//       }}>
//         <h2>Loading event details...</h2>
//         <p style={{ opacity: "0.7" }}>Event ID: {eventId}, Guest ID: {guestId}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Tab Navigation */}
//       <div
//         style={{
//           position: "sticky",
//           top: 60,
//           background: "rgba(10, 10, 20, 0.95)",
//           backdropFilter: "blur(10px)",
//           borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//           zIndex: 100,
//           paddingTop: "12px",
//           paddingBottom: "12px",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: "1400px",
//             margin: "0 auto",
//             paddingLeft: "24px",
//             paddingRight: "24px",
//             display: "flex",
//             gap: "12px",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               style={{
//                 padding: "10px 16px",
//                 background:
//                   activeTab === tab.id
//                     ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//                     : "rgba(255, 255, 255, 0.1)",
//                 border:
//                   activeTab === tab.id
//                     ? "1px solid rgba(255, 255, 255, 0.3)"
//                     : "1px solid rgba(255, 255, 255, 0.2)",
//                 color: "white",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontWeight: "500",
//                 fontSize: "14px",
//                 transition: "all 0.2s ease",
//                 position: "relative",
//               }}
//             >
//               {tab.label}
//               {tab.badge > 0 && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-8px",
//                     background: "#ff4444",
//                     color: "white",
//                     borderRadius: "50%",
//                     width: "20px",
//                     height: "20px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {tab.badge}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div style={{ 
//         maxWidth: "1400px", 
//         margin: "0 auto", 
//         paddingLeft: "24px", 
//         paddingRight: "24px",
//         marginTop: "24px",
//         paddingBottom: "40px"
//       }}>
//         {/* Overview Tab */}
//         {activeTab === "overview" && (
//           <div>
//             <div style={{ marginBottom: "32px" }}>
//               <h1 style={{ 
//                 margin: "0 0 12px 0", 
//                 fontSize: "2.5rem",
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text"
//               }}>
//                 {event.logo} {event.name}
//               </h1>
//               <p style={{ opacity: 0.8, fontSize: "1.1rem", marginBottom: "8px" }}>
//                 📍 {event.location} • 📅 {event.startDate} to {event.endDate}
//               </p>
//               <p style={{ opacity: 0.6, fontSize: "1rem" }}>{event.description}</p>
//             </div>

//             {/* Event Statistics */}
//             {stats && (
//               <div style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
//                 <div style={{
//                   background: "rgba(255, 255, 255, 0.05)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(255, 255, 255, 0.1)",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   textAlign: "center"
//                 }}>
//                   <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#667eea" }}>{stats.totalGuests}</h4>
//                   <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Total Guests</p>
//                 </div>
//                 <div style={{
//                   background: "rgba(255, 255, 255, 0.05)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(255, 255, 255, 0.1)",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   textAlign: "center"
//                 }}>
//                   <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#764ba2" }}>{stats.totalDays}</h4>
//                   <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Event Days</p>
//                 </div>
//                 <div style={{
//                   background: "rgba(255, 255, 255, 0.05)",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(255, 255, 255, 0.1)",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   textAlign: "center"
//                 }}>
//                   <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#667eea" }}>{stats.totalActivities}</h4>
//                   <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Activities</p>
//                 </div>
//               </div>
//             )}

//             {/* Quick Info Cards */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
//               <div style={{
//                 background: "rgba(255, 255, 255, 0.05)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(255, 255, 255, 0.1)",
//                 borderRadius: "12px",
//                 padding: "20px"
//               }}>
//                 <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>🏢 Event Type</h3>
//                 <p style={{ margin: "0", fontSize: "1.1rem", textTransform: "capitalize", opacity: "0.9" }}>{event.type}</p>
//               </div>
//               <div style={{
//                 background: "rgba(255, 255, 255, 0.05)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(255, 255, 255, 0.1)",
//                 borderRadius: "12px",
//                 padding: "20px"
//               }}>
//                 <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>👤 Organizer</h3>
//                 <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>{event.organizer}</p>
//               </div>
//               <div style={{
//                 background: "rgba(255, 255, 255, 0.05)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(255, 255, 255, 0.1)",
//                 borderRadius: "12px",
//                 padding: "20px"
//               }}>
//                 <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>🏨 Venue Hotel</h3>
//                 <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>{event.hotel}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Schedule Tab */}
//         {activeTab === "schedule" && <EventSchedule eventId={eventId} schedule={schedule} />}

//         {/* Itinerary Tab */}
//         {activeTab === "itinerary" && <GuestItinerary itinerary={itinerary} />}

//         {/* Personalization Tab */}
//         {activeTab === "personalization" && <GuestPersonalization guestInfo={guestInfo} />}

//         {/* Updates Tab */}
//         {activeTab === "updates" && <EventUpdatesPanel eventId={eventId} updates={updates} onUpdateRead={handleUpdateRead} />}

//         {/* Inventory Tab */}
//         {activeTab === "inventory" && <EventInventory />}
//       </div>
//     </div>
//   );
// };

// export default EventMicrosite;
import { useState, useEffect } from "react";
import EventInventory from "./EventInventory";
import EventSchedule from "./EventSchedule";
import GuestItinerary from "./GuestItinerary";
import EventUpdatesPanel from "./EventUpdatesPanel";
import GuestPersonalization from "./GuestPersonalization";
import EventCoordinationService from "../../services/EventCoordinationService";
import { useParams } from "react-router-dom";

const EventMicrosite = () => {
  const { id } = useParams();
  const eventId = id;
  const guestId = 1;

  const [activeTab, setActiveTab] = useState("overview");
  const [event, setEvent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [guestInfo, setGuestInfo] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Initialize event data (SAFE VERSION)
  // 
  useEffect(() => {
  const loadEvent = async () => {
    try {
      const eventData = await EventCoordinationService.getEventById(eventId);

      setEvent(eventData);

      if (!eventData) {
        setError(`Event with ID ${eventId} not found.`);
        return;
      }

      // ✅ If demo event → load static frontend data
      if (eventData.isDemo) {
        setSchedule(
          EventCoordinationService.getScheduleByEventId(eventId)
        );

        setUpdates(
          EventCoordinationService.getUpdatesByEventId(eventId)
        );

        setItinerary(
          EventCoordinationService.getItineraryByEventId(eventId)
        );
        setGuestInfo(EventCoordinationService.demoGuestInfo[eventId]);
      }

    } catch (err) {
      console.error("Error loading event data:", err);
      setError(err.message);
    }
  };

  loadEvent();
}, [eventId]);

  const handleUpdateRead = (updateId) => {
    setUpdates(prev =>
      prev.map(u => u.id === updateId ? { ...u, read: true } : u)
    );
  };

  const tabs = [
    { id: "overview", label: "📋 Overview" },
    { id: "schedule", label: "📅 Schedule" },
    { id: "itinerary", label: "👤 My Itinerary" },
    { id: "personalization", label: "🎯 My Info" },
    { id: "updates", label: "⚡ Updates", badge: updates.filter(u => !u.read).length },
    { id: "inventory", label: "📦 Inventory" },
  ];

  if (error) {
    return (
      <div style={{
        marginTop: "60px",
        textAlign: "center",
        padding: "40px",
        color: "white",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <h2 style={{ color: "#ff6b6b" }}>❌ Error Loading Event</h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{
        marginTop: "60px",
        textAlign: "center",
        padding: "40px 20px",
        color: "white",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <h2>Loading event details...</h2>
        <p style={{ opacity: "0.7" }}>Event ID: {eventId}, Guest ID: {guestId}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div
        style={{
          position: "sticky",
          top: 60,
          background: "rgba(10, 10, 20, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 100,
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "rgba(255, 255, 255, 0.1)",
                border:
                  activeTab === tab.id
                    ? "1px solid rgba(255, 255, 255, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ff4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "24px",
          paddingBottom: "40px"
        }}
      >
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{
                margin: "0 0 12px 0",
                fontSize: "2.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {event.logo} {event.name}
              </h1>

              <p style={{ opacity: 0.8, fontSize: "1.1rem", marginBottom: "8px" }}>
                📍 {event.location} • 📅 {event.startDate} to {event.endDate}
              </p>

              <p style={{ opacity: 0.6, fontSize: "1rem" }}>
                {event.description}
              </p>
            </div>
              {/* Event Info Cards */}
    <div style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
      {/* Total Guests */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center"
      }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#667eea" }}>
          {event.totalGuests || 0} {/* Display total guests */}
        </h4>
        <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Total Guests</p>
      </div>

      {/* Event Days */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center"
      }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#764ba2" }}>
          {event.eventDays || 0} {/* Display event days */}
        </h4>
        <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Event Days</p>
      </div>

      {/* Activities - Show only for Demo events */}
      {event.isDemo && (
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "2.5rem", color: "#ffbb33" }}>
            {event.activities ? event.activities.length : 0} {/* Display number of activities for demo events */}
          </h4>
          <p style={{ margin: "0", opacity: "0.7", fontSize: "0.9rem" }}>Activities</p>
        </div>
      )}
    </div>



            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>🏢 Event Type</h3>
                <p style={{ margin: "0", fontSize: "1.1rem", textTransform: "capitalize", opacity: "0.9" }}>{event.type}</p>
              </div>

              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>👤 Organizer</h3>
                <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>{event.organizer}</p>
              </div>

              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem" }}>🏨 Venue Hotel</h3>
                <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>{event.hotel}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && <EventSchedule eventId={eventId} schedule={schedule} />}
        {activeTab === "itinerary" && <GuestItinerary itinerary={itinerary} />}
        {activeTab === "personalization" && <GuestPersonalization guestInfo={guestInfo} />}
        {activeTab === "updates" && <EventUpdatesPanel eventId={eventId} updates={updates} onUpdateRead={handleUpdateRead} />}
        {activeTab === "inventory" && <EventInventory eventId={eventId} />}
      </div>
    </div>
  );
};

export default EventMicrosite;