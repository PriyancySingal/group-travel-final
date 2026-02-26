// // // import { useState, useEffect } from "react";
// // // import EventInventoryService from "./EventInventoryService";
// // // import ResourceAllocationEngine from "./ResourceAllocationEngine";
// // // import InventoryCard from "./InventoryCard";
// // // import "./EventInventory.css";

// // // const EventInventory = ({ eventId = "wedding-2024" }) => {
// // //   const [inventory, setInventory] = useState(null);
// // //   const [activeTab, setActiveTab] = useState("rooms");
// // //   const [summary, setSummary] = useState(null);
// // //   const [occupancy, setOccupancy] = useState(null);
// // //   const [alerts, setAlerts] = useState([]);
// // //   const [recommendations, setRecommendations] = useState(null);
// // //   const [showAddForm, setShowAddForm] = useState(false);
// // //   const [formType, setFormType] = useState("room");
// // //   const [formData, setFormData] = useState({});

// // //   // Initialize inventory on first load
// // //   useEffect(() => {
// // //     loadInventory();
// // //   }, [eventId]);

// // //   const loadInventory = () => {
// // //     let inv = EventInventoryService.getEventInventory(eventId);

// // //     // Initialize if doesn't exist
// // //     if (!inv) {
// // //       inv = EventInventoryService.initializeEventInventory({
// // //         eventId,
// // //         eventName: "Group Travel Event",
// // //         eventDate: new Date().toISOString(),
// // //         rooms: [
// // //           {
// // //             id: 1,
// // //             type: "Standard Room",
// // //             quantity: 10,
// // //             accessible: false,
// // //             quiet: false,
// // //             highFloor: false,
// // //             groundFloor: true,
// // //             booked: 3,
// // //             available: 7
// // //           },
// // //           {
// // //             id: 2,
// // //             type: "Deluxe Room",
// // //             quantity: 8,
// // //             accessible: false,
// // //             quiet: true,
// // //             highFloor: true,
// // //             groundFloor: false,
// // //             booked: 2,
// // //             available: 6
// // //           },
// // //           {
// // //             id: 3,
// // //             type: "Accessible Room",
// // //             quantity: 4,
// // //             accessible: true,
// // //             quiet: false,
// // //             highFloor: false,
// // //             groundFloor: true,
// // //             booked: 1,
// // //             available: 3
// // //           }
// // //         ],
// // //         transport: [
// // //           {
// // //             id: 101,
// // //             type: "Sedan",
// // //             capacity: 4,
// // //             reserved: 2,
// // //             available: 2,
// // //             location: "Main Gate"
// // //           },
// // //           {
// // //             id: 102,
// // //             type: "SUV",
// // //             capacity: 6,
// // //             reserved: 3,
// // //             available: 3,
// // //             location: "Parking Lot A"
// // //           },
// // //           {
// // //             id: 103,
// // //             type: "Bus (32-seater)",
// // //             capacity: 32,
// // //             reserved: 0,
// // //             available: 32,
// // //             location: "Bus Stand"
// // //           }
// // //         ],
// // //         dining: [
// // //           {
// // //             id: 201,
// // //             mealType: "Breakfast",
// // //             capacity: 80,
// // //             booked: 45,
// // //             available: 35,
// // //             dietaryOptions: ["Vegetarian", "Non-Veg", "Vegan"],
// // //             time: "7:00 AM - 9:00 AM"
// // //           },
// // //           {
// // //             id: 202,
// // //             mealType: "Lunch",
// // //             capacity: 100,
// // //             booked: 62,
// // //             available: 38,
// // //             dietaryOptions: ["Vegetarian", "Non-Veg", "Gluten-Free"],
// // //             time: "12:30 PM - 2:00 PM"
// // //           },
// // //           {
// // //             id: 203,
// // //             mealType: "Dinner",
// // //             capacity: 120,
// // //             booked: 89,
// // //             available: 31,
// // //             dietaryOptions: ["Vegetarian", "Non-Veg", "Halal"],
// // //             time: "7:00 PM - 9:00 PM"
// // //           }
// // //         ],
// // //         activities: [
// // //           {
// // //             id: 301,
// // //             name: "Yoga & Meditation",
// // //             description: "Morning yoga session",
// // //             capacity: 30,
// // //             registered: 18,
// // //             available: 12,
// // //             time: "6:00 AM",
// // //             duration: "1 Hour"
// // //           },
// // //           {
// // //             id: 302,
// // //             name: "Sightseeing Tour",
// // //             description: "City tour with local guide",
// // //             capacity: 40,
// // //             registered: 35,
// // //             available: 5,
// // //             time: "10:00 AM",
// // //             duration: "3 Hours"
// // //           },
// // //           {
// // //             id: 303,
// // //             name: "Adventure Sports",
// // //             description: "Trekking and outdoor activities",
// // //             capacity: 25,
// // //             registered: 20,
// // //             available: 5,
// // //             time: "2:00 PM",
// // //             duration: "4 Hours"
// // //           },
// // //           {
// // //             id: 304,
// // //             name: "Cultural Evening",
// // //             description: "Local music and dance performance",
// // //             capacity: 100,
// // //             registered: 42,
// // //             available: 58,
// // //             time: "6:00 PM",
// // //             duration: "2 Hours"
// // //           }
// // //         ]
// // //       });
// // //     }

// // //     setInventory(inv);
// // //     updateSummary(inv);
// // //     updateOccupancy(inv);
// // //     updateAlerts(inv);
// // //     loadRecommendations();
// // //   };

// // //   const updateSummary = (inv) => {
// // //     const summary = EventInventoryService.getInventorySummary(inv.eventId || eventId);
// // //     setSummary(summary);
// // //   };

// // //   const updateOccupancy = (inv) => {
// // //     const occupancy = EventInventoryService.getOccupancyRates(inv.eventId || eventId);
// // //     setOccupancy(occupancy);
// // //   };

// // //   const updateAlerts = (inv) => {
// // //     const alerts = EventInventoryService.getAvailabilityAlerts(inv.eventId || eventId);
// // //     setAlerts(alerts);
// // //   };

// // //   const loadRecommendations = () => {
// // //     const recs = ResourceAllocationEngine.getAllocationRecommendations(eventId);
// // //     setRecommendations(recs);
// // //   };

// // //   const handleAvailabilityUpdate = ({ itemId, change, type }) => {
// // //     try {
// // //       if (type === "room") {
// // //         EventInventoryService.updateRoomAvailability(eventId, itemId, change);
// // //       } else if (type === "transport") {
// // //         EventInventoryService.updateTransportAvailability(eventId, itemId, change);
// // //       } else if (type === "dining") {
// // //         EventInventoryService.updateDiningAvailability(eventId, itemId, change);
// // //       } else if (type === "activity") {
// // //         EventInventoryService.updateActivityAvailability(eventId, itemId, change);
// // //       }
// // //       loadInventory();
// // //     } catch (error) {
// // //       alert("Error: " + error.message);
// // //     }
// // //   };

// // //   const handleDelete = (itemId) => {
// // //     if (window.confirm("Delete this inventory item?")) {
// // //       try {
// // //         EventInventoryService.deleteInventoryItem(eventId, activeTab + "s", itemId);
// // //         loadInventory();
// // //       } catch (error) {
// // //         alert("Error: " + error.message);
// // //       }
// // //     }
// // //   };

// // //   const handleAddItem = (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       const eventId_to_use = inventory?.eventId || eventId;

// // //       if (formType === "room") {
// // //         EventInventoryService.addRoom(eventId_to_use, {
// // //           type: formData.type || "Standard",
// // //           quantity: parseInt(formData.quantity) || 1,
// // //           accessible: formData.accessible || false,
// // //           quiet: formData.quiet || false,
// // //           highFloor: formData.highFloor || false,
// // //           groundFloor: formData.groundFloor || false
// // //         });
// // //       } else if (formType === "transport") {
// // //         EventInventoryService.addTransport(eventId_to_use, {
// // //           type: formData.type || "Vehicle",
// // //           capacity: parseInt(formData.capacity) || 1,
// // //           location: formData.location || ""
// // //         });
// // //       } else if (formType === "dining") {
// // //         EventInventoryService.addDiningOption(eventId_to_use, {
// // //           mealType: formData.mealType || "Meal",
// // //           capacity: parseInt(formData.capacity) || 1,
// // //           dietaryOptions: (formData.dietaryOptions || "").split(",").map(d => d.trim()),
// // //           time: formData.time || ""
// // //         });
// // //       } else if (formType === "activity") {
// // //         EventInventoryService.addActivity(eventId_to_use, {
// // //           name: formData.name || "Activity",
// // //           description: formData.description || "",
// // //           capacity: parseInt(formData.capacity) || 1,
// // //           time: formData.time || "",
// // //           duration: formData.duration || ""
// // //         });
// // //       }

// // //       setFormData({});
// // //       setShowAddForm(false);
// // //       loadInventory();
// // //     } catch (error) {
// // //       alert("Error: " + error.message);
// // //     }
// // //   };

// // //   const handleExportCSV = () => {
// // //     const csv = EventInventoryService.exportInventoryAsCSV(eventId);
// // //     const element = document.createElement("a");
// // //     element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
// // //     element.setAttribute("download", `inventory-${eventId}.csv`);
// // //     element.style.display = "none";
// // //     document.body.appendChild(element);
// // //     element.click();
// // //     document.body.removeChild(element);
// // //   };

// // //   const handleApplyRecommendations = (type) => {
// // //     try {
// // //       if (recommendations && recommendations[type]) {
// // //         const response = ResourceAllocationEngine.applyAllocation(
// // //           eventId,
// // //           type,
// // //           recommendations[type].suggestions
// // //         );
// // //         alert(`${response.appliedCount} allocations applied successfully!`);
// // //         loadInventory();
// // //       }
// // //     } catch (error) {
// // //       alert("Error: " + error.message);
// // //     }
// // //   };

// // //   const renderInventoryItems = () => {
// // //     let items = [];

// // //     if (activeTab === "room" && inventory?.rooms) {
// // //       items = inventory.rooms;
// // //     } else if (activeTab === "transport" && inventory?.transport) {
// // //       items = inventory.transport;
// // //     } else if (activeTab === "dining" && inventory?.dining) {
// // //       items = inventory.dining;
// // //     } else if (activeTab === "activity" && inventory?.activities) {
// // //       items = inventory.activities;
// // //     }

// // //     return items.map(item => (
// // //       <InventoryCard
// // //         key={item.id}
// // //         item={item}
// // //         type={activeTab}
// // //         onUpdate={handleAvailabilityUpdate}
// // //         onDelete={handleDelete}
// // //       />
// // //     ));
// // //   };

// // //   return (
// // //     <div className="event-inventory-container fade-in">
// // //       <div className="inventory-header">
// // //         <h1>📦 Event Inventory Management</h1>
// // //         <p>Real-time tracking and allocation of event resources</p>
// // //       </div>

// // //       {/* Availability Alerts */}
// // //       {alerts.length > 0 && (
// // //         <div className="alerts-section">
// // //           <h2>⚠️ Availability Alerts</h2>
// // //           <div className="alerts-list">
// // //             {alerts.map(alert => (
// // //               <div key={alert.id} className={`alert alert-${alert.type}`}>
// // //                 <div className="alert-title">{alert.title}</div>
// // //                 <div className="alert-message">{alert.message}</div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Summary Cards */}
// // //       {summary && (
// // //         <div className="summary-section">
// // //           <h2>📊 Inventory Summary</h2>
// // //           <div className="summary-grid">
// // //             <div className="summary-card">
// // //               <div className="summary-icon">🏨</div>
// // //               <div className="summary-label">Rooms</div>
// // //               <div className="summary-value">{summary.rooms.booked}/{summary.rooms.total}</div>
// // //               <div className="summary-available">{summary.rooms.available} available</div>
// // //             </div>

// // //             <div className="summary-card">
// // //               <div className="summary-icon">🚗</div>
// // //               <div className="summary-label">Transport</div>
// // //               <div className="summary-value">{summary.transport.reserved}</div>
// // //               <div className="summary-available">{summary.transport.availableSlots} available</div>
// // //             </div>

// // //             <div className="summary-card">
// // //               <div className="summary-icon">🍽️</div>
// // //               <div className="summary-label">Dining</div>
// // //               <div className="summary-value">{summary.dining.booked}</div>
// // //               <div className="summary-available">{summary.dining.availableSeats} available</div>
// // //             </div>

// // //             <div className="summary-card">
// // //               <div className="summary-icon">🎯</div>
// // //               <div className="summary-label">Activities</div>
// // //               <div className="summary-value">{summary.activities.registered}</div>
// // //               <div className="summary-available">{summary.activities.availableSlots} available</div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Occupancy Rates */}
// // //       {occupancy && (
// // //         <div className="occupancy-section">
// // //           <h2>📈 Occupancy Rates</h2>
// // //           <div className="occupancy-grid">
// // //             <div className="occupancy-item">
// // //               <div className="occupancy-label">Room Occupancy</div>
// // //               <div className="occupancy-bar">
// // //                 <div className="occupancy-fill" style={{ width: `${occupancy.roomOccupancy}%` }} />
// // //               </div>
// // //               <div className="occupancy-percent">{occupancy.roomOccupancy}%</div>
// // //             </div>

// // //             <div className="occupancy-item">
// // //               <div className="occupancy-label">Dining Occupancy</div>
// // //               <div className="occupancy-bar">
// // //                 <div className="occupancy-fill" style={{ width: `${occupancy.diningOccupancy}%` }} />
// // //               </div>
// // //               <div className="occupancy-percent">{occupancy.diningOccupancy}%</div>
// // //             </div>

// // //             <div className="occupancy-item">
// // //               <div className="occupancy-label">Activity Participation</div>
// // //               <div className="occupancy-bar">
// // //                 <div className="occupancy-fill" style={{ width: `${occupancy.activityParticipation}%` }} />
// // //               </div>
// // //               <div className="occupancy-percent">{occupancy.activityParticipation}%</div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Recommendations */}
// // //       {recommendations && (
// // //         <div className="recommendations-section">
// // //           <h2>🤖 Automated Resource Allocation Recommendations</h2>
// // //           <div className="recommendations-grid">
// // //             {recommendations.rooms.status === "ready" && (
// // //               <div className="rec-card">
// // //                 <h3>🏨 Room Assignments</h3>
// // //                 <p>{recommendations.rooms.suggestions.length} assignments recommended</p>
// // //                 <button
// // //                   className="btn-apply"
// // //                   onClick={() => handleApplyRecommendations("rooms")}
// // //                 >
// // //                   Apply Recommendations
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {recommendations.dining.status === "ready" && (
// // //               <div className="rec-card">
// // //                 <h3>🍽️ Dining Allocation</h3>
// // //                 <p>{recommendations.dining.suggestions.length} options available</p>
// // //                 <button
// // //                   className="btn-apply"
// // //                   onClick={() => handleApplyRecommendations("dining")}
// // //                 >
// // //                   Apply Recommendations
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {recommendations.activities.status === "ready" && (
// // //               <div className="rec-card">
// // //                 <h3>🎯 Activity Suggestions</h3>
// // //                 <p>{recommendations.activities.suggestions.length} activities available</p>
// // //                 <button
// // //                   className="btn-apply"
// // //                   onClick={() => handleApplyRecommendations("activities")}
// // //                 >
// // //                   Apply Recommendations
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {recommendations.transport.status === "ready" && (
// // //               <div className="rec-card">
// // //                 <h3>🚗 Transport Options</h3>
// // //                 <p>{recommendations.transport.suggestions.length} options available</p>
// // //                 <button
// // //                   className="btn-apply"
// // //                   onClick={() => handleApplyRecommendations("transport")}
// // //                 >
// // //                   Apply Recommendations
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Inventory Management */}
// // //       <div className="inventory-section">
// // //         <div className="inventory-controls">
// // //           <div className="tab-buttons">
// // //             <button
// // //               className={`tab-btn ${activeTab === "room" ? "active" : ""}`}
// // //               onClick={() => setActiveTab("room")}
// // //             >
// // //               🏨 Rooms
// // //             </button>
// // //             <button
// // //               className={`tab-btn ${activeTab === "transport" ? "active" : ""}`}
// // //               onClick={() => setActiveTab("transport")}
// // //             >
// // //               🚗 Transport
// // //             </button>
// // //             <button
// // //               className={`tab-btn ${activeTab === "dining" ? "active" : ""}`}
// // //               onClick={() => setActiveTab("dining")}
// // //             >
// // //               🍽️ Dining
// // //             </button>
// // //             <button
// // //               className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
// // //               onClick={() => setActiveTab("activity")}
// // //             >
// // //               🎯 Activities
// // //             </button>
// // //           </div>

// // //           <div className="action-buttons">
// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => {
// // //                 setFormType(activeTab);
// // //                 setShowAddForm(true);
// // //               }}
// // //             >
// // //               ➕ Add Item
// // //             </button>
// // //             <button className="btn-secondary" onClick={handleExportCSV}>
// // //               📥 Export CSV
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Add Form */}
// // //         {showAddForm && (
// // //           <div className="add-form-modal">
// // //             <div className="form-container">
// // //               <h3>Add {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
// // //               <form onSubmit={handleAddItem}>
// // //                 {formType === "room" && (
// // //                   <>
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Room Type"
// // //                       value={formData.type || ""}
// // //                       onChange={(e) => setFormData({ ...formData, type: e.target.value })}
// // //                       required
// // //                     />
// // //                     <input
// // //                       type="number"
// // //                       placeholder="Quantity"
// // //                       value={formData.quantity || ""}
// // //                       onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
// // //                       required
// // //                     />
// // //                     <label>
// // //                       <input
// // //                         type="checkbox"
// // //                         checked={formData.accessible || false}
// // //                         onChange={(e) => setFormData({ ...formData, accessible: e.target.checked })}
// // //                       />
// // //                       Wheelchair Accessible
// // //                     </label>
// // //                   </>
// // //                 )}
// // //                 {formType === "transport" && (
// // //                   <>
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Transport Type"
// // //                       value={formData.type || ""}
// // //                       onChange={(e) => setFormData({ ...formData, type: e.target.value })}
// // //                       required
// // //                     />
// // //                     <input
// // //                       type="number"
// // //                       placeholder="Capacity"
// // //                       value={formData.capacity || ""}
// // //                       onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
// // //                       required
// // //                     />
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Location"
// // //                       value={formData.location || ""}
// // //                       onChange={(e) => setFormData({ ...formData, location: e.target.value })}
// // //                     />
// // //                   </>
// // //                 )}
// // //                 {formType === "dining" && (
// // //                   <>
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Meal Type"
// // //                       value={formData.mealType || ""}
// // //                       onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
// // //                       required
// // //                     />
// // //                     <input
// // //                       type="number"
// // //                       placeholder="Capacity"
// // //                       value={formData.capacity || ""}
// // //                       onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
// // //                       required
// // //                     />
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Dietary Options (comma-separated)"
// // //                       value={formData.dietaryOptions || ""}
// // //                       onChange={(e) => setFormData({ ...formData, dietaryOptions: e.target.value })}
// // //                     />
// // //                   </>
// // //                 )}
// // //                 {formType === "activity" && (
// // //                   <>
// // //                     <input
// // //                       type="text"
// // //                       placeholder="Activity Name"
// // //                       value={formData.name || ""}
// // //                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// // //                       required
// // //                     />
// // //                     <textarea
// // //                       placeholder="Description"
// // //                       value={formData.description || ""}
// // //                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// // //                       rows="2"
// // //                     />
// // //                     <input
// // //                       type="number"
// // //                       placeholder="Capacity"
// // //                       value={formData.capacity || ""}
// // //                       onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
// // //                       required
// // //                     />
// // //                   </>
// // //                 )}

// // //                 <div className="form-actions">
// // //                   <button type="submit" className="btn-save">Save</button>
// // //                   <button
// // //                     type="button"
// // //                     className="btn-cancel"
// // //                     onClick={() => setShowAddForm(false)}
// // //                   >
// // //                     Cancel
// // //                   </button>
// // //                 </div>
// // //               </form>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Inventory Items */}
// // //         <div className="inventory-items">
// // //           {renderInventoryItems().length > 0 ? (
// // //             renderInventoryItems()
// // //           ) : (
// // //             <div className="empty-state">
// // //               <p>No items in this category</p>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EventInventory;
// // import { useState, useEffect } from "react";
// // import EventInventoryService from "./EventInventoryService";
// // import InventoryCard from "./InventoryCard";
// // import "./EventInventory.css";
// // import EventCoordinationService from "../../services/EventCoordinationService";

// // const EventInventory = ({ eventId }) => {
// //   if (!eventId) return <div>No Event Selected</div>;
// //   const [inventory, setInventory] = useState(null);
// //   const [activeTab, setActiveTab] = useState("room");
// //   const [showAddForm, setShowAddForm] = useState(false);
// //   const [formType, setFormType] = useState("room");
// //   const [formData, setFormData] = useState({});

// //   useEffect(() => {
// //     loadInventory();
// //   }, [eventId]);

// //   const loadInventory = async () => {
// //   try {
// //     let inv;

// //     // ✅ Demo event check
// //     if (eventId.startsWith("demo-")) {
// //       inv = EventCoordinationService.demoEvents.find(e => e.id === eventId)?.additionalFields?.inventory || {
// //         rooms: [],
// //         transport: [],
// //         dining: [],
// //         activities: []
// //       };
// //     } else {
// //       // ✅ Real event → fetch from backend
// //       inv = await EventInventoryService.getInventory(eventId);
// //     }

// //     setInventory(inv);
// //   } catch (error) {
// //     console.error("Inventory load error:", error);
// //   }
// // };

// //   const handleAddItem = async (e) => {
// //     e.preventDefault();

// //     try {
// //   if (eventId.startsWith("demo-")) {
// //     // Demo event → update demoEvents directly
// //     const demoEvent = EventCoordinationService.demoEvents.find(e => e.id === eventId);
// //     if (!demoEvent.additionalFields) demoEvent.additionalFields = {};
// //     if (!demoEvent.additionalFields.inventory) {
// //       demoEvent.additionalFields.inventory = {
// //         rooms: [],
// //         transport: [],
// //         dining: [],
// //         activities: []
// //       };
// //     }

// //     const inv = demoEvent.additionalFields.inventory;

// //     if (formType === "room") {
// //       const room = { id: Date.now(), type: formData.type, quantity: parseInt(formData.quantity), booked: 0, available: parseInt(formData.quantity) };
// //       inv.rooms.push(room);
// //     }

// //     if (formType === "transport") {
// //       const transport = { id: Date.now(), type: formData.type, capacity: parseInt(formData.capacity), reserved: 0, available: parseInt(formData.capacity) };
// //       inv.transport.push(transport);
// //     }

// //     if (formType === "dining") {
// //       const dining = { id: Date.now(), mealType: formData.mealType, capacity: parseInt(formData.capacity), booked: 0, available: parseInt(formData.capacity) };
// //       inv.dining.push(dining);
// //     }

// //     if (formType === "activity") {
// //       const activity = { id: Date.now(), name: formData.name, capacity: parseInt(formData.capacity), registered: 0, available: parseInt(formData.capacity) };
// //       inv.activities.push(activity);
// //     }

// //     setInventory({ ...inv }); // Update state
// //   } else {
// //     // Real event → use existing EventInventoryService
// //     if (formType === "room") {
// //       await EventInventoryService.addRoom(eventId, { type: formData.type, quantity: parseInt(formData.quantity) });
// //     }
// //     if (formType === "transport") {
// //       await EventInventoryService.addTransport(eventId, { type: formData.type, capacity: parseInt(formData.capacity), location: formData.location });
// //     }
// //     if (formType === "dining") {
// //       await EventInventoryService.addDining(eventId, { mealType: formData.mealType, capacity: parseInt(formData.capacity) });
// //     }
// //     if (formType === "activity") {
// //       await EventInventoryService.addActivity(eventId, { name: formData.name, capacity: parseInt(formData.capacity) });
// //     }
// //   }

// //   setFormData({});
// //   setShowAddForm(false);
// //   loadInventory();
// // } catch (error) {
// //   alert(error.message);
// // }
// //   };

// //   const handleDelete = async (itemId) => {
// //     try {
// //   if (eventId.startsWith("demo-")) {
// //     const demoEvent = EventCoordinationService.demoEvents.find(e => e.id === eventId);
// //     const inv = demoEvent.additionalFields.inventory;

// //     const typeKey = activeTab === "room" ? "rooms" :
// //                     activeTab === "transport" ? "transport" :
// //                     activeTab === "dining" ? "dining" : "activities";

// //     demoEvent.additionalFields.inventory[typeKey] = inv[typeKey].filter(i => i.id !== itemId);

// //     setInventory({ ...demoEvent.additionalFields.inventory });
// //   } else {
// //     // Real event
// //     await EventInventoryService.deleteItem(
// //       eventId,
// //       activeTab === "room" ? "rooms" :
// //       activeTab === "transport" ? "transport" :
// //       activeTab === "dining" ? "dining" : "activities",
// //       itemId
// //     );
// //   }

// //   loadInventory();
// // } catch (error) {
// //   alert(error.message);
// // }
// //   };

// //   const renderItems = () => {
// //     if (!inventory) return null;

// //     let items = [];

// //     if (activeTab === "room") items = inventory.rooms || [];
// //     if (activeTab === "transport") items = inventory.transport || [];
// //     if (activeTab === "dining") items = inventory.dining || [];
// //     if (activeTab === "activity") items = inventory.activities || [];

// //     if (items.length === 0) {
// //       return <p>No items available</p>;
// //     }

// //     return items.map((item) => (
// //       <InventoryCard
// //         key={item.id}
// //         item={item}
// //         type={activeTab}
// //         onDelete={() => handleDelete(item.id)}
// //       />
// //     ));
// //   };

// //   return (
// //     <div className="event-inventory-container">
// //       <h1>Event Inventory</h1>

// //       <div className="tab-buttons">
// //         <button onClick={() => setActiveTab("room")}>Rooms</button>
// //         <button onClick={() => setActiveTab("transport")}>Transport</button>
// //         <button onClick={() => setActiveTab("dining")}>Dining</button>
// //         <button onClick={() => setActiveTab("activity")}>Activities</button>
// //       </div>

// //       <button
// //         onClick={() => {
// //           setFormType(activeTab);
// //           setShowAddForm(true);
// //         }}
// //       >
// //         Add Item
// //       </button>

// //       {showAddForm && (
// //         <form onSubmit={handleAddItem}>
// //           {formType === "room" && (
// //             <>
// //               <input
// //                 placeholder="Room Type"
// //                 value={formData.type || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, type: e.target.value })
// //                 }
// //                 required
// //               />
// //               <input
// //                 type="number"
// //                 placeholder="Quantity"
// //                 value={formData.quantity || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, quantity: e.target.value })
// //                 }
// //                 required
// //               />
// //             </>
// //           )}

// //           {formType === "transport" && (
// //             <>
// //               <input
// //                 placeholder="Transport Type"
// //                 value={formData.type || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, type: e.target.value })
// //                 }
// //                 required
// //               />
// //               <input
// //                 type="number"
// //                 placeholder="Capacity"
// //                 value={formData.capacity || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, capacity: e.target.value })
// //                 }
// //                 required
// //               />
// //             </>
// //           )}

// //           {formType === "dining" && (
// //             <>
// //               <input
// //                 placeholder="Meal Type"
// //                 value={formData.mealType || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, mealType: e.target.value })
// //                 }
// //                 required
// //               />
// //               <input
// //                 type="number"
// //                 placeholder="Capacity"
// //                 value={formData.capacity || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, capacity: e.target.value })
// //                 }
// //                 required
// //               />
// //             </>
// //           )}

// //           {formType === "activity" && (
// //             <>
// //               <input
// //                 placeholder="Activity Name"
// //                 value={formData.name || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, name: e.target.value })
// //                 }
// //                 required
// //               />
// //               <input
// //                 type="number"
// //                 placeholder="Capacity"
// //                 value={formData.capacity || ""}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, capacity: e.target.value })
// //                 }
// //                 required
// //               />
// //             </>
// //           )}

// //           <button type="submit">Save</button>
// //           <button type="button" onClick={() => setShowAddForm(false)}>
// //             Cancel
// //           </button>
// //         </form>
// //       )}

// //       <div className="inventory-list">{renderItems()}</div>
// //     </div>
// //   );
// // };

// // export default EventInventory;
// import { useState, useEffect } from "react";
// import EventInventoryService from "./EventInventoryService";
// import InventoryCard from "./InventoryCard";
// import "./EventInventory.css";
// import EventCoordinationService from "../../services/EventCoordinationService";
// import ResourceAllocationEngine from "./ResourceAllocationEngine";

// const EventInventory = ({ eventId }) => {
//   if (!eventId) return <div>No Event Selected</div>;

//   const [inventory, setInventory] = useState(null);
//   const [activeTab, setActiveTab] = useState("room");
//   const [summary, setSummary] = useState(null);
//   const [occupancy, setOccupancy] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [recommendations, setRecommendations] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formType, setFormType] = useState("room");
//   const [formData, setFormData] = useState({});

//   // Load inventory whenever eventId changes
//   useEffect(() => {
//     loadInventory();
//   }, [eventId]);

//   const loadInventory = async () => {
//     try {
//       let inv;

//       // Demo event
//       if (eventId.startsWith("demo-")) {
//   const demoEvent = EventCoordinationService.demoEvents.find(e => e.id === eventId);
//   if (!demoEvent.inventory) demoEvent.inventory = { rooms: [], transport: [], dining: [], activities: [] };
//   inv = demoEvent.inventory;
// } else {
//         // Real event → fetch from backend
//         inv = await EventInventoryService.getInventory(eventId);
//       }

//       setInventory(inv);
//       updateSummary(inv);
//       updateOccupancy(inv);
//       updateAlerts(inv);
//       loadRecommendations();
//     } catch (error) {
//       console.error("Inventory load error:", error);
//     }
//   };

//   const updateSummary = (inv) => {
//   if (eventId.startsWith("demo-")) {
//     // Demo: calculate summary locally
//     const sum = {
//       rooms: inv.rooms?.reduce((acc, r) => acc + r.booked, 0) || 0,
//       roomsTotal: inv.rooms?.reduce((acc, r) => acc + r.quantity, 0) || 0,
//       transport: inv.transport?.reduce((acc, t) => acc + t.reserved, 0) || 0,
//       transportTotal: inv.transport?.reduce((acc, t) => acc + t.capacity, 0) || 0,
//       dining: inv.dining?.reduce((acc, d) => acc + d.booked, 0) || 0,
//       diningTotal: inv.dining?.reduce((acc, d) => acc + d.capacity, 0) || 0,
//       activities: inv.activities?.reduce((acc, a) => acc + a.registered, 0) || 0,
//       activitiesTotal: inv.activities?.reduce((acc, a) => acc + a.capacity, 0) || 0,
//     };
//     setSummary(sum);
//   } else {
//     const sum = EventInventoryService.getInventorySummary(eventId);
//     setSummary(sum);
//   }
// };

//   const updateOccupancy = (inv) => {
//   if (eventId.startsWith("demo-")) {
//     const occ = {
//       room: inv.rooms?.reduce((acc, r) => acc + r.booked, 0) / (inv.rooms?.reduce((acc, r) => acc + r.quantity, 0) || 1) || 0,
//       dining: inv.dining?.reduce((acc, d) => acc + d.booked, 0) / (inv.dining?.reduce((acc, d) => acc + d.capacity, 0) || 1) || 0,
//       activity: inv.activities?.reduce((acc, a) => acc + a.registered, 0) / (inv.activities?.reduce((acc, a) => acc + a.capacity, 0) || 1) || 0,
//     };
//     setOccupancy(occ);
//   } else {
//     const occ = EventInventoryService.getOccupancyRates(eventId);
//     setOccupancy(occ);
//   }
// };

//   const updateAlerts = (inv) => {
//     const al = EventInventoryService.getAvailabilityAlerts(eventId);
//     setAlerts(al);
//   };

//   const loadRecommendations = () => {
//     const recs = ResourceAllocationEngine.getAllocationRecommendations(eventId);
//     setRecommendations(recs);
//   };

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     try {
//       if (eventId.startsWith("demo-")) {
//         const demoEvent = EventCoordinationService.demoEvents.find(
//           (e) => e.id === eventId
//         );
//         if (!demoEvent.additionalFields) demoEvent.additionalFields = {};
//         if (!demoEvent.additionalFields.inventory)
//           demoEvent.additionalFields.inventory = {
//             rooms: [],
//             transport: [],
//             dining: [],
//             activities: [],
//           };

//         const inv = demoEvent.additionalFields.inventory;

//         if (formType === "room") {
//           const room = {
//             id: Date.now(),
//             type: formData.type,
//             quantity: parseInt(formData.quantity),
//             booked: 0,
//             available: parseInt(formData.quantity),
//           };
//           inv.rooms.push(room);
//         }

//         if (formType === "transport") {
//           const transport = {
//             id: Date.now(),
//             type: formData.type,
//             capacity: parseInt(formData.capacity),
//             reserved: 0,
//             available: parseInt(formData.capacity),
//             location: formData.location || "",
//           };
//           inv.transport.push(transport);
//         }

//         if (formType === "dining") {
//           const dining = {
//             id: Date.now(),
//             mealType: formData.mealType,
//             capacity: parseInt(formData.capacity),
//             booked: 0,
//             available: parseInt(formData.capacity),
//           };
//           inv.dining.push(dining);
//         }

//         if (formType === "activity") {
//           const activity = {
//             id: Date.now(),
//             name: formData.name,
//             capacity: parseInt(formData.capacity),
//             registered: 0,
//             available: parseInt(formData.capacity),
//           };
//           inv.activities.push(activity);
//         }

//         setInventory({ ...inv });
//       } else {
//         // Real event
//         if (formType === "room") {
//           await EventInventoryService.addRoom(eventId, {
//             type: formData.type,
//             quantity: parseInt(formData.quantity),
//           });
//         }
//         if (formType === "transport") {
//           await EventInventoryService.addTransport(eventId, {
//             type: formData.type,
//             capacity: parseInt(formData.capacity),
//             location: formData.location,
//           });
//         }
//         if (formType === "dining") {
//           await EventInventoryService.addDining(eventId, {
//             mealType: formData.mealType,
//             capacity: parseInt(formData.capacity),
//           });
//         }
//         if (formType === "activity") {
//           await EventInventoryService.addActivity(eventId, {
//             name: formData.name,
//             capacity: parseInt(formData.capacity),
//           });
//         }
//       }

//       setFormData({});
//       setShowAddForm(false);
//       loadInventory();
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleDelete = async (itemId) => {
//     try {
//       if (eventId.startsWith("demo-")) {
//         const demoEvent = EventCoordinationService.demoEvents.find(
//           (e) => e.id === eventId
//         );
//         const inv = demoEvent.additionalFields.inventory;
//         const typeKey =
//           activeTab === "room"
//             ? "rooms"
//             : activeTab === "transport"
//             ? "transport"
//             : activeTab === "dining"
//             ? "dining"
//             : "activities";
//         demoEvent.additionalFields.inventory[typeKey] = inv[typeKey].filter(
//           (i) => i.id !== itemId
//         );
//         setInventory({ ...demoEvent.additionalFields.inventory });
//       } else {
//         await EventInventoryService.deleteItem(
//           eventId,
//           activeTab === "room"
//             ? "rooms"
//             : activeTab === "transport"
//             ? "transport"
//             : activeTab === "dining"
//             ? "dining"
//             : "activities",
//           itemId
//         );
//       }
//       loadInventory();
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const renderInventoryItems = () => {
//     if (!inventory) return null;
//     let items = [];

//     if (activeTab === "room") items = inventory.rooms || [];
//     if (activeTab === "transport") items = inventory.transport || [];
//     if (activeTab === "dining") items = inventory.dining || [];
//     if (activeTab === "activity") items = inventory.activities || [];

//     return items.length > 0
//       ? items.map((item) => (
//           <InventoryCard
//             key={item.id}
//             item={item}
//             type={activeTab}
//             onDelete={() => handleDelete(item.id)}
//           />
//         ))
//       : <p>No items in this category</p>;
//   };

//   return (
//     <div className="event-inventory-container fade-in">
//       <div className="inventory-header">
//         <h1>📦 Event Inventory Management</h1>
//       </div>

//       {/* Tabs */}
//       <div className="tab-buttons">
//         <button
//           className={activeTab === "room" ? "active" : ""}
//           onClick={() => setActiveTab("room")}
//         >
//           🏨 Rooms
//         </button>
//         <button
//           className={activeTab === "transport" ? "active" : ""}
//           onClick={() => setActiveTab("transport")}
//         >
//           🚗 Transport
//         </button>
//         <button
//           className={activeTab === "dining" ? "active" : ""}
//           onClick={() => setActiveTab("dining")}
//         >
//           🍽️ Dining
//         </button>
//         <button
//           className={activeTab === "activity" ? "active" : ""}
//           onClick={() => setActiveTab("activity")}
//         >
//           🎯 Activities
//         </button>
//       </div>

//       {/* Add Item */}
//       <button
//         onClick={() => {
//           setFormType(activeTab);
//           setShowAddForm(true);
//         }}
//       >
//         ➕ Add Item
//       </button>

//       {showAddForm && (
//         <form onSubmit={handleAddItem} className="add-form">
//           {formType === "room" && (
//             <>
//               <input
//                 placeholder="Room Type"
//                 value={formData.type || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, type: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Quantity"
//                 value={formData.quantity || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, quantity: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}

//           {formType === "transport" && (
//             <>
//               <input
//                 placeholder="Transport Type"
//                 value={formData.type || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, type: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Capacity"
//                 value={formData.capacity || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, capacity: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}

//           {formType === "dining" && (
//             <>
//               <input
//                 placeholder="Meal Type"
//                 value={formData.mealType || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, mealType: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Capacity"
//                 value={formData.capacity || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, capacity: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}

//           {formType === "activity" && (
//             <>
//               <input
//                 placeholder="Activity Name"
//                 value={formData.name || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Capacity"
//                 value={formData.capacity || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, capacity: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}

//           <button type="submit">Save</button>
//           <button type="button" onClick={() => setShowAddForm(false)}>
//             Cancel
//           </button>
//         </form>
//       )}
//       {/* Summary / Occupancy / Alerts */}
// {summary && occupancy && (
//   <div className="inventory-summary">
//     <h2>📊 Summary</h2>
//     <p>Rooms: {summary.rooms} / {summary.roomsTotal}</p>
//     <p>Transport: {summary.transport} / {summary.transportTotal}</p>
//     <p>Dining: {summary.dining} / {summary.diningTotal}</p>
//     <p>Activities: {summary.activities} / {summary.activitiesTotal}</p>

//     <h2>📈 Occupancy</h2>
//     <p>Rooms: {(occupancy.room * 100).toFixed(0)}%</p>
//     <p>Dining: {(occupancy.dining * 100).toFixed(0)}%</p>
//     <p>Activities: {(occupancy.activity * 100).toFixed(0)}%</p>

//     {alerts.length > 0 && (
//       <>
//         <h2>⚠️ Alerts</h2>
//         <ul>
//           {alerts.map((a, idx) => (
//             <li key={idx}>{a}</li>
//           ))}
//         </ul>
//       </>
//     )}
//   </div>
// )}

//       {/* Inventory Items */}
//       <div className="inventory-list">{renderInventoryItems()}</div>
//     </div>
//   );
// };

// export default EventInventory;
import { useState, useEffect } from "react";
import EventInventoryService from "./EventInventoryService";
import InventoryCard from "./InventoryCard";
import "./EventInventory.css";
import EventCoordinationService from "../../services/EventCoordinationService";
import ResourceAllocationEngine from "./ResourceAllocationEngine";

const EventInventory = ({ eventId }) => {
  if (!eventId) return <div>No Event Selected</div>;

  const [inventory, setInventory] = useState(null);
  const [activeTab, setActiveTab] = useState("room");
  const [summary, setSummary] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState("room");
  const [formData, setFormData] = useState({});
  const DEMO_INVENTORY = {
  rooms: [
    {
      id: "room-1",
      type: "Deluxe",
      quantity: 22,
      booked: 9,
      available: 13
    }
  ],
  transport: [
    {
      id: "transport-1",
      type: "Bus",
      capacity: 42,
      reserved: 8,
      available: 34
    }
  ],
  dining: [
    {
      id: "dining-1",
      mealType: "Lunch",
      capacity: 300,
      booked: 202,
      available: 98,
      dietaryOptions: ["veg", "vegan"]
    }
  ],
  activities: [
    {
      id: "activity-1",
      name: "Sightseeing Tour",
      capacity: 40,
      registered: 38,
      available: 2,
      time: "10:00 AM",
      duration: "3 Hours"
    },
    {
      id: "activity-2",
      name: "Adventure Sports",
      capacity: 25,
      registered: 24,
      available: 1,
      time: "2:00 PM",
      duration: "4 Hours"
    }
  ]
};

  useEffect(() => {
    loadInventory();
  }, [eventId]);

  const loadInventory = async () => {
    try {
      let inv;
if (eventId.startsWith("demo-")) {
      inv = DEMO_INVENTORY; // ✅ THIS WAS MISSING
    } else {
      inv = await EventInventoryService.getInventory(eventId);
    }

    setInventory(inv);
    updateSummary(inv);
    updateOccupancy(inv);
    updateAlerts(inv);
    loadRecommendations();
  }
    //   if (eventId.startsWith("demo-")) {
    //     // Demo event → use static data
    //     const demoEvent = EventCoordinationService.demoEvents.find(e => e.id === eventId);
    //     if (!demoEvent.inventory) demoEvent.inventory = { rooms: [], transport: [], dining: [], activities: [] };
    //     inv = demoEvent.inventory;
    //   } else {
    //     // Real event → only create empty structure, no fake items
    //     //inv = { rooms: [], transport: [], dining: [], activities: [] };
    //     inv = await EventInventoryService.getInventory(eventId);

    //   }

    //   setInventory(inv);
    //   updateSummary(inv);
    //   updateOccupancy(inv);
    //   updateAlerts(inv);
    //   loadRecommendations();}
     catch (error) {
      console.error("Inventory load error:", error);
    }
  };

  const updateSummary = (inv) => {
    if (!inv) return;

    const sum = {
      rooms: inv.rooms?.reduce((acc, r) => acc + (r.booked || 0), 0),
      roomsTotal: inv.rooms?.reduce((acc, r) => acc + (r.quantity || 0), 0),
      transport: inv.transport?.reduce((acc, t) => acc + (t.reserved || 0), 0),
      transportTotal: inv.transport?.reduce((acc, t) => acc + (t.capacity || 0), 0),
      dining: inv.dining?.reduce((acc, d) => acc + (d.booked || 0), 0),
      diningTotal: inv.dining?.reduce((acc, d) => acc + (d.capacity || 0), 0),
      activities: inv.activities?.reduce((acc, a) => acc + (a.registered || 0), 0),
      activitiesTotal: inv.activities?.reduce((acc, a) => acc + (a.capacity || 0), 0),
    };
    setSummary(sum);
  };

  const updateOccupancy = (inv) => {
    if (!inv) return;
    const occ = {
      room: inv.rooms?.length ? Math.round((inv.rooms.reduce((acc, r) => acc + (r.booked || 0), 0) / inv.rooms.reduce((acc, r) => acc + (r.quantity || 1), 0)) * 100) : 0,
      dining: inv.dining?.length ? Math.round((inv.dining.reduce((acc, d) => acc + (d.booked || 0), 0) / inv.dining.reduce((acc, d) => acc + (d.capacity || 1), 0)) * 100) : 0,
      activity: inv.activities?.length ? Math.round((inv.activities.reduce((acc, a) => acc + (a.registered || 0), 0) / inv.activities.reduce((acc, a) => acc + (a.capacity || 1), 0)) * 100) : 0
    };
    setOccupancy(occ);
  };

  const updateAlerts = (inv) => {
    // For demo, show availability alerts if any item is fully booked
    const newAlerts = [];
    inv?.rooms?.forEach(r => {
      if (r.available === 0) newAlerts.push({ id: `room-${r.id}`, type: "room", title: "Room Full", message: `${r.type} is fully booked.` });
    });
    inv?.transport?.forEach(t => {
      if (t.available === 0) newAlerts.push({ id: `transport-${t.id}`, type: "transport", title: "Transport Full", message: `${t.type} is fully reserved.` });
    });
    inv?.dining?.forEach(d => {
      if (d.available === 0) newAlerts.push({ id: `dining-${d.id}`, type: "dining", title: "Dining Full", message: `${d.mealType} is fully booked.` });
    });
    inv?.activities?.forEach(a => {
      if (a.available === 0) newAlerts.push({ id: `activity-${a.id}`, type: "activity", title: "Activity Full", message: `${a.name} is fully booked.` });
    });
    setAlerts(newAlerts);
  };

  const loadRecommendations = async () => {
  try {
    const recs = await ResourceAllocationEngine.getAllocationRecommendations(eventId);

    const resolved = {
      ...recs,
      rooms: {
        ...recs.rooms,
        suggestions: await recs.rooms.suggestions,
        status: "ready"
      },
      dining: {
        ...recs.dining,
        suggestions: await recs.dining.suggestions,
        status: "ready"
      },
      activities: {
        ...recs.activities,
        suggestions: await recs.activities.suggestions,
        status: "ready"
      },
      transport: {
        ...recs.transport,
        suggestions: recs.transport.suggestions,
        status: "ready"
      }
    };

    console.log("✅ RESOLVED recommendations =", resolved);

    setRecommendations(resolved);
  } catch (err) {
    console.error("❌ Recommendation load failed", err);
  }
};
const applyRecommendations = (type) => {
  if (!recommendations || !inventory) return;

  const rec = recommendations[type];
  if (!rec || !rec.suggestions || rec.suggestions.length === 0) return;

  let updatedInventory = { ...inventory };

  if (type === "rooms") {
    updatedInventory.rooms = updatedInventory.rooms.map(r => ({
      ...r,
      booked: r.booked + 1,
      available: Math.max(0, r.available - 1)
    }));
  }

  if (type === "dining") {
    updatedInventory.dining = updatedInventory.dining.map(d => ({
      ...d,
      booked: d.booked + 1,
      available: Math.max(0, d.available - 1)
    }));
  }

  if (type === "activities") {
    updatedInventory.activities = updatedInventory.activities.map(a => ({
      ...a,
      registered: a.registered + 1,
      available: Math.max(0, a.available - 1)
    }));
  }

  if (type === "transport") {
    updatedInventory.transport = updatedInventory.transport.map(t => ({
      ...t,
      reserved: t.reserved + 1,
      available: Math.max(0, t.available - 1)
    }));
  }

  // 🔥 THIS is what made it work earlier
  setInventory(updatedInventory);
  updateSummary(updatedInventory);
  updateOccupancy(updatedInventory);
  updateAlerts(updatedInventory);

  console.log(`✅ Applied ${type} recommendations`);
};

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!inventory) return;

    const newInventory = { ...inventory };
    const newItem = { id: Date.now(), capacity: parseInt(formData.capacity) || 0, booked: 0, available: parseInt(formData.capacity) || 0 };

    if (formType === "room") newInventory.rooms.push({ ...newItem, type: formData.type || "Standard" });
    if (formType === "transport") newInventory.transport.push({ ...newItem, type: formData.type || "Vehicle", location: formData.location || "" });
    if (formType === "dining") newInventory.dining.push({ ...newItem, mealType: formData.mealType || "Meal" });
    if (formType === "activity") newInventory.activities.push({ ...newItem, name: formData.name || "Activity" });

    setInventory(newInventory);
    setFormData({});
    setShowAddForm(false);
  };

  const handleDelete = (itemId) => {
    if (!inventory) return;

    const newInventory = { ...inventory };
    const key = activeTab === "room" ? "rooms" : activeTab === "transport" ? "transport" : activeTab === "dining" ? "dining" : "activities";
    newInventory[key] = newInventory[key].filter(i => i.id !== itemId);
    setInventory(newInventory);
  };
  const handleUpdate = ({ itemId, change, type }) => {
  setInventory(prev => {
    if (!prev) return prev;

    const key =
      type === "room"
        ? "rooms"
        : type === "transport"
        ? "transport"
        : type === "dining"
        ? "dining"
        : "activities";

    return {
      ...prev,
      [key]: prev[key].map(item =>
        item.id === itemId
          ? {
              ...item,
              booked: Math.max(0, (item.booked || 0) - change),
              available: Math.max(0, (item.available || 0) + change)
            }
          : item
      )
    };
  });
};

  const renderItems = () => {
    if (!inventory) return null;

    const key = activeTab === "room" ? "rooms" : activeTab === "transport" ? "transport" : activeTab === "dining" ? "dining" : "activities";
    const items = inventory[key] || [];

    if (!items.length) return <div className="empty-state">No items in this category</div>;

    return items.map(item => (
      <InventoryCard key={item.id} item={item} type={activeTab} onDelete={() => handleDelete(item.id)} onUpdate={handleUpdate} />  // ✅ ADD THIS LINE 
    ));
  };
 // 🔍 DEBUG — ADD THIS HERE
  console.log("🤖 recommendations =", recommendations);

  return (
    <div className="event-inventory-container fade-in">
      <div className="inventory-header">
        <h1>📦 Event Inventory Management</h1>
        <p>Real-time tracking and allocation of event resources</p>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">{alert.message}</div>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="summary-section">
          <h2>📊 Inventory Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">🏨</div>
              <div className="summary-label">Rooms</div>
              <div className="summary-value">{summary.rooms}/{summary.roomsTotal}</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🚗</div>
              <div className="summary-label">Transport</div>
              <div className="summary-value">{summary.transport}/{summary.transportTotal}</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🍽️</div>
              <div className="summary-label">Dining</div>
              <div className="summary-value">{summary.dining}/{summary.diningTotal}</div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-label">Activities</div>
              <div className="summary-value">{summary.activities}/{summary.activitiesTotal}</div>
            </div>
          </div>
        </div>
      )}
      {occupancy && (
  <div className="occupancy-section">
    <h2>📈 Occupancy Rates</h2>

    <div className="occupancy-grid">
      <div className="occupancy-item">
        <div className="occupancy-label">Room Occupancy</div>
        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{ width: `${occupancy.room}%` }}
          />
        </div>
        <div className="occupancy-percent">{occupancy.room}%</div>
      </div>

      <div className="occupancy-item">
        <div className="occupancy-label">Dining Occupancy</div>
        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{ width: `${occupancy.dining}%` }}
          />
        </div>
        <div className="occupancy-percent">{occupancy.dining}%</div>
      </div>

      <div className="occupancy-item">
        <div className="occupancy-label">Activity Participation</div>
        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{ width: `${occupancy.activity}%` }}
          />
        </div>
        <div className="occupancy-percent">{occupancy.activity}%</div>
      </div>
    </div>
  </div>
)}
{recommendations && (
  <div className="recommendations-section">
    <h2>🤖 Automated Resource Allocation Recommendations</h2>

    <div className="recommendations-grid">
      {recommendations.rooms?.status === "ready" && (
        <div className="rec-card">
          <h3>🏨 Room Assignments</h3>
          <p>{recommendations.rooms.suggestions.length} assignments recommended</p>
          <button
  className="btn-apply"
  onClick={() => applyRecommendations("rooms")}
>
  Apply Recommendations
</button>
        </div>
      )}

      {recommendations.dining?.status === "ready" && (
        <div className="rec-card">
          <h3>🍽️ Dining Allocation</h3>
          <p>{recommendations.dining.suggestions.length} options available</p>
          <button
  className="btn-apply"
  onClick={() => applyRecommendations("dining")}
>
  Apply Recommendations
</button>
        </div>
      )}

      {recommendations.activities?.status === "ready" && (
        <div className="rec-card">
          <h3>🎯 Activity Suggestions</h3>
          <p>{recommendations.activities.suggestions.length} activities available</p>
          <button
  className="btn-apply"
  onClick={() => applyRecommendations("activities")}
>
  Apply Recommendations
</button>
        </div>
      )}

      {recommendations.transport?.status === "ready" && (
        <div className="rec-card">
          <h3>🚗 Transport Options</h3>
          <p>{recommendations.transport.suggestions.length} options available</p>
          <button
  className="btn-apply"
  onClick={() => applyRecommendations("transport")}
>
  Apply Recommendations
</button>
        </div>
      )}
    </div>
  </div>
)}

      <div className="inventory-controls">
        <div className="tab-buttons">
          <button className={activeTab === "room" ? "active" : ""} onClick={() => setActiveTab("room")}>🏨 Rooms</button>
          <button className={activeTab === "transport" ? "active" : ""} onClick={() => setActiveTab("transport")}>🚗 Transport</button>
          <button className={activeTab === "dining" ? "active" : ""} onClick={() => setActiveTab("dining")}>🍽️ Dining</button>
          <button className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>🎯 Activities</button>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => { setFormType(activeTab); setShowAddForm(true); }}>➕ Add Item</button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-modal">
          <div className="form-container">
            <h3>Add {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
            <form onSubmit={handleAddItem}>
              {formType === "room" && (
                <>
                  <input placeholder="Room Type" value={formData.type || ""} onChange={e => setFormData({ ...formData, type: e.target.value })} required />
                  <input type="number" placeholder="Quantity" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                </>
              )}
              {formType === "transport" && (
                <>
                  <input placeholder="Transport Type" value={formData.type || ""} onChange={e => setFormData({ ...formData, type: e.target.value })} required />
                  <input type="number" placeholder="Capacity" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                  <input placeholder="Location" value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </>
              )}
              {formType === "dining" && (
                <>
                  <input placeholder="Meal Type" value={formData.mealType || ""} onChange={e => setFormData({ ...formData, mealType: e.target.value })} required />
                  <input type="number" placeholder="Capacity" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                </>
              )}
              {formType === "activity" && (
                <>
                  <input placeholder="Activity Name" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  <input type="number" placeholder="Capacity" value={formData.capacity || ""} onChange={e => setFormData({ ...formData, capacity: e.target.value })} required />
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="inventory-items">{renderItems()}</div>
    </div>
  );
};


export default EventInventory;