// src/services/user.js
import api, { apiCallWithRetry } from "./api";

/**
 * Get the current user's profile with enhanced error handling
 * @returns {Promise} Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/profile/");
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    // Provide user-friendly error message
    throw {
      ...error,
      userMessage:
        error.userMessage || "Unable to load your profile. Please try again.",
      operation: "GET_USER_PROFILE",
    };
  }
};

/**
 * Update user profile with file upload support
 * @param {Object|FormData} profileData - Updated profile data
 * @returns {Promise} Promise with updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    return await apiCallWithRetry(async () => {
      const config = {};

      if (profileData instanceof FormData) {
        config.headers = {
          "Content-Type": "multipart/form-data",
        };
        // Increase timeout for file uploads
        config.timeout = 60000; // 60 seconds
      }

      const response = await api.put(
        "/api/profile/update/",
        profileData,
        config
      );
      return response.data;
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    let userMessage = "Unable to update your profile. Please try again.";

    if (error.type === "VALIDATION_ERROR") {
      userMessage = "Please check your input and try again.";
    } else if (error.type === "NETWORK_ERROR") {
      userMessage =
        "Upload failed. Please check your connection and try again.";
    }

    throw {
      ...error,
      userMessage: error.userMessage || userMessage,
      operation: "UPDATE_USER_PROFILE",
    };
  }
};

/**
 * Get user's meals with date filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise with meals data
 */
export const getMeals = async (params = {}) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/meals/", { params });
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching meals:", error);

    throw {
      ...error,
      userMessage:
        error.userMessage || "Unable to load your meals. Please try again.",
      operation: "GET_MEALS",
    };
  }
};

/**
 * Add a new meal
 * @param {Object} mealData - Meal data to add
 * @returns {Promise} Promise with created meal data
 */
export const addMeal = async (mealData) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.post("/api/meals/", mealData);
      return response.data;
    });
  } catch (error) {
    console.error("Error adding meal:", error);

    let userMessage = "Unable to add meal. Please try again.";

    if (error.type === "VALIDATION_ERROR") {
      userMessage = "Please check your meal details and try again.";
    }

    throw {
      ...error,
      userMessage: error.userMessage || userMessage,
      operation: "ADD_MEAL",
    };
  }
};

/**
 * Get user's activities
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise with activities data
 */
export const getActivities = async (params = {}) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/activities/", { params });
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching activities:", error);

    throw {
      ...error,
      userMessage:
        error.userMessage ||
        "Unable to load your activities. Please try again.",
      operation: "GET_ACTIVITIES",
    };
  }
};

/**
 * Add a new activity
 * @param {Object} activityData - Activity data to add
 * @returns {Promise} Promise with created activity data
 */
export const addActivity = async (activityData) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.post("/api/activities/", activityData);
      return response.data;
    });
  } catch (error) {
    console.error("Error adding activity:", error);

    let userMessage = "Unable to add activity. Please try again.";

    if (error.type === "VALIDATION_ERROR") {
      userMessage = "Please check your activity details and try again.";
    }

    throw {
      ...error,
      userMessage: error.userMessage || userMessage,
      operation: "ADD_ACTIVITY",
    };
  }
};
