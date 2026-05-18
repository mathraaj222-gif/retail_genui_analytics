// Detect the host dynamically to support network-based development
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Force 127.0.0.1 for localhost to avoid IPv6 issues on Windows
    return host === "localhost" || host === "127.0.0.1" ? "http://127.0.0.1:8000" : `http://${host}:8000`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};


const BASE_URL = getBaseUrl();

/**
 * Generic fetcher for analytics endpoints
 */
export async function fetchAnalytics(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics data from ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return null;
  }
}

export async function getTopProducts() {
  return fetchAnalytics("/analytics/descriptive/top-products");
}

export async function getCampaignPerformance() {
  return fetchAnalytics("/analytics/descriptive/campaign-performance");
}
