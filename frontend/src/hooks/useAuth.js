import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services';

/**
 * Custom hook for authentication management
 * Provides current user state and auth methods
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage on mount and when location changes
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, [location.pathname]);

  /**
   * Login a user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Result with success status and optional error
   */
  const login = useCallback(async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      authService.saveUserToStorage(userData);
      setCurrentUser(authService.getCurrentUser());
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  }, []);

  /**
   * Register a new user
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Result with success status and optional error
   */
  const register = useCallback(async (username, email, password) => {
    try {
      const userData = await authService.register(username, email, password);
      authService.saveUserToStorage(userData);
      setCurrentUser(authService.getCurrentUser());
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
  }, [navigate]);

  return {
    currentUser,
    userId: currentUser?._id || null,
    isLoggedIn: !!currentUser,
    loading,
    login,
    register,
    logout,
  };
}

export default useAuth;

