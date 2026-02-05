// API client for the real backend service
const API_BASE_URL = 'http://5000-ibjqy0o27yrus0bo20ia3-852cae94.manus.computer/api';

/**
 * Fetch stock chart data from the backend API
 * @param {string} symbol - Stock ticker symbol
 * @param {string} range - Time range for data
 * @param {string} interval - Data interval
 * @returns {Promise<Object>} - Chart data
 */
export async function getStockChart(symbol, range = '1y', interval = '1d') {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/chart?symbol=${symbol}&range=${range}&interval=${interval}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock chart data:', error);
    throw error;
  }
}

/**
 * Fetch stock insights data from the backend API
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} - Insights data
 */
export async function getStockInsights(symbol) {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/insights?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock insights data:', error);
    throw error;
  }
}

/**
 * Fetch stock profile data from the backend API
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} - Profile data
 */
export async function getStockProfile(symbol) {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/profile?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock profile data:', error);
    throw error;
  }
}

/**
 * Analyze stock based on Joel Greenblatt's principles
 * @param {string} symbol - Stock ticker symbol
 * @param {number} months - Number of months to analyze
 * @returns {Promise<Object>} - Analysis result
 */
export async function analyzeStock(symbol, months = 12) {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/analyze?symbol=${symbol}&months=${months}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error analyzing stock:', error);
    throw error;
  }
}

/**
 * Check backend API health
 * @returns {Promise<Object>} - Health status
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}
