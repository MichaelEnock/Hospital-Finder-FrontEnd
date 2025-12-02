/**
 * Hospital Finder API Service
 * Base URL: http://127.0.0.1:5000/api
 * 
 * This module provides a centralized interface for all backend API calls.
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Facility API endpoints
 */
export const facilityAPI = {
  /**
   * Get all facilities
   * @param {boolean} functionalOnly - Filter for functional facilities only
   * @returns {Promise<{success: boolean, count: number, data: Array}>}
   */
  getAllFacilities: async (functionalOnly = true) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/facilities?functional_only=${functionalOnly}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Find nearest facilities to a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} limit - Maximum number of facilities to return
   * @param {boolean} functionalOnly - Filter for functional facilities only
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  findNearest: async (lat, lng, limit = 5, functionalOnly = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/nearest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          limit,
          functional_only: functionalOnly
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error finding nearest facilities:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Geocode a location name to coordinates
   * @param {string} location - Location name (e.g., "Lilongwe", "Blantyre")
   * @returns {Promise<{success: boolean, data: {lat: number, lng: number, name: string}}>}
   */
  geocode: async (location) => {
    try {
      const response = await fetch(`${API_BASE_URL}/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error geocoding location:', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Health check to verify backend connectivity
 * @returns {Promise<boolean>}
 */
export const checkBackendHealth = async () => {
  try {
    const result = await facilityAPI.getAllFacilities(true);
    return result.success === true;
  } catch (error) {
    return false;
  }
};

export default facilityAPI;
