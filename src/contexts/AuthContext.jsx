import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

// Create the Auth context
export const AuthContext = createContext();

// Create the Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user_profile");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile/");
        setUser(res.data);
        localStorage.setItem("user_profile", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error loading user profile", err);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          // Try to get user profile with existing token
          const response = await api.get("/api/profile/");
          setUser(response.data);
        } catch (error) {
          console.error("Error checking auth status:", error);
          // If token is invalid, clear it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Sign in function - expects email and password
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required");
      }

      // Request JWT token with email and password
      const tokenResponse = await api.post("/api/token/", {
        email: credentials.email,
        password: credentials.password,
      });

      // Store tokens in localStorage
      const { access, refresh } = tokenResponse.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Get user profile data
      const userResponse = await api.get("/api/profile/");
      const userData = userResponse.data;

      // Update user state
      setUser(userData);
      localStorage.setItem("user_profile", JSON.stringify(userData));

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to login";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign up function - sends all required fields to the backend
  // In AuthContext.jsx, update the register function:
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Registration data being sent:", userData);

      // Register the user with all required fields
      const response = await api.post("/api/register/", userData);

      // After registration, log the user in automatically
      if (
        response.data &&
        response.data.message === "User registered successfully"
      ) {
        await login({
          email: userData.email,
          password: userData.password,
        });
      }

      return response.data;
    } catch (err) {
      console.error("Registration error details:", err);

      // Extract and log detailed error information
      if (err.response && err.response.data) {
        console.error("Error response data:", err.response.data);

        // Format error message from response data
        if (typeof err.response.data === "object") {
          const errorDetails = Object.entries(err.response.data)
            .map(
              ([field, message]) =>
                `${field}: ${
                  Array.isArray(message) ? message.join(", ") : message
                }`
            )
            .join("\n");
          setError(
            errorDetails ||
              "Registration failed. Please check your information."
          );
        } else {
          setError(
            err.response.data ||
              "Registration failed. Please check your information."
          );
        }
      } else {
        setError("Registration failed. Please try again later.");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");

    // Reset user state
    setUser(null);
  };

  // Update user profile function
  const updateUserProfile = async (updatedUserData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // ✅ Send update
      await api.put("/api/profile/update/", updatedUserData);

      // ✅ Then fetch the updated profile
      const refreshed = await api.get("/api/profile/");
      setUser(refreshed.data); // Now this will persist across pages
      localStorage.setItem("user_profile", JSON.stringify(refreshed.data));

      return refreshed.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);

      // This endpoint might need to be implemented by your backend developer
      const response = await api.post("/api/password-reset/request/", {
        email,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to request password reset";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);

      // This endpoint might need to be implemented by your backend developer
      const response = await api.post("/api/password-reset/confirm/", {
        token,
        password,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to reset password";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("access_token");
  };

  // Context value
  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    requestPasswordReset,
    resetPassword,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
