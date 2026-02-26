import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

/* ===============================
   AXIOS CONFIG WITH AUTH
================================ */
const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.request.use((config) => {
  const authUser = JSON.parse(localStorage.getItem("auth_user"));
const token = authUser?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const DEMO_INVENTORY = {
  eventName: "Demo Event",
  rooms: [
    {
      id: "room-1",
      type: "Deluxe",
      capacity: 2,
      available: 5,
      accessible: false,
      highFloor: true
    },
    {
      id: "room-2",
      type: "Accessible Room",
      capacity: 2,
      available: 2,
      accessible: true,
      groundFloor: true
    }
  ],
  dining: [
    {
      id: "dining-1",
      mealType: "Lunch",
      capacity: 100,
      available: 60,
      dietaryOptions: ["veg", "vegan", "gluten-free"]
    }
  ],
  activities: [
    {
      id: "activity-1",
      name: "City Tour",
      description: "Guided city tour",
      capacity: 30,
      registered: 10,
      available: 20,
      time: "10:00 AM",
      duration: "2h"
    }
  ],
  transport: [
    {
      id: "transport-1",
      type: "Bus",
      capacity: 40,
      available: 40,
      reserved: 0
    }
  ]
};
/* ===============================
   EVENT APIs
================================ */
export const getAllEvents = async () => {
  const res = await api.get("/");
  return res.data;
};

export const getEventById = async (eventId) => {
  const res = await api.get(`/${eventId}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await api.post("/", eventData);
  return res.data;
};

/* ===============================
   INVENTORY SERVICE (REAL)
================================ */
class EventInventoryService {
  /* -----------------------------
     INITIALIZE INVENTORY
  ------------------------------ */
  static async initializeInventory(eventId) {
    const inventory = {
      rooms: [],
      transport: [],
      dining: [],
      activities: []
    };

    return await this.saveInventory(eventId, inventory);
  }

  /* -----------------------------
     GET INVENTORY FROM MONGODB
  ------------------------------ */
//  
static async getInventory(eventId) {
  // ✅ SAFETY CHECK (ADD THIS)
  if (!eventId) {
    console.warn("getInventory called without eventId");
    return {
      rooms: [],
      transport: [],
      dining: [],
      activities: []
    };
  }

  // ✅ If demo event → do NOT call backend
  if (eventId.startsWith("demo-")) {
  return DEMO_INVENTORY;
}

  // ✅ Real backend event
  const res = await api.get(`/${eventId}`);
  let inventory = res.data.data.additionalFields?.inventory;

  if (!inventory) {
    inventory = {
      rooms: [],
      transport: [],
      dining: [],
      activities: []
    };
    await this.saveInventory(eventId, inventory);
  }

  return inventory;
}


  /* -----------------------------
     SAVE INVENTORY TO MONGODB
  ------------------------------ */
  static async saveInventory(eventId, inventory) {
    const res = await api.patch(`/${eventId}`, {
      additionalFields: { inventory }
    });
    return res.data;
  }

  /* -----------------------------
     ADD ROOM
  ------------------------------ */
  static async addRoom(eventId, roomData) {
    const inventory = await this.getInventory(eventId);

    const room = {
      id: Date.now(),
      ...roomData,
      booked: 0,
      available: roomData.quantity
    };

    inventory.rooms.push(room);
    await this.saveInventory(eventId, inventory);
    return room;
  }

  static async updateRoom(eventId, roomId, change) {
    const inventory = await this.getInventory(eventId);
    const room = inventory.rooms.find(r => r.id === roomId);
    if (!room) throw new Error("Room not found");

    room.available = Math.max(0, room.available + change);
    room.booked = room.quantity - room.available;

    if (room.booked > room.quantity) {
      throw new Error("Overbooking not allowed");
    }

    await this.saveInventory(eventId, inventory);
    return room;
  }

  /* -----------------------------
     TRANSPORT
  ------------------------------ */
  static async addTransport(eventId, transportData) {
    const inventory = await this.getInventory(eventId);

    const transport = {
      id: Date.now(),
      ...transportData,
      reserved: 0,
      available: transportData.capacity
    };

    inventory.transport.push(transport);
    await this.saveInventory(eventId, inventory);
    return transport;
  }

  static async updateTransport(eventId, transportId, change) {
    const inventory = await this.getInventory(eventId);
    const transport = inventory.transport.find(t => t.id === transportId);
    if (!transport) throw new Error("Transport not found");

    transport.available = Math.max(0, transport.available + change);
    transport.reserved = transport.capacity - transport.available;

    if (transport.reserved > transport.capacity) {
      throw new Error("Overbooking not allowed");
    }

    await this.saveInventory(eventId, inventory);
    return transport;
  }

  /* -----------------------------
     DINING
  ------------------------------ */
  static async addDining(eventId, diningData) {
    const inventory = await this.getInventory(eventId);

    const dining = {
      id: Date.now(),
      ...diningData,
      booked: 0,
      available: diningData.capacity
    };

    inventory.dining.push(dining);
    await this.saveInventory(eventId, inventory);
    return dining;
  }

  static async updateDining(eventId, diningId, change) {
    const inventory = await this.getInventory(eventId);
    const dining = inventory.dining.find(d => d.id === diningId);
    if (!dining) throw new Error("Dining not found");

    dining.available = Math.max(0, dining.available + change);
    dining.booked = dining.capacity - dining.available;

    await this.saveInventory(eventId, inventory);
    return dining;
  }

  /* -----------------------------
     ACTIVITIES
  ------------------------------ */
  static async addActivity(eventId, activityData) {
    const inventory = await this.getInventory(eventId);

    const activity = {
      id: Date.now(),
      ...activityData,
      registered: 0,
      available: activityData.capacity
    };

    inventory.activities.push(activity);
    await this.saveInventory(eventId, inventory);
    return activity;
  }

  static async updateActivity(eventId, activityId, change) {
    const inventory = await this.getInventory(eventId);
    const activity = inventory.activities.find(a => a.id === activityId);
    if (!activity) throw new Error("Activity not found");

    activity.available = Math.max(0, activity.available + change);
    activity.registered = activity.capacity - activity.available;

    await this.saveInventory(eventId, inventory);
    return activity;
  }

  /* -----------------------------
     DELETE ITEM
  ------------------------------ */
  static async deleteItem(eventId, type, itemId) {
    const inventory = await this.getInventory(eventId);

    inventory[type] = inventory[type].filter(i => i.id !== itemId);
    await this.saveInventory(eventId, inventory);
    return true;
  }
  static async getEventInventory(eventId) {
  return await this.getInventory(eventId);
}
  
}

export default EventInventoryService;
