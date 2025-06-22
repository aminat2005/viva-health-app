/* eslint-disable no-unused-vars */
// services/activity.js
import api, { apiCallWithRetry } from "./api";

/**
 * Get user's activity history
 * @param {Object} params - Query parameters like date range
 * @returns {Promise} Promise with activities data
 */
export const getActivityHistory = async (params = {}) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/activity/history/", { params });
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};

/**
 * Log a new activity
 * @param {Object} activityData - Activity data to log
 * @returns {Promise} Promise with logged activity data
 */
export const logActivity = async (activityData) => {
  try {
    // Format data to match the ActivityLog model
    const payload = {
      activity_type: activityData.exercise || activityData.activity_type,
      duration_minutes: parseInt(
        activityData.duration || activityData.duration_minutes
      ),
      calories_burned: parseFloat(activityData.calories_burned || 0),
    };

    const response = await api.post("/api/activity/log/", payload);
    return response.data;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

/**
 * Log steps manually
 * @param {Object} stepsData - Steps data to log (e.g., { count: 5000 })
 * @returns {Promise} Promise with logged steps data
 */
export const logSteps = async (stepsData) => {
  try {
    // Format data to match the StepLog model
    const payload = {
      steps: parseInt(stepsData.count || stepsData.steps),
    };

    const response = await api.post("/api/steps/log/", payload);
    return response.data;
  } catch (error) {
    console.error("Error logging steps:", error);
    throw error;
  }
};

/**
 * Get steps for the current day
 * @returns {Promise} Promise with today's steps data
 */
export const getTodaySteps = async () => {
  try {
    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/steps/history/", {
        params: { date: today },
      });

      // If there are results, find today's entry
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const todayEntry = response.data.results.find(
          (entry) => entry.date === today
        );
        return todayEntry || { steps: 0, date: today };
      }

      // If no results or no entry for today, return default
      return { steps: 0, date: today };
    });
  } catch (error) {
    console.error("Error fetching today's steps:", error);
    // Return a default object if there's an error
    return { steps: 0, date: new Date().toISOString().split("T")[0] };
  }
};

/**
 * Log steps cumulatively (add to existing steps for the day)
 * @param {Object} stepsData - Steps data to log (e.g., { count: 5000 })
 * @returns {Promise} Promise with logged steps data
 */
export const logStepsCumulative = async (stepsData) => {
  try {
    // Get current steps for today first
    const todaySteps = await getTodaySteps();
    const currentSteps = todaySteps.steps || 0;

    // Calculate the new total (add the new steps to existing)
    const newStepsToAdd = parseInt(stepsData.count || stepsData.steps || 0);
    const totalSteps = currentSteps + newStepsToAdd;

    // Format data to match the StepLog model
    const payload = {
      steps: totalSteps, // Send the total steps
    };

    // Send to API
    const response = await api.post("/api/steps/log/", payload);

    // Add the additional info to the response
    return {
      ...response.data,
      previousSteps: currentSteps,
      addedSteps: newStepsToAdd,
      totalSteps: totalSteps,
    };
  } catch (error) {
    console.error("Error logging cumulative steps:", error);
    throw error;
  }
};

/**
 * Get steps history
 * @param {Object} params - Query parameters like date range
 * @returns {Promise} Promise with steps history data
 */
export const getStepsHistory = async (params = {}) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.get("/api/steps/history/", { params });
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching steps history:", error);
    throw error;
  }
};

/**
 * Update an existing activity
 * @param {string|number} activityId - Activity ID to update
 * @param {Object} activityData - Updated activity data
 * @returns {Promise} Promise with updated activity data
 */
export const updateActivity = async (activityId, activityData) => {
  try {
    // Format data to match the ActivityLog model
    const payload = {
      activity_type: activityData.exercise || activityData.activity_type,
      duration_minutes: parseInt(
        activityData.duration || activityData.duration_minutes
      ),
      calories_burned: parseFloat(activityData.calories_burned || 0),
    };

    return await apiCallWithRetry(async () => {
      const response = await api.put(
        `/api/activity/${activityId}/update/`,
        payload
      );
      return response.data;
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

/**
 * Delete an activity
 * @param {string|number} activityId - Activity ID to delete
 * @returns {Promise} Promise with deletion response
 */
export const deleteActivity = async (activityId) => {
  try {
    return await apiCallWithRetry(async () => {
      const response = await api.delete(`/api/activity/${activityId}/delete/`);
      return response.data;
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};

/**
 * Get activity summary for a specific period
 * @param {Object} params - Query parameters like date or date range
 * @returns {Promise} Promise with activity summary
 */
export const getActivitySummary = async (params = {}) => {
  try {
    return await apiCallWithRetry(async () => {
      // Try the specific endpoint first
      try {
        const response = await api.get("/api/activity/summary/", { params });
        return response.data;
      } catch (error) {
        // Fall back to health metrics if activity summary endpoint is unavailable
        console.warn(
          "Activity summary endpoint not available, using health metrics"
        );
        const response = await api.get("/health/metrics/", { params });
        return response.data;
      }
    });
  } catch (error) {
    console.error("Error fetching activity summary:", error);
    throw error;
  }
};
