const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
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
