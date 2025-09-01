import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: (userId) => api.get(`/users/${userId}`),

  // Update user profile  
  updateProfile: (userId, profileData) => api.put(`/users/${userId}`, profileData),

  // Get user's watchlist
  getWatchlist: (userId) => api.get(`/users/${userId}/watchlist`),

  // Add movie to watchlist
  addToWatchlist: (userId, movieId) => api.post(`/users/${userId}/watchlist`, { movieId }),

  // Remove movie from watchlist
  removeFromWatchlist: (userId, movieId) => api.delete(`/users/${userId}/watchlist/${movieId}`),

  // Get user's review history
  getUserReviews: (userId) => api.get(`/users/${userId}/reviews`)
};