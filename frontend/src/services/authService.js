import api from './api';

/**
 * Auth service - handles authentication-related API calls and local storage
 */
const authService = {
  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data with token
   */
  async register(username, email, password) {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },

  /**
   * Save user data to localStorage after successful auth
   * @param {Object} userData - User data from API { _id, username, email, token }
   */
  saveUserToStorage(userData) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
    }));
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  /**
   * Get current user's ID
   * @returns {string|null} User ID or null if not logged in
   */
  getCurrentUserId() {
    const user = this.getCurrentUser();
    return user?._id || null;
  },

  /**
   * Check if a user is currently logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return !!this.getCurrentUser() && !!localStorage.getItem('token');
  },

  /**
   * Logout the current user
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export default authService;

