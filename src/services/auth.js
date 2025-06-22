/* eslint-disable no-useless-catch */
// services/auth.js
import api from "./api";

/**
 * Handle user login
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @param {boolean} credentials.remember_me - Whether to remember the login
 * @returns {Promise} Promise with login response
 */
export const login = async (credentials) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post("/api/token/", {
      email: credentials.email,
      password: credentials.password,
      // Include remember_me if it's provided
      ...(credentials.remember_me !== undefined && {
        remember_me: credentials.remember_me,
      }),
    });

    // Store tokens in localStorage
    const { access, refresh } = response.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data including profile details
 * @returns {Promise} Promise with registration response
 */
export const register = async (userData) => {
  try {
    console.log("Sending registration data:", userData);

    const response = await api.post("/api/register/", userData);
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration failed");

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);

      // Format error message for display
      const errorMessage =
        typeof error.response.data === "object"
          ? Object.entries(error.response.data)
              .map(([field, errors]) => {
                if (Array.isArray(errors)) {
                  return `${field}: ${errors.join(", ")}`;
                } else if (typeof errors === "string") {
                  return `${field}: ${errors}`;
                } else {
                  return `${field}: Invalid format`;
                }
              })
              .join("\n")
          : error.response.data;

      throw new Error(errorMessage || "Registration failed");
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
};

/**
 * Get user profile data
 * @returns {Promise} Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get("/api/profile/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile information
 * @returns {Promise} Promise with updated profile data
 */
// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    // Change from post to put here
    const response = await api.put("/api/profile/update/", profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Log out the current user
 * @returns {void}
 */
export const logout = () => {
  // Remove tokens from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

/**
 * Request a password reset link
 * @param {string} email - User's email address
 * @returns {Promise} Promise with request response
 */
export const requestPasswordReset = async (email) => {
  try {
    // This endpoint may need to be updated based on what your backend implements
    const response = await api.post("/api/password-reset/request/", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate a password reset token
 * @param {string} token - Password reset token
 * @returns {Promise} Promise with validation response
 */
export const validateResetToken = async (token) => {
  try {
    // This endpoint may need to be updated based on what your backend implements
    const response = await api.post("/api/password-reset/validate/", { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password using token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise} Promise with reset response
 */
export const resetPassword = async (token, password) => {
  try {
    // This endpoint may need to be updated based on what your backend implements
    const response = await api.post("/api/password-reset/confirm/", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh the access token using the refresh token
 * @returns {Promise} Promise with new access token
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem("access_token", access);

    return access;
  } catch (error) {
    // If refresh fails, clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw error;
  }
};
