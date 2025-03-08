// src/services/api.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Helper function to make API requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Promise with response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log error and re-throw
    console.error('API request failed:', error);
    throw error;
  }
};

// User data operations
export const saveUserData = async (userId, userData) => {
  try {
    await fetchAPI(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const loadUserData = async (userId) => {
  try {
    return await fetchAPI(`/users/${userId}`);
  } catch (error) {
    if (error.message.includes('404')) {
      return null; // User data not found, return null
    }
    console.error('Error loading user data:', error);
    return null;
  }
};

// Folders operations
export const saveFolders = async (userId, folders) => {
  try {
    await fetchAPI(`/users/${userId}/folders`, {
      method: 'POST',
      body: JSON.stringify(folders)
    });
    
    // Also save to localStorage as a backup
    localStorage.setItem('folders', JSON.stringify(folders));
    
    return true;
  } catch (error) {
    console.error('Error saving folders:', error);
    return false;
  }
};

export const loadFolders = async (userId) => {
  try {
    const folders = await fetchAPI(`/users/${userId}/folders`);
    
    // Update localStorage with the latest data
    localStorage.setItem('folders', JSON.stringify(folders));
    
    return folders;
  } catch (error) {
    if (error.message.includes('404')) {
      // Folders not found on server, fall back to localStorage
      const localData = localStorage.getItem('folders');
      return localData ? JSON.parse(localData) : null;
    }
    
    console.error('Error loading folders:', error);
    
    // Fall back to localStorage
    const localData = localStorage.getItem('folders');
    return localData ? JSON.parse(localData) : null;
  }
};

// Creations operations
export const saveCreations = async (userId, creations) => {
  try {
    await fetchAPI(`/users/${userId}/creations`, {
      method: 'POST',
      body: JSON.stringify(creations)
    });
    
    // Also save to localStorage as a backup
    localStorage.setItem('creations', JSON.stringify(creations));
    
    return true;
  } catch (error) {
    console.error('Error saving creations:', error);
    return false;
  }
};

export const loadCreations = async (userId) => {
  try {
    const creations = await fetchAPI(`/users/${userId}/creations`);
    
    // Update localStorage with the latest data
    localStorage.setItem('creations', JSON.stringify(creations));
    
    return creations;
  } catch (error) {
    if (error.message.includes('404')) {
      // Creations not found on server, fall back to localStorage
      const localData = localStorage.getItem('creations');
      return localData ? JSON.parse(localData) : null;
    }
    
    console.error('Error loading creations:', error);
    
    // Fall back to localStorage
    const localData = localStorage.getItem('creations');
    return localData ? JSON.parse(localData) : null;
  }
};