/**
 * Centralized API Service for E-Mortem
 * Communicates with FastAPI backend:
 * - On Vercel (production): Uses relative URL "" so requests target Vercel Serverless Functions (/api/*)
 * - In local dev (or if custom external VITE_API_URL specified): Uses configured endpoint
 */

const envUrl = (import.meta.env.VITE_API_URL || "").trim();
const isLocalhost = envUrl.includes("localhost") || envUrl.includes("127.0.0.1");

// If in production on Vercel and no external host is provided (or if localhost is baked in),
// default to relative "" so all /api calls hit the same Vercel host serverless functions.
const API_BASE = (import.meta.env.DEV || (envUrl && !isLocalhost))
  ? (envUrl || "http://localhost:8000")
  : "";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[E-Mortem API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Check API health
  async getHealth() {
    return request("/api/health");
  },

  // Devices endpoints
  async getDevices() {
    return request("/api/devices");
  },

  async getDevice(id) {
    return request(`/api/devices/${id}`);
  },

  async createDevice(deviceData) {
    return request("/api/devices", {
      method: "POST",
      body: JSON.stringify(deviceData),
    });
  },

  async getDeviceReports(deviceId) {
    return request(`/api/devices/${deviceId}/reports`);
  },

  // Diagnosis / Autopsy endpoint
  async diagnoseDevice(telemetryData) {
    return request("/api/diagnose", {
      method: "POST",
      body: JSON.stringify(telemetryData),
    });
  },

  // Reports endpoints
  async getReports() {
    return request("/api/reports");
  },

  async getReport(diagnosisId) {
    return request(`/api/reports/${encodeURIComponent(diagnosisId)}`);
  },

  async deleteReport(diagnosisId) {
    return request(`/api/reports/${encodeURIComponent(diagnosisId)}`, {
      method: "DELETE",
    });
  },

  // Macro Insights endpoint
  async getInsights() {
    return request("/api/insights");
  },

  // AI Assistant endpoint
  async askAssistant(message, history = [], context = null) {
    return request("/api/assistant", {
      method: "POST",
      body: JSON.stringify({ message, history, context }),
    });
  },
};

export default api;
