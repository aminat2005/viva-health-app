/* eslint-disable no-unused-vars */
// services/nutrition.js
import api from "./api";

/**
 * Helper function to implement retry logic for API calls with rate limiting
 * @param {Function} apiFunction - Function that makes the API call
 * @returns {Promise} Promise with API response
 */
const apiCallWithRetry = async (apiFunction) => {
  const maxRetries = 3;
  let retries = 0;
  let delay = 500;

  while (retries < maxRetries) {
    try {
      return await apiFunction();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        retries++;
        console.log(
          `Rate limit hit, retrying (${retries}/${maxRetries}) after ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        if (retries >= maxRetries) {
          console.error("Max retries reached for rate-limited request");
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
};

// =====================================================
// FOOD DATABASE MANAGEMENT
// =====================================================

/**
 * Get complete food list with optional filtering
 * @param {Object} params - Query parameters (search, category, etc.)
 * @returns {Promise} Promise with food list
 */
export const getFoodList = async (params = {}) => {
  return apiCallWithRetry(async () => {
    try {
      console.log("Fetching food list with params:", params);
      const response = await api.get("/api/food/", { params });

      // Handle different response formats from backend
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn("Unexpected food list format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      throw error;
    }
  });
};

/**
 * Search foods by name or category
 * @param {string} query - Search term
 * @returns {Promise} Promise with search results
 */
export const searchFoods = async (query) => {
  return apiCallWithRetry(async () => {
    try {
      console.log("Searching foods with query:", query);
      const response = await api.get("/api/food/", {
        params: { search: query.trim() },
      });
      console.log("Food search response:", response.data);

      // Handle different response formats
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error searching foods:", error);
      throw error;
    }
  });
};

/**
 * Add a custom food item to the database
 * @param {Object} foodData - Custom food data
 * @returns {Promise} Promise with created food data
 */
export const addCustomFood = async (foodData) => {
  return apiCallWithRetry(async () => {
    try {
      // Ensure data format matches backend expectations
      const formattedData = {
        name: foodData.name,
        energy_kcal: parseFloat(foodData.energy_kcal || foodData.calories || 0),
        protein: parseFloat(foodData.protein || 0),
        carbohydrates: parseFloat(
          foodData.carbohydrates || foodData.carbs || 0
        ),
        fat: parseFloat(foodData.fat || 0),
        fiber: parseFloat(foodData.fiber || 0),
        category: foodData.category || "other",
        serving_size: foodData.serving_size || "1 portion",
      };

      console.log("Adding custom food:", JSON.stringify(formattedData));
      const response = await api.post("/api/food/custom/", formattedData);
      console.log("Custom food created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding custom food:", error);
      throw error;
    }
  });
};

// =====================================================
// MEAL LOGGING & MANAGEMENT
// =====================================================

/**
 * Log a meal with proper data formatting
 * @param {Object} mealData - Meal data to log
 * @returns {Promise} Promise with logged meal data
 */
export const logMeal = async (mealData) => {
  return apiCallWithRetry(async () => {
    try {
      // Format data according to backend expectations
      const formattedData = {
        food_id: parseInt(mealData.food_id),
        meal_type: mealData.meal_type || mealData.type || "snack",
        portion_size: mealData.portion_size || "medium",
        date_logged:
          mealData.date_logged || new Date().toISOString().split("T")[0],
        time_logged: mealData.time_logged || new Date().toISOString(),
      };

      console.log("Logging meal with data:", JSON.stringify(formattedData));
      const response = await api.post("/api/meal/log/", formattedData);
      console.log("Meal logged successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error logging meal:", error);
      throw error;
    }
  });
};

/**
 * Get user's meal history with complete details
 * @param {Object} params - Query parameters like date range
 * @returns {Promise} Promise with detailed meal history
 */
export const getMealHistory = async (params = {}) => {
  return apiCallWithRetry(async () => {
    try {
      const response = await api.get("/meals/", { params });

      // Handle different response formats
      if (response.data && Array.isArray(response.data.results)) {
        return {
          results: response.data.results,
          count: response.data.count || 0,
        };
      } else if (Array.isArray(response.data)) {
        return { results: response.data, count: response.data.length };
      } else {
        return { results: [], count: 0 };
      }
    } catch (error) {
      console.error("Error fetching meal history:", error);
      throw error;
    }
  });
};

/**
 * Update an existing meal
 * @param {number} mealId - ID of meal to update
 * @param {Object} mealData - Updated meal data
 * @returns {Promise} Promise with updated meal data
 */
export const updateMeal = async (mealId, mealData) => {
  return apiCallWithRetry(async () => {
    try {
      console.log(`Updating meal ${mealId} with:`, JSON.stringify(mealData));
      const response = await api.put(`/meals/${mealId}/`, mealData);
      console.log("Meal updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating meal:", error);
      throw error;
    }
  });
};

/**
 * Delete a logged meal
 * @param {number} mealId - ID of meal to delete
 * @returns {Promise} Promise with deletion confirmation
 */
export const deleteMeal = async (mealId) => {
  return apiCallWithRetry(async () => {
    try {
      console.log(`Deleting meal with ID: ${mealId}`);
      const response = await api.delete(`/meals/${mealId}/`);
      console.log("Meal deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting meal:", error);
      throw error;
    }
  });
};

/**
 * Get comprehensive nutrition summary with detailed breakdown
 * @param {Object} params - Query parameters like date or date range
 * @returns {Promise} Promise with detailed nutrition summary
 */
export const getNutritionSummary = async (params = {}) => {
  return apiCallWithRetry(async () => {
    try {
      console.log("Fetching nutrition summary with params:", params);

      // Try the meal summary endpoint first
      try {
        const response = await api.get("/api/meals/summary/", { params });

        return response.data;
      } catch (summaryError) {
        // Check if it's a 404 (endpoint doesn't exist)
        if (summaryError.response?.status === 404) {
          console.warn(
            "Meal summary endpoint not implemented yet, calculating from meals"
          );
        } else {
          console.warn("Meal summary endpoint error:", summaryError.message);
        }

        // Fallback: get meals and calculate summary manually
        const mealsResponse = await getMealHistory(params);
        const meals = mealsResponse.results || [];

        // Calculate summary from individual meals
        const summary = meals.reduce(
          (acc, meal) => {
            // Handle different possible field names from backend
            const calories = meal.total_calories || meal.calories || 0;
            const protein = meal.total_protein || meal.protein || 0;
            const carbs =
              meal.total_carbs ||
              meal.carbohydrates ||
              meal.total_carbohydrates ||
              0;
            const fat = meal.total_fat || meal.fat || 0;
            const fiber = meal.total_fiber || meal.fiber || 0;

            return {
              total_calories: acc.total_calories + calories,
              total_protein: acc.total_protein + protein,
              total_carbs: acc.total_carbs + carbs,
              total_fat: acc.total_fat + fat,
              total_fiber: acc.total_fiber + fiber,
              meals_count: acc.meals_count + 1,
            };
          },
          {
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0,
            total_fiber: 0,
            meals_count: 0,
            date: params.date || new Date().toISOString().split("T")[0],
            target_calories: 2000, // Default target, should come from user metrics
          }
        );

        return summary;
      }
    } catch (error) {
      console.error("Error fetching nutrition summary:", error);

      // Return default empty summary if everything fails
      return {
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        total_fiber: 0,
        meals_count: 0,
        date: params.date || new Date().toISOString().split("T")[0],
        target_calories: 2000,
      };
    }
  });
};

// =====================================================
// WATER INTAKE MANAGEMENT
// =====================================================

/**
 * Log water intake
 * @param {Object} waterData - Water intake data
 * @returns {Promise} Promise with logged water data
 */
export const logWaterIntake = async (waterData) => {
  return apiCallWithRetry(async () => {
    try {
      const formattedData = {
        amount: parseFloat(waterData.amount),
        date_logged: waterData.date || new Date().toISOString().split("T")[0],
        time_logged: waterData.time || new Date().toISOString(),
      };

      console.log("Logging water intake:", JSON.stringify(formattedData));
      const response = await api.post("/api/water/log/", formattedData);
      console.log("Water logged successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error logging water intake:", error);
      // Don't throw error - allow local storage fallback
      throw error;
    }
  });
};

/**
 * Get water intake history
 * @param {Object} params - Query parameters like date range
 * @returns {Promise} Promise with water intake history
 */
export const getWaterIntakeHistory = async (params = {}) => {
  try {
    console.log("Fetching water intake history with params:", params);

    // Try API first
    try {
      const response = await api.get("/api/water/history/", { params });

      return response.data;
    } catch (apiError) {
      console.warn(
        "Water history API not available, using localStorage fallback"
      );

      // Fallback to localStorage
      const date = params.date || new Date().toISOString().split("T")[0];
      const storageKey = `water_intake_${date}`;
      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        const waterData = JSON.parse(storedData);
        return {
          total_water: waterData.total || 0,
          date: date,
          entries: waterData.entries || [],
        };
      }

      return {
        total_water: 0,
        date: date,
        entries: [],
      };
    }
  } catch (error) {
    console.error("Error fetching water intake history:", error);
    return {
      total_water: 0,
      date: params.date || new Date().toISOString().split("T")[0],
      entries: [],
    };
  }
};

/**
 * Update local water storage (backup for when API is not available)
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} amount - Amount to add in liters
 */
export const updateLocalWaterStorage = (date, amount) => {
  try {
    const storageKey = `water_intake_${date}`;
    const existing = localStorage.getItem(storageKey);
    const waterData = existing
      ? JSON.parse(existing)
      : { total: 0, entries: [] };

    waterData.total = (waterData.total || 0) + amount;
    waterData.entries.push({
      id: Date.now(),
      amount: amount,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(storageKey, JSON.stringify(waterData));
    console.log("Updated local water storage:", waterData);
  } catch (error) {
    console.error("Error updating local water storage:", error);
  }
};
