const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`API request failed: ${error.message}. Using mock data.`);
    // Return mock data when backend is unavailable
    return getMockData(path);
  }
};

// Mock data for fallback when backend is unavailable
const getMockData = (path) => {
  const mockGuests = [
    {
      _id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 9876543201",
      city: "Mumbai",
      interests: ["Technology", "Travel", "Photography"],
      personality: "Extrovert",
      dietary: "Vegetarian",
      emergencyContact: "+91 9876543202"
    },
    {
      _id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 9876543203",
      city: "Delhi",
      interests: ["Music", "Art", "Food"],
      personality: "Introvert",
      dietary: "Vegan",
      emergencyContact: "+91 9876543204"
    },
    {
      _id: "3",
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 9876543205",
      city: "Bangalore",
      interests: ["Sports", "Movies", "Gaming"],
      personality: "Extrovert",
      dietary: "Non-Vegetarian",
      emergencyContact: "+91 9876543206"
    }
  ];

  if (path === "/api/guests") {
    return { success: true, data: mockGuests };
  }

  if (path.startsWith("/api/guests/") && path.includes("social-intelligence")) {
    return {
      success: true,
      data: {
        socialEngagement: {
          interactionScores: [
            { guestId: "1", score: 85, style: "Initiator" },
            { guestId: "2", score: 72, style: "Collaborator" },
            { guestId: "3", score: 90, style: "Initiator" }
          ],
          riskFactors: ["Language barriers detected", "Personality mismatches"]
        },
        networking: {
          groups: [
            { id: "g1", members: ["1", "3"], interests: ["Technology", "Sports"], confidence: 0.85 }
          ]
        },
        pairings: {
          compatiblePairs: [
            { guest1: "1", guest2: "3", compatibility: "Excellent", reasons: ["Shared interests", "Similar energy levels"] }
          ]
        },
        emotionalIntelligence: {
          emotionalStates: [
            { guestId: "1", state: "Energized", energy: 8, stress: 2 },
            { guestId: "2", state: "Content", energy: 6, stress: 3 },
            { guestId: "3", state: "Excited", energy: 9, stress: 1 }
          ]
        },
        sentimentAnalysis: {
          overallSentiment: "Positive",
          trend: "Improving",
          issues: []
        }
      }
    };
  }

  return { success: true, data: [] };
};

export const getGuests = () => request("/api/guests");

export const createGuest = (guest) =>
  request("/api/guests", {
    method: "POST",
    body: JSON.stringify(guest)
  });

export const updateGuest = (id, guest) =>
  request(`/api/guests/${id}`, {
    method: "PUT",
    body: JSON.stringify(guest)
  });

export const deleteGuest = (id) =>
  request(`/api/guests/${id}`, {
    method: "DELETE"
  });

export const getInsights = () => request("/api/insights");

export const getSocialIntelligence = (payload = {}) => {
  let token = localStorage.getItem("token");

  if (!token) {
    try {
      const authUser = JSON.parse(localStorage.getItem("auth_user") || "null");
      token = authUser?.token || null;
    } catch (_error) {
      token = null;
    }
  }

  return request("/api/ai/social-intelligence", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload)
  });
};
