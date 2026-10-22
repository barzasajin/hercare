const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Cycles
export const getCycles = () => request("/cycles");
export const createCycle = (data) => request("/cycles", { method: "POST", body: JSON.stringify(data) });
export const deleteCycle = (id) => request(`/cycles/${id}`, { method: "DELETE" });
export const getCyclePrediction = () => request("/cycles/prediction");

// Health Logs
export const getHealthLogs = (limit = 50) => request(`/health-log?limit=${limit}`);
export const getTodayLog = () => request("/health-log/today");
export const saveHealthLog = (data) => request("/health-log", { method: "POST", body: JSON.stringify(data) });
export const deleteHealthLog = (id) => request(`/health-log/${id}`, { method: "DELETE" });

// AI Intelligence
export const getAIInsights = () => request("/ai/insights");
export const getAIPatterns = () => request("/ai/patterns");
export const getAIChanges = () => request("/ai/changes");
export const getAIRecommendations = () => request("/ai/recommendations");

// Pregnancy
export const getPregnancyProfile = () => request("/pregnancy");
export const updatePregnancyProfile = (data) => request("/pregnancy", { method: "POST", body: JSON.stringify(data) });

// Demo Management
export const getDemoStatus = () => request("/demo/status");
export const seedDemoData = () => request("/demo/seed", { method: "POST" });
export const resetDemoData = () => request("/demo/reset", { method: "POST" });
