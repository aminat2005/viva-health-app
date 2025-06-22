/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiFilter,
  FiPieChart,
  FiBarChart2,
  FiDroplet,
  FiAlertCircle,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiStar,
  FiRefreshCw,
  FiTarget,
  FiCheck,
} from "react-icons/fi";
import * as nutritionService from "../services/nutrition";
import * as userService from "../services/user";

const NutritionPage = memo(() => {
  const { user } = useContext(AuthContext);
  const [dailyWaterTarget, setDailyWaterTarget] = useState(
    user?.daily_water_goal || 2.5
  );
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(
    user?.target_daily_calories || 2000
  );
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  });

  useEffect(() => {
    if (user) {
      setDailyWaterTarget(user.daily_water_goal || 2.5);
      setDailyCalorieTarget(user.target_daily_calories || 2000);
      setTargetWaterIntake(user.daily_water_goal || 2.5);
      setWaterGoal(user.daily_water_goal || 2.5);
    }
  }, [user]);

  // =====================================================
  // CORE STATE MANAGEMENT
  // =====================================================

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foodsError, setFoodsError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  //meal count state
  const [todayMeals, setTodayMeals] = useState([]);
  const [mealCount, setMealCount] = useState(0);
  const [maxMealsReached, setMaxMealsReached] = useState(false);
  const MAX_DAILY_MEALS = 4;
  //calorei state
  const [calorieWarnings, setCalorieWarnings] = useState({
    fifty: false,
    seventy: false,
    hundred: false,
  });

  // User Data & Metrics
  const [userMetrics, setUserMetrics] = useState(null);
  const [targetWaterIntake, setTargetWaterIntake] = useState(
    user?.daily_water_goal || 2.5
  );

  // =====================================================
  // MEAL MANAGEMENT STATE
  // =====================================================

  // Meal Data
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  // Daily Meal Tracking (4 meal limit enforcement)
  const [dailyMealTypes, setDailyMealTypes] = useState({
    breakfast: { logged: false, mealId: null },
    lunch: { logged: false, mealId: null },
    dinner: { logged: false, mealId: null },
    snack: { logged: false, mealId: null },
  });

  // Meal Form State
  const [mealType, setMealType] = useState("breakfast");
  const [mealSize, setMealSize] = useState("medium");
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);

  // =====================================================
  // FOOD DATABASE STATE
  // =====================================================

  // Food Data
  const [allFoods, setAllFoods] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);

  // Custom Food State
  const [customFood, setCustomFood] = useState({
    name: "",
    energy_kcal: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
    category: "other",
    serving_size: "1 portion",
  });

  // =====================================================
  // UI STATE MANAGEMENT
  // =====================================================

  // Modal States
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showCustomFood, setShowCustomFood] = useState(false);
  const [showMealDetails, setShowMealDetails] = useState(false);
  const [showEditMeal, setShowEditMeal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter & Search States
  const [activeTab, setActiveTab] = useState("all"); // all, favorites, recent
  const [sortBy, setSortBy] = useState("name"); // name, calories, recent
  const [filterByMealType, setFilterByMealType] = useState("all");

  // =====================================================
  // NUTRITION SUMMARY STATE
  // =====================================================

  // Daily Summary Stats
  const [dailySummary, setDailySummary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    targetCalories: { dailyCalorieTarget },
    mealsCount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  // Food Group Breakdown with detailed tracking
  const [foodGroups, setFoodGroups] = useState({
    protein: { count: 0, calories: 0, percentage: 0 },
    carbs: { count: 0, calories: 0, percentage: 0 },
    fat: { count: 0, calories: 0, percentage: 0 },
    fruit: { count: 0, calories: 0, percentage: 0 },
    vegetable: { count: 0, calories: 0, percentage: 0 },
    dairy: { count: 0, calories: 0, percentage: 0 },
    grain: { count: 0, calories: 0, percentage: 0 },
    other: { count: 0, calories: 0, percentage: 0 },
  });

  // Nutrition Goals & Tracking
  const [nutritionGoals, setNutritionGoals] = useState({
    calorieDeficit: 0, // positive for deficit, negative for surplus
    proteinTarget: 0,
    carbsTarget: 0,
    fatTarget: 0,
    fiberTarget: 25,
  });

  // =====================================================
  // WATER INTAKE STATE
  // =====================================================

  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(dailyWaterTarget);
  const [waterHistory, setWaterHistory] = useState([]);
  const [showWaterDetails, setShowWaterDetails] = useState(false);

  // =====================================================
  // MEAL SUGGESTIONS STATE
  // =====================================================

  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);

  // =====================================================
  // ANALYTICS & INSIGHTS STATE
  // =====================================================

  const [weeklyStats, setWeeklyStats] = useState({
    averageCalories: 0,
    caloriesTrend: [], // last 7 days
    macroBalance: { protein: 0, carbs: 0, fat: 0 },
    consistencyScore: 0,
  });

  const [monthlyInsights, setMonthlyInsights] = useState({
    totalMealsLogged: 0,
    favoriteFood: "",
    healthiestDay: "",
    improvementAreas: [],
  });

  // =====================================================
  // HELPER FUNCTIONS & CALCULATIONS
  // =====================================================

  /**
   * Calculate portion-adjusted calories and nutrients
   * @param {Object} food - Food item
   * @param {string} portionSize - small/medium/large
   * @returns {Object} Adjusted nutritional values
   */
  const calculatePortionNutrition = useCallback((food, portionSize) => {
    const multiplier =
      portionSize === "small" ? 0.5 : portionSize === "large" ? 1.5 : 1;

    return {
      calories: Math.round(
        (food.energy_kcal || food.calories || 0) * multiplier
      ),
      protein: Math.round((food.protein || 0) * multiplier * 10) / 10,
      carbohydrates:
        Math.round((food.carbohydrates || food.carbs || 0) * multiplier * 10) /
        10,
      fat: Math.round((food.fat || 0) * multiplier * 10) / 10,
      fiber: Math.round((food.fiber || 0) * multiplier * 10) / 10,
    };
  }, []);

  /**
   * Check if a meal type can be logged today (4-meal limit)
   * @param {string} mealType - breakfast/lunch/dinner/snack
   * @returns {boolean} Can log this meal type
   */
  const canLogMealType = useCallback(
    (mealType) => {
      return !dailyMealTypes[mealType]?.logged;
    },
    [dailyMealTypes]
  );

  /**
   * Update daily meal types tracking from meals data
   * @param {Array} mealsData - Array of meals
   */
  const updateDailyMealTypes = (mealsData) => {
    const today = new Date().toISOString().split("T")[0];
    const todayMeals = mealsData.filter((meal) => {
      const mealDate = meal.date_logged || meal.timestamp?.split("T")[0];
      return mealDate === today;
    });

    const mealTypes = {
      breakfast: { logged: false, mealId: null },
      lunch: { logged: false, mealId: null },
      dinner: { logged: false, mealId: null },
      snack: { logged: false, mealId: null },
    };

    todayMeals.forEach((meal) => {
      const type = meal.meal_type || meal.type;
      if (mealTypes.hasOwnProperty(type)) {
        mealTypes[type] = { logged: true, mealId: meal.id };
      }
    });

    return mealTypes;
  };

  /**
   * Calculate comprehensive food groups from meals data
   * @param {Array} mealsData - Array of meals
   */
  const calculateFoodGroups = (mealsData) => {
    const groups = {
      protein: { count: 0, calories: 0, percentage: 0 },
      carbs: { count: 0, calories: 0, percentage: 0 },
      fat: { count: 0, calories: 0, percentage: 0 },
      fruit: { count: 0, calories: 0, percentage: 0 },
      vegetable: { count: 0, calories: 0, percentage: 0 },
      dairy: { count: 0, calories: 0, percentage: 0 },
      grain: { count: 0, calories: 0, percentage: 0 },
      other: { count: 0, calories: 0, percentage: 0 },
    };

    let totalCalories = 0;

    mealsData.forEach((meal) => {
      const mealCalories = meal.calories || meal.total_calories || 0;
      totalCalories += mealCalories;

      if (meal.food && meal.food.category) {
        const category = meal.food.category.toLowerCase();
        if (groups.hasOwnProperty(category)) {
          groups[category].count++;
          groups[category].calories += mealCalories;
        } else {
          groups.other.count++;
          groups.other.calories += mealCalories;
        }
      } else {
        groups.other.count++;
        groups.other.calories += mealCalories;
      }
    });

    // Calculate percentages
    Object.keys(groups).forEach((group) => {
      groups[group].percentage =
        totalCalories > 0
          ? Math.round((groups[group].calories / totalCalories) * 100)
          : 0;
    });

    return groups;
  };

  /**
   * Calculate daily nutrition summary from meals
   * @param {Array} mealsData - Array of meals
   */
  const calculateDailySummary = (
    mealsData,
    targetCalories = dailyCalorieTarget
  ) => {
    const summary = mealsData.reduce(
      (acc, meal) => ({
        totalCalories:
          acc.totalCalories + (meal.calories || meal.total_calories || 0),
        totalProtein:
          acc.totalProtein + (meal.protein || meal.total_protein || 0),
        totalCarbs:
          acc.totalCarbs + (meal.carbohydrates || meal.total_carbs || 0),
        totalFat: acc.totalFat + (meal.fat || meal.total_fat || 0),
        totalFiber: acc.totalFiber + (meal.fiber || meal.total_fiber || 0),
        mealsCount: acc.mealsCount + 1,
      }),
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        targetCalories: targetCalories,
        mealsCount: 0,
        date: new Date().toISOString().split("T")[0],
      }
    );

    // Calculate nutrition goals progress
    const calorieDeficit = summary.targetCalories - summary.totalCalories;

    return { ...summary, calorieDeficit };
  };

  /**
   * Generate personalized meal suggestions based on user data
   * @param {Array} foods - Available foods
   * @returns {Array} Suggested meals
   */
  const generatePersonalizedSuggestions = (foods, currentDailyMealTypes) => {
    if (!foods || foods.length === 0 || !currentDailyMealTypes) return [];

    const categories = [
      {
        name: "Balanced Breakfast",
        type: "breakfast",
        targetCalories: 300,
        description: "Start your day with balanced nutrition",
      },
      {
        name: "Protein-Rich Lunch",
        type: "lunch",
        targetCalories: 500,
        description: "High-protein meal to fuel your afternoon",
      },
      {
        name: "Light Dinner",
        type: "dinner",
        targetCalories: 400,
        description: "Nutritious and light evening meal",
      },
      {
        name: "Healthy Snack",
        type: "snack",
        targetCalories: 200,
        description: "Quick and healthy energy boost",
      },
    ];

    const suggestions = categories.map((category, index) => {
      const itemCount = Math.floor(Math.random() * 3) + 2; // 2-4 items
      const shuffled = [...foods].sort(() => 0.5 - Math.random());
      const selectedFoods = shuffled.slice(
        0,
        Math.min(itemCount, shuffled.length)
      );

      const totalCalories = selectedFoods.reduce(
        (sum, food) => sum + (food.energy_kcal || food.calories || 0),
        0
      );

      return {
        id: `suggestion-${index + 1}`,
        name: category.name,
        type: category.type,
        description: category.description,
        items: selectedFoods,
        calories: totalCalories,
        targetCalories: category.targetCalories,
        canLog: !currentDailyMealTypes[category.type]?.logged,
      };
    });

    return suggestions;
  };

  /**
   * Get water fill color based on intake level
   * @returns {string} Tailwind CSS classes for water color
   */
  const getWaterFillColor = useCallback(() => {
    const percentage = waterIntake / targetWaterIntake;
    if (percentage <= 0.3) return "bg-red-400 dark:bg-red-500";
    if (percentage <= 0.6) return "bg-yellow-400 dark:bg-yellow-500";
    if (percentage <= 0.8) return "bg-blue-400 dark:bg-blue-500";
    return "bg-green-500 dark:bg-green-600";
  }, [waterIntake, targetWaterIntake]);

  /**
   * Show success message temporarily
   * @param {string} message - Success message to display
   */
  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  }, []);

  /**
   * Show error message temporarily
   * @param {string} message - Error message to display
   */
  const showErrorMessage = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  }, []);

  const resetDailyData = useCallback(() => {
    const now = new Date();
    const lastReset = localStorage.getItem("lastMealReset");
    const today = now.toDateString();

    if (lastReset !== today) {
      // Reset daily meal data
      setTodayMeals([]);
      setMeals([]);
      setMealCount(0);
      setMaxMealsReached(false);
      setCaloriesConsumed(0);
      setWaterIntake(0);

      // Reset daily meal types (this is important!)
      setDailyMealTypes({
        breakfast: { logged: false, mealId: null },
        lunch: { logged: false, mealId: null },
        dinner: { logged: false, mealId: null },
        snack: { logged: false, mealId: null },
      });

      // Reset nutrition summary
      setNutritionSummary({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      });

      // Store reset date
      localStorage.setItem("lastMealReset", today);
    }
  }, []);

  // Rest of the component continues in next section...

  // =====================================================
  // DATA FETCHING & API INTEGRATION
  // =====================================================

  /**
   * Fetch all foods from API for suggestions and search
   */
  const fetchAllFoods = useCallback(async () => {
    try {
      setFoodsLoading(true);
      setFoodsError(null);

      const response = await nutritionService.getFoodList();

      if (Array.isArray(response)) {
        setAllFoods(response);
        setSearchResults(response); // Initialize search results

        // Generate personalized suggestions
        const suggestions = generatePersonalizedSuggestions(response);
        setMealSuggestions(suggestions);
      } else {
        console.warn("Unexpected food list format:", response);
        setAllFoods([]);
        setFoodsError("Food database format error");
      }
    } catch (err) {
      console.error("Error fetching foods:", err);
      setFoodsError("Failed to load food database. Please try again later.");
    } finally {
      setFoodsLoading(false);
    }
  }, []);

  /**
   * Fetch comprehensive nutrition data for today
   */
  const fetchNutritionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];

      // Step 1: Get user health metrics
      try {
        const metricsResponse = await userService.getHealthMetrics();
        if (metricsResponse) {
          setUserMetrics(metricsResponse);
          setTargetWaterIntake(
            metricsResponse.water_target || dailyWaterTarget
          );
          setWaterGoal(metricsResponse.water_target || dailyWaterTarget);
        }
      } catch (err) {
        console.error("Failed to load health metrics:", err);
      }

      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Get detailed meal history
      try {
        const mealsResponse = await nutritionService.getMealHistory({
          date: today,
        });

        let mealsData = [];
        if (mealsResponse?.results) {
          mealsData = mealsResponse.results;
        } else if (Array.isArray(mealsResponse)) {
          mealsData = mealsResponse;
        }

        // Sort meals by created timestamp (newest first)
        const sortedMeals = mealsData.sort((a, b) => {
          const dateA = new Date(a.created_at || a.timestamp || a.date);
          const dateB = new Date(b.created_at || b.timestamp || b.date);
          return dateB - dateA; // Newest first
        });

        const currentMealCount = sortedMeals.length;
        setTodayMeals(sortedMeals);
        setMealCount(currentMealCount);
        setMaxMealsReached(currentMealCount >= MAX_DAILY_MEALS);

        setMeals(sortedMeals);
        updateDailyMealTypes(sortedMeals);
        calculateFoodGroups(sortedMeals);
        calculateDailySummary(sortedMeals);
      } catch (err) {
        console.error("Failed to load meal history:", err);
        setMeals([]);
        setTodayMeals([]);
        setMealCount(0);
        setMaxMealsReached(false);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 3: Get nutrition summary from API (with fallback)
      try {
        const summaryResponse = await nutritionService.getNutritionSummary({
          date: today,
        });

        if (summaryResponse) {
          setDailySummary((prev) => ({
            ...prev,
            totalCalories: summaryResponse.total_calories || prev.totalCalories,
            totalProtein: summaryResponse.total_protein || prev.totalProtein,
            totalCarbs: summaryResponse.total_carbs || prev.totalCarbs,
            totalFat: summaryResponse.total_fat || prev.totalFat,
            totalFiber: summaryResponse.total_fiber || prev.totalFiber,
            targetCalories:
              summaryResponse.target_calories || prev.targetCalories,
          }));
        }
      } catch (err) {
        console.warn(
          "Failed to load nutrition summary from API, using calculated values"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Get water intake history
      try {
        const waterResponse = await nutritionService.getWaterIntakeHistory({
          date: today,
        });
        if (waterResponse) {
          setWaterIntake(waterResponse.total_water || 0);
          setWaterHistory(waterResponse.entries || []);
        }
      } catch (err) {
        console.warn("Failed to load water intake data:", err);
      }

      // Step 5: Load favorite and recent foods from localStorage
      loadUserFoodPreferences();
    } catch (err) {
      console.error("Error fetching nutrition data:", err);
      setError("Failed to load nutrition data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load user food preferences from localStorage
   */
  const loadUserFoodPreferences = useCallback(() => {
    try {
      // Load favorite foods
      const favorites = localStorage.getItem(`favorites_${user?.id || "user"}`);
      if (favorites) {
        setFavoriteFoods(JSON.parse(favorites));
      }

      // Load recent foods (last 10 used)
      const recent = localStorage.getItem(`recent_foods_${user?.id || "user"}`);
      if (recent) {
        setRecentFoods(JSON.parse(recent));
      }
    } catch (error) {
      console.error("Error loading user food preferences:", error);
    }
  }, [user]);

  /**
   * Save user food preferences to localStorage
   */
  const saveUserFoodPreferences = useCallback(() => {
    try {
      localStorage.setItem(
        `favorites_${user?.id || "user"}`,
        JSON.stringify(favoriteFoods)
      );
      localStorage.setItem(
        `recent_foods_${user?.id || "user"}`,
        JSON.stringify(recentFoods)
      );
    } catch (error) {
      console.error("Error saving user food preferences:", error);
    }
  }, [user, favoriteFoods, recentFoods]);

  /**
   * Add food to recent foods list
   */
  const addToRecentFoods = useCallback((food) => {
    setRecentFoods((prev) => {
      // Remove if already exists
      const filtered = prev.filter((f) => f.id !== food.id);
      // Add to beginning and limit to 10
      const updated = [food, ...filtered].slice(0, 10);
      return updated;
    });
  }, []);

  /**
   * Toggle food in favorites
   */
  const toggleFavoriteFood = useCallback(
    (food) => {
      setFavoriteFoods((prev) => {
        const exists = prev.find((f) => f.id === food.id);
        if (exists) {
          return prev.filter((f) => f.id !== food.id);
        } else {
          return [...prev, food];
        }
      });
      showSuccessMessage(
        favoriteFoods.find((f) => f.id === food.id)
          ? "Removed from favorites"
          : "Added to favorites"
      );
    },
    [favoriteFoods, showSuccessMessage]
  );

  /**
   * Refresh all nutrition data
   */
  const refreshNutritionData = useCallback(async () => {
    await Promise.all([fetchNutritionData(), fetchAllFoods()]);
    showSuccessMessage("Data refreshed successfully!");
  }, [fetchNutritionData, fetchAllFoods]);

  // =====================================================
  // SEARCH & FOOD SELECTION LOGIC
  // =====================================================

  /**
   * Handle food search with debouncing and filtering
   */
  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        // Show all foods when search is empty
        const filteredFoods = getFilteredFoods(allFoods);
        setSearchResults(filteredFoods);
        return;
      }

      // Use local search if we have all foods loaded
      if (allFoods.length > 0) {
        const filtered = allFoods.filter((food) => {
          const nameMatch = food.name
            .toLowerCase()
            .includes(query.toLowerCase());
          const categoryMatch = food.category
            ?.toLowerCase()
            .includes(query.toLowerCase());
          return nameMatch || categoryMatch;
        });

        const finalFiltered = getFilteredFoods(filtered);
        setSearchResults(finalFiltered);
        return;
      }

      // Fallback to API search if local data not available
      try {
        setSearchLoading(true);
        const response = await nutritionService.searchFoods(query);
        const results = Array.isArray(response) ? response : [];
        setSearchResults(getFilteredFoods(results));
      } catch (err) {
        console.error("Error searching foods:", err);
        setSearchResults([]);
        showErrorMessage("Search failed. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    },
    [allFoods, showErrorMessage]
  );

  /**
   * Apply active filters to food list
   */
  const getFilteredFoods = useCallback(
    (foods) => {
      let filtered = [...foods];

      // Filter by active tab
      if (activeTab === "favorites") {
        const favoriteIds = favoriteFoods.map((f) => f.id);
        filtered = filtered.filter((food) => favoriteIds.includes(food.id));
      } else if (activeTab === "recent") {
        const recentIds = recentFoods.map((f) => f.id);
        filtered = filtered.filter((food) => recentIds.includes(food.id));
      }

      // Filter by selected categories
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((food) =>
          selectedCategories.includes(food.category?.toLowerCase())
        );
      }

      // Sort by selected criteria
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "calories":
            return (
              (b.energy_kcal || b.calories || 0) -
              (a.energy_kcal || a.calories || 0)
            );
          case "recent":
            const aIndex = recentFoods.findIndex((f) => f.id === a.id);
            const bIndex = recentFoods.findIndex((f) => f.id === b.id);
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          default:
            return 0;
        }
      });

      return filtered;
    },
    [activeTab, favoriteFoods, recentFoods, selectedCategories, sortBy]
  );

  /**
   * Handle adding food to current meal selection
   */
  const handleAddFoodToMeal = useCallback(
    (food) => {
      // Check if food is already selected
      if (selectedFoodItems.some((item) => item.id === food.id)) {
        showErrorMessage("This food is already added to your meal.");
        return;
      }

      // Add to selected items
      setSelectedFoodItems((prev) => [...prev, food]);

      // Add to recent foods
      addToRecentFoods(food);

      showSuccessMessage(`${food.name} added to meal`);
    },
    [selectedFoodItems, addToRecentFoods, showSuccessMessage, showErrorMessage]
  );

  /**
   * Handle removing food from current meal selection
   */
  const handleRemoveFoodFromMeal = useCallback(
    (foodId) => {
      setSelectedFoodItems((prev) => prev.filter((item) => item.id !== foodId));
      showSuccessMessage("Food removed from meal");
    },
    [showSuccessMessage]
  );

  /**
   * Handle custom food form changes
   */
  const handleCustomFoodChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomFood((prev) => ({
      ...prev,
      [name]:
        name === "name" || name === "category" || name === "serving_size"
          ? value
          : parseFloat(value) || 0,
    }));
  }, []);

  /**
   * Handle adding custom food to meal
   */
  const handleAddCustomFood = useCallback(() => {
    if (!customFood.name || customFood.energy_kcal === 0) {
      showErrorMessage(
        "Please provide at least a name and calories for the custom food"
      );
      return;
    }

    // Create food with temporary ID for immediate UI feedback
    const tempId = `temp-${Date.now()}`;
    const newFood = {
      id: tempId,
      name: customFood.name,
      energy_kcal: customFood.energy_kcal,
      protein: customFood.protein || 0,
      carbohydrates: customFood.carbohydrates || 0,
      fat: customFood.fat || 0,
      fiber: customFood.fiber || 0,
      category: customFood.category || "other",
      serving_size: customFood.serving_size || "1 portion",
      isCustom: true,
    };

    setSelectedFoodItems((prev) => [...prev, newFood]);

    // Reset form
    setCustomFood({
      name: "",
      energy_kcal: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      fiber: "",
      category: "other",
      serving_size: "1 portion",
    });

    setShowCustomFood(false);
    showSuccessMessage(`Custom food "${newFood.name}" added to meal`);
  }, [customFood, showSuccessMessage, showErrorMessage]);

  /**
   * Toggle category filter
   */
  const toggleCategoryFilter = useCallback((category) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      return updated;
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setActiveTab("all");
    setSortBy("name");
    setSearchQuery("");
    setSearchResults(allFoods);
  }, [allFoods]);

  /**
   * Get available food categories from current food list
   */
  const getAvailableCategories = useCallback(() => {
    const categories = new Set();
    allFoods.forEach((food) => {
      if (food.category) {
        categories.add(food.category.toLowerCase());
      }
    });
    return Array.from(categories).sort();
  }, [allFoods]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Auto-save user preferences when they change
  useEffect(() => {
    if (favoriteFoods.length > 0 || recentFoods.length > 0) {
      saveUserFoodPreferences();
    }
  }, [favoriteFoods, recentFoods, saveUserFoodPreferences]);
  // =====================================================
  // MEAL MANAGEMENT (ADD/EDIT/DELETE)
  // =====================================================

  /**
   * Handle adding a new meal with comprehensive validation
   */
  const handleAddMeal = useCallback(async () => {
    if (selectedFoodItems.length === 0) {
      showErrorMessage("Please select at least one food item");
      return;
    }

    // Check 4-meal daily limit
    if (mealCount >= MAX_DAILY_MEALS) {
      showErrorMessage(
        "You've reached your daily meal limit of 4 meals. Try again tomorrow!"
      );
      return;
    }

    if (!canLogMealType(mealType)) {
      showErrorMessage(
        `You have already logged ${mealType} today. Each meal type can only be logged once per day.`
      );
      return;
    }
    try {
      setLoading(true);
      const successfulMeals = [];
      const failedMeals = [];

      for (const item of selectedFoodItems) {
        try {
          // Handle custom foods (create them first)
          if (typeof item.id === "string" && item.id.startsWith("temp-")) {
            // Create custom food first
            const customFoodData = {
              name: item.name,
              energy_kcal: item.energy_kcal,
              protein: item.protein || 0,
              carbohydrates: item.carbohydrates || 0,
              fat: item.fat || 0,
              fiber: item.fiber || 0,
              category: item.category || "other",
              serving_size: item.serving_size || "1 portion",
            };

            const createdFood = await nutritionService.addCustomFood(
              customFoodData
            );

            // Log meal with created food ID
            const mealData = {
              food_id: createdFood.id,
              meal_type: mealType,
              portion_size: mealSize,
              date_logged: new Date().toISOString().split("T")[0],
              time_logged: new Date().toISOString(),
            };

            await nutritionService.logMeal(mealData);
            successfulMeals.push(item.name);

            // Add created food to allFoods for future use
            setAllFoods((prev) => [...prev, createdFood]);
          } else {
            // Regular food from database
            const mealData = {
              food_id: item.id,
              meal_type: mealType,
              portion_size: mealSize,
              date_logged: new Date().toISOString().split("T")[0],
              time_logged: new Date().toISOString(),
            };

            await nutritionService.logMeal(mealData);
            successfulMeals.push(item.name);
          }

          // Add to recent foods
          addToRecentFoods(item);
        } catch (itemError) {
          console.error(`Failed to log food item ${item.name}:`, itemError);
          failedMeals.push(item.name);
        }
      }

      if (successfulMeals.length > 0) {
        // Mark this meal type as logged
        // Mark this meal type as logged
        setDailyMealTypes((prev) => ({
          ...prev,
          [mealType]: { logged: true, mealId: Date.now() }, // Temp ID until refresh
        }));

        // Update meal count for daily limit
        const newMealCount = mealCount + 1;
        setMealCount(newMealCount);
        setMaxMealsReached(newMealCount >= MAX_DAILY_MEALS);

        // Calculate total calories for logged meals
        const totalCalories = selectedFoodItems.reduce((sum, item) => {
          return sum + (item.energy_kcal || 0);
        }, 0);

        // Update calories consumed
        setCaloriesConsumed((prev) => prev + totalCalories);

        // Wait for backend to process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Refresh all nutrition data
        await fetchNutritionData();

        showSuccessMessage(
          `Successfully logged ${mealType}: ${successfulMeals.join(", ")}`
        );
      }

      if (failedMeals.length > 0) {
        showErrorMessage(`Failed to log: ${failedMeals.join(", ")}`);
      }

      // Reset form
      setSelectedFoodItems([]);
      setShowAddMeal(false);
      setShowFoodSearch(false);
    } catch (err) {
      console.error("Error adding meal:", err);
      showErrorMessage("Failed to add meal. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    selectedFoodItems,
    canLogMealType,
    mealType,
    mealSize,
    addToRecentFoods,
    fetchNutritionData,
    showSuccessMessage,
    showErrorMessage,
  ]);

  /**
   * Handle editing an existing meal
   */
  const handleEditMeal = useCallback(
    async (meal) => {
      try {
        setLoading(true);

        const updatedMealData = {
          meal_type: meal.meal_type || meal.type,
          portion_size: meal.portion_size || "medium",
          date_logged:
            meal.date_logged || new Date().toISOString().split("T")[0],
          time_logged: meal.time_logged || new Date().toISOString(),
        };

        await nutritionService.updateMeal(meal.id, updatedMealData);

        // Refresh nutrition data
        await fetchNutritionData();

        setEditingMeal(null);
        setShowEditMeal(false);
        showSuccessMessage("Meal updated successfully!");
      } catch (err) {
        console.error("Error updating meal:", err);
        showErrorMessage("Failed to update meal. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fetchNutritionData, showSuccessMessage, showErrorMessage]
  );

  /**
   * Handle deleting a meal
   */
  const handleDeleteMeal = useCallback(
    async (mealId, mealType) => {
      try {
        setLoading(true);

        await nutritionService.deleteMeal(mealId);

        // Update daily meal types to allow logging this type again
        setDailyMealTypes((prev) => ({
          ...prev,
          [mealType]: { logged: false, mealId: null },
        }));

        // Refresh nutrition data
        await fetchNutritionData();

        setShowDeleteConfirm(false);
        setSelectedMeal(null);
        showSuccessMessage("Meal deleted successfully!");
      } catch (err) {
        console.error("Error deleting meal:", err);
        showErrorMessage("Failed to delete meal. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fetchNutritionData, showSuccessMessage, showErrorMessage]
  );

  /**
   * Handle adding suggested meal
   */
  const handleAddSuggestedMeal = useCallback(
    async (suggestion) => {
      // Check if meal type can be logged
      if (!canLogMealType(suggestion.type)) {
        showErrorMessage(
          `You have already logged ${suggestion.type} today. Each meal type can only be logged once per day.`
        );
        return;
      }

      try {
        setLoading(true);
        const successfulItems = [];
        const failedItems = [];

        for (const item of suggestion.items) {
          try {
            const mealData = {
              food_id: item.id,
              meal_type: suggestion.type,
              portion_size: "medium",
              date_logged: new Date().toISOString().split("T")[0],
              time_logged: new Date().toISOString(),
            };

            await nutritionService.logMeal(mealData);
            successfulItems.push(item.name);
            addToRecentFoods(item);
          } catch (itemError) {
            console.error(
              `Failed to log suggested food item ${item.name}:`,
              itemError
            );
            failedItems.push(item.name);
          }
        }

        if (successfulItems.length > 0) {
          // Mark this meal type as logged
          setDailyMealTypes((prev) => ({
            ...prev,
            [suggestion.type]: { logged: true, mealId: Date.now() },
          }));

          // Wait for backend to process
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Refresh nutrition data
          await fetchNutritionData();

          showSuccessMessage(`Successfully added ${suggestion.name}!`);
        } else {
          showErrorMessage("Failed to add suggested meal. Please try again.");
        }
      } catch (err) {
        console.error("Error adding suggested meal:", err);
        showErrorMessage("Failed to add suggested meal. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      canLogMealType,
      addToRecentFoods,
      fetchNutritionData,
      showSuccessMessage,
      showErrorMessage,
    ]
  );

  /**
   * Handle copying meal from previous day
   */
  const handleCopyPreviousMeal = useCallback(
    async (mealType) => {
      try {
        setLoading(true);

        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // Fetch yesterday's meals
        const yesterdayMeals = await nutritionService.getMealHistory({
          date: yesterdayStr,
        });

        const targetMeal = yesterdayMeals.results?.find(
          (meal) => (meal.meal_type || meal.type) === mealType
        );

        if (!targetMeal) {
          showErrorMessage(`No ${mealType} found from yesterday to copy.`);
          return;
        }

        // Check if today's meal type can be logged
        if (!canLogMealType(mealType)) {
          showErrorMessage(
            `You have already logged ${mealType} today. Cannot copy from yesterday.`
          );
          return;
        }

        // Log the copied meal
        const mealData = {
          food_id: targetMeal.food?.id || targetMeal.food_id,
          meal_type: mealType,
          portion_size: targetMeal.portion_size || "medium",
          date_logged: new Date().toISOString().split("T")[0],
          time_logged: new Date().toISOString(),
        };

        await nutritionService.logMeal(mealData);

        // Update state and refresh
        setDailyMealTypes((prev) => ({
          ...prev,
          [mealType]: { logged: true, mealId: Date.now() },
        }));

        await fetchNutritionData();
        showSuccessMessage(`${mealType} copied from yesterday successfully!`);
      } catch (err) {
        console.error("Error copying previous meal:", err);
        showErrorMessage("Failed to copy meal from yesterday.");
      } finally {
        setLoading(false);
      }
    },
    [canLogMealType, fetchNutritionData, showSuccessMessage, showErrorMessage]
  );

  /**
   * Calculate total calories for selected food items with current portion size
   */
  const calculateSelectedItemsTotal = useCallback(() => {
    return selectedFoodItems.reduce((total, item) => {
      const nutrition = calculatePortionNutrition(item, mealSize);
      return total + nutrition.calories;
    }, 0);
  }, [selectedFoodItems, mealSize, calculatePortionNutrition]);

  /**
   * Get meal type availability status
   */
  const getMealTypeStatus = useCallback(
    (type) => {
      const status = dailyMealTypes[type];
      return {
        canLog: !status?.logged,
        isLogged: status?.logged || false,
        mealId: status?.mealId || null,
      };
    },
    [dailyMealTypes]
  );
  // =====================================================
  // WATER INTAKE MANAGEMENT
  // =====================================================

  /**
   * Handle adding water intake with smart tracking
   */
  const handleAddWater = useCallback(
    async (amount) => {
      try {
        // Prevent excessive water logging (safety check)
        const dailyLimit = targetWaterIntake * 3; // 3x daily target as max
        if (waterIntake + amount > dailyLimit) {
          showErrorMessage(
            `That seems like too much water! Daily limit is ${dailyLimit}L for safety.`
          );
          return;
        }

        // Update UI optimistically for instant feedback
        const newAmount = Math.min(waterIntake + amount, dailyLimit);
        const previousAmount = waterIntake;
        setWaterIntake(newAmount);

        // Create water entry for history
        const waterEntry = {
          id: Date.now(),
          amount: amount,
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // Add to water history immediately
        setWaterHistory((prev) => [waterEntry, ...prev]);

        // Update local storage as backup
        const today = new Date().toISOString().split("T")[0];
        nutritionService.updateLocalWaterStorage(today, amount);

        try {
          // Try to log to backend
          const waterData = {
            amount: amount,
            date: today,
            time: new Date().toISOString(),
          };

          await nutritionService.logWaterIntake(waterData);

          // Show success with visual feedback
          showSuccessMessage(`+${amount}L water logged! 💧`);

          // Update water goal progress if reached milestones
          const progressPercentage = (newAmount / targetWaterIntake) * 100;
          if (
            progressPercentage >= 100 &&
            previousAmount / targetWaterIntake < 1
          ) {
            showSuccessMessage("🎉 Daily water goal achieved! Great job!");
          } else if (
            progressPercentage >= 50 &&
            previousAmount / targetWaterIntake < 0.5
          ) {
            showSuccessMessage("💪 Halfway to your water goal!");
          }
        } catch (apiError) {
          console.warn(
            "Water intake saved locally but not synced to server:",
            apiError
          );
          showSuccessMessage(
            `+${amount}L logged locally (will sync when online)`
          );
        }
      } catch (err) {
        console.error("Error updating water intake:", err);
        // Revert UI if there was an error
        setWaterIntake(waterIntake);
        showErrorMessage("Failed to log water intake. Please try again.");
      }
    },
    [waterIntake, targetWaterIntake, showSuccessMessage, showErrorMessage]
  );

  /**
   * Handle custom water amount input
   */
  const handleCustomWaterAmount = useCallback(async () => {
    const amount = prompt(
      "Enter water amount in liters (e.g., 0.3 for 300ml):"
    );

    if (amount === null) return; // User cancelled

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      showErrorMessage("Please enter a valid positive number");
      return;
    }

    if (numericAmount > 2) {
      showErrorMessage(
        "That seems like a lot at once! Try logging smaller amounts."
      );
      return;
    }

    await handleAddWater(numericAmount);
  }, [handleAddWater, showErrorMessage]);

  /**
   * Handle removing water entry (undo functionality)
   */
  const handleRemoveWaterEntry = useCallback(
    async (entryId, amount) => {
      try {
        // Update UI immediately
        setWaterIntake((prev) => Math.max(0, prev - amount));

        // Remove from history
        setWaterHistory((prev) => prev.filter((entry) => entry.id !== entryId));

        // Update local storage
        const today = new Date().toISOString().split("T")[0];
        nutritionService.updateLocalWaterStorage(today, -amount);

        showSuccessMessage(`Water entry removed (-${amount}L)`);

        // TODO: If backend supports deleting water entries, add API call here
      } catch (err) {
        console.error("Error removing water entry:", err);
        showErrorMessage("Failed to remove water entry.");
      }
    },
    [showSuccessMessage, showErrorMessage]
  );

  /**
   * Get water intake status and visual indicators
   */
  const getWaterStatus = useCallback(() => {
    const percentage = (waterIntake / targetWaterIntake) * 100;

    let status = "danger";
    let message = "Need more water";
    let color = "red";

    if (percentage >= 100) {
      status = "excellent";
      message = "Goal achieved!";
      color = "green";
    } else if (percentage >= 80) {
      status = "good";
      message = "Almost there!";
      color = "blue";
    } else if (percentage >= 50) {
      status = "fair";
      message = "Halfway there";
      color = "yellow";
    }

    return {
      percentage: Math.min(percentage, 100),
      status,
      message,
      color,
      remaining: Math.max(0, targetWaterIntake - waterIntake),
    };
  }, [waterIntake, targetWaterIntake]);

  /**
   * Reset daily water intake (for new day)
   */
  const resetDailyWater = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setWaterIntake(0);
    setWaterHistory([]);
    localStorage.removeItem(`water_intake_${today}`);
    showSuccessMessage("Daily water intake reset for new day!");
  }, [showSuccessMessage]);

  /**
   * Set custom water goal
   */
  const handleSetWaterGoal = useCallback(() => {
    const newGoal = prompt(
      `Enter your daily water goal in liters (current: ${targetWaterIntake}L):`
    );

    if (newGoal === null) return;

    const numericGoal = parseFloat(newGoal);

    if (isNaN(numericGoal) || numericGoal <= 0 || numericGoal > 10) {
      showErrorMessage("Please enter a valid goal between 0.1L and 10L");
      return;
    }

    setTargetWaterIntake(numericGoal);
    setWaterGoal(numericGoal);

    // Save to localStorage
    localStorage.setItem(
      `water_goal_${user?.id || "user"}`,
      numericGoal.toString()
    );

    showSuccessMessage(`Water goal updated to ${numericGoal}L per day!`);
  }, [targetWaterIntake, user, showSuccessMessage, showErrorMessage]);

  /**
   * Get hydration tips based on current intake
   */
  const getHydrationTip = useCallback(() => {
    const percentage = (waterIntake / targetWaterIntake) * 100;
    const currentHour = new Date().getHours();

    if (percentage < 25) {
      return "💧 Start your day with a glass of water to kickstart hydration!";
    } else if (percentage < 50) {
      return "🥤 Keep sipping! Try adding lemon or cucumber for flavor.";
    } else if (percentage < 75) {
      return "🌊 You're doing great! Maintain this pace throughout the day.";
    } else if (percentage < 100) {
      return "🎯 Almost there! Just a little more to reach your goal.";
    } else {
      return "🏆 Excellent hydration! Your body thanks you!";
    }
  }, [waterIntake, targetWaterIntake]);

  /**
   * Calculate water intake timing suggestions
   */
  const getWaterTimingSuggestions = useCallback(() => {
    const currentHour = new Date().getHours();
    const percentage = (waterIntake / targetWaterIntake) * 100;

    // Calculate expected percentage based on time of day
    const expectedPercentage = (currentHour / 24) * 100;

    if (percentage < expectedPercentage - 20) {
      return {
        status: "behind",
        message: "You're behind schedule. Consider drinking more water now.",
        urgency: "high",
      };
    } else if (percentage < expectedPercentage - 10) {
      return {
        status: "slightly_behind",
        message: "Try to catch up with your water intake.",
        urgency: "medium",
      };
    } else if (percentage > expectedPercentage + 20) {
      return {
        status: "ahead",
        message: "Great job! You're ahead of schedule.",
        urgency: "low",
      };
    } else {
      return {
        status: "on_track",
        message: "Perfect timing! Keep up the good work.",
        urgency: "low",
      };
    }
  }, [waterIntake, targetWaterIntake]);

  // Load saved water goal on component mount
  useEffect(() => {
    const savedGoal = localStorage.getItem(`water_goal_${user?.id || "user"}`);
    if (savedGoal) {
      const goal = parseFloat(savedGoal);
      if (goal > 0) {
        setTargetWaterIntake(goal);
        setWaterGoal(goal);
      }
    }
  }, [user]);

  // =====================================================
  // CLEAN USEEFFECT SECTION - REPLACE ALL YOUR USEEFFECTS WITH THIS
  // =====================================================

  // Single calculation function that handles all data processing
  const calculateAllData = useCallback(() => {
    if (!meals || !userMetrics) return;

    const targetCalories = userMetrics.daily_calories_target || 2000;

    // Calculate summary and get calorieDeficit
    const summaryWithDeficit = calculateDailySummary(meals, targetCalories);
    setDailySummary(summaryWithDeficit);

    // Update nutrition goals with deficit
    setNutritionGoals((prev) => ({
      ...prev,
      calorieDeficit: summaryWithDeficit.calorieDeficit,
      proteinTarget: userMetrics.protein_target || (targetCalories * 0.2) / 4,
      carbsTarget: userMetrics.carbs_target || (targetCalories * 0.5) / 4,
      fatTarget: userMetrics.fat_target || (targetCalories * 0.3) / 9,
      fiberTarget: userMetrics.fiber_target || 25,
    }));

    // Calculate food groups
    const groups = calculateFoodGroups(meals);
    setFoodGroups(groups);

    // Update daily meal types
    const mealTypes = updateDailyMealTypes(meals);
    setDailyMealTypes(mealTypes);
  }, [meals, userMetrics]);

  // Debounced save preferences
  const debouncedSavePreferences = useCallback(
    debounce(() => {
      if (favoriteFoods.length > 0 || recentFoods.length > 0) {
        saveUserFoodPreferences();
      }
    }, 1000),
    [favoriteFoods, recentFoods]
  );

  // Main data loading effect
  useEffect(() => {
    if (!user) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split("T")[0];

        // Load health metrics
        try {
          const metricsResponse = await userService.getHealthMetrics();
          if (metricsResponse) {
            setUserMetrics(metricsResponse);
            setTargetWaterIntake(metricsResponse.water_target || 2.5);
            setWaterGoal(metricsResponse.water_target || 2.5);
          }
        } catch (err) {
          console.error("Failed to load health metrics:", err);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Load meal history
        try {
          const mealsResponse = await nutritionService.getMealHistory({
            date: today,
          });
          let mealsData = [];
          if (mealsResponse?.results) {
            mealsData = mealsResponse.results;
          } else if (Array.isArray(mealsResponse)) {
            mealsData = mealsResponse;
          }
          setMeals(mealsData);
        } catch (err) {
          console.error("Failed to load meal history:", err);
          setMeals([]);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Load water history
        try {
          const waterResponse = await nutritionService.getWaterIntakeHistory({
            date: today,
          });
          if (waterResponse) {
            setWaterIntake(waterResponse.total_water || 0);
            setWaterHistory(waterResponse.entries || []);
          }
        } catch (err) {
          console.warn("Failed to load water intake data:", err);
        }

        // Load food database
        try {
          setFoodsLoading(true);
          const response = await nutritionService.getFoodList();
          if (Array.isArray(response)) {
            setAllFoods(response);
            setSearchResults(response);
          }
        } catch (err) {
          console.error("Error fetching foods:", err);
          setFoodsError("Failed to load food database.");
        } finally {
          setFoodsLoading(false);
        }

        loadUserFoodPreferences();
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load nutrition data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Calculate data when meals or metrics change
  useEffect(() => {
    calculateAllData();
  }, [calculateAllData]);

  // Update suggestions when foods or meal types change
  useEffect(() => {
    if (allFoods.length > 0 && dailyMealTypes) {
      const suggestions = generatePersonalizedSuggestions(
        allFoods,
        dailyMealTypes
      );
      setMealSuggestions(suggestions);
    }
  }, [allFoods, dailyMealTypes]);

  // Update search results when filters change
  useEffect(() => {
    if (allFoods.length > 0) {
      const filtered = getFilteredFoods(allFoods);
      setSearchResults(filtered);
    }
  }, [allFoods, activeTab, selectedCategories, sortBy]);

  // Save preferences with debouncing
  useEffect(() => {
    debouncedSavePreferences();
    return () => debouncedSavePreferences.cancel();
  }, [debouncedSavePreferences]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showAddMeal || showFoodSearch || showCustomFood) return;
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "m":
            event.preventDefault();
            setShowAddMeal(true);
            break;
          case "w":
            event.preventDefault();
            handleAddWater(0.25);
            break;
          case "r":
            event.preventDefault();
            window.location.reload();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showAddMeal, showFoodSearch, showCustomFood]);

  // Initialize component with daily reset check
  useEffect(() => {
    const initializeNutritionPage = async () => {
      // Reset daily data if needed
      resetDailyData();

      // Then fetch data
      await fetchNutritionData();
    };

    initializeNutritionPage();
  }, [resetDailyData, fetchNutritionData]);

  // Check for midnight reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const lastReset = localStorage.getItem("lastMealReset");
      const today = now.toDateString();

      // If it's a new day, reset data
      if (lastReset !== today) {
        resetDailyData();
        // Refresh data after reset
        fetchNutritionData();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [resetDailyData, fetchNutritionData]);

  useEffect(() => {
    const percentage = (caloriesConsumed / dailyCalorieTarget) * 100;

    // 50% warning
    if (percentage >= 50 && !calorieWarnings.fifty) {
      setCalorieWarnings((prev) => ({ ...prev, fifty: true }));
      alert(
        `You've consumed 50% of your daily calories (${caloriesConsumed}/${dailyCalorieTarget})`
      );
    }

    // 70% warning
    if (percentage >= 70 && !calorieWarnings.seventy) {
      setCalorieWarnings((prev) => ({ ...prev, seventy: true }));
      alert(
        `Warning: 70% of daily calories consumed (${caloriesConsumed}/${dailyCalorieTarget})`
      );
    }

    // 100% warning
    if (percentage >= 100 && !calorieWarnings.hundred) {
      setCalorieWarnings((prev) => ({ ...prev, hundred: true }));
      alert(
        `LIMIT REACHED: Daily calorie target exceeded (${caloriesConsumed}/${dailyCalorieTarget})`
      );
    }
  }, [caloriesConsumed, dailyCalorieTarget, calorieWarnings]);
  // =====================================================
  // MAIN COMPONENT RENDER
  // =====================================================

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading nutrition data...
        </span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
          <button
            onClick={refreshNutritionData}
            className="ml-4 px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-800 dark:text-green-200"
        >
          <div className="flex items-center">
            <FiCheckCircle className="mr-2" />
            <span>{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Nutrition Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                Meals logged: {mealCount}/{MAX_DAILY_MEALS}
              </span>
              <span>•</span>
              <span>
                Water: {Math.round((waterIntake / dailyWaterTarget) * 100)}%
              </span>
              <span>•</span>
              <span>
                Calories: {dailySummary.totalCalories}/{dailyCalorieTarget}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={refreshNutritionData}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center transition-colors"
              disabled={loading}
            >
              <FiRefreshCw className={loading ? "mr-2 animate-spin" : "mr-2"} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddMeal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiPlus className="mr-2" />
              Log Meal
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAddWater(0.25)}
            className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FiDroplet className="mr-2" />
            +250ml Water
          </button>
          <button
            onClick={() => handleAddWater(0.5)}
            className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FiDroplet className="mr-2" />
            +500ml Water
          </button>
          <button
            onClick={handleCustomWaterAmount}
            className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <FiPlus className="mr-2" />
            Custom Water
          </button>

          {getWaterTimingSuggestions().urgency === "high" && (
            <div className="flex items-center px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg">
              <FiClock className="mr-2" />
              {getWaterTimingSuggestions().message}
            </div>
          )}
        </div>
      </motion.div>

      {/* Hydration Tip */}
      {getHydrationTip() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
              <FiDroplet className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Hydration Tip
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {getHydrationTip()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Daily Summary Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Calorie Intake Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-primary-600" />
            Daily Calories
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Consumed</span>
              <span className="font-bold text-lg">
                {Math.round(dailySummary.totalCalories)} kcal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Target</span>
              <span className="text-gray-700 dark:text-gray-300">
                {dailyCalorieTarget} kcal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Remaining
              </span>
              <span
                className={
                  dailyCalorieTarget - dailySummary.totalCalories >= 0
                    ? "font-medium text-green-600 dark:text-green-400"
                    : "font-medium text-red-600 dark:text-red-400"
                }
              >
                {Math.round(dailyCalorieTarget - dailySummary.totalCalories)}{" "}
                kcal
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
            <div
              className={
                dailySummary.totalCalories > dailySummary.targetCalories
                  ? "h-3 rounded-full transition-all duration-500 bg-red-500 dark:bg-red-600"
                  : "h-3 rounded-full transition-all duration-500 bg-primary-600 dark:bg-primary-500"
              }
              style={{
                width:
                  Math.min(
                    100,
                    (dailySummary.totalCalories / dailySummary.targetCalories) *
                      100
                  ) + "%",
              }}
            ></div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="font-bold text-red-600 dark:text-red-400">
                {Math.round(dailySummary.totalProtein)}g
              </div>
              <div className="text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div>
              <div className="font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(dailySummary.totalCarbs)}g
              </div>
              <div className="text-gray-600 dark:text-gray-400">Carbs</div>
            </div>
            <div>
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {Math.round(dailySummary.totalFat)}g
              </div>
              <div className="text-gray-600 dark:text-gray-400">Fat</div>
            </div>
          </div>

          {dailySummary.totalFiber > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Fiber</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {Math.round(dailySummary.totalFiber)}g
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Food Group Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FiPieChart className="mr-2 text-secondary-600" />
            Food Groups
          </h2>
          <div className="space-y-3">
            {Object.entries(foodGroups).map(([group, data]) => (
              <div key={group}>
                {data.count > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="capitalize text-gray-600 dark:text-gray-400 text-sm">
                        {group}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {data.count} items
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({data.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={
                          group === "protein"
                            ? "h-2 rounded-full transition-all duration-500 bg-red-500"
                            : group === "carbs"
                            ? "h-2 rounded-full transition-all duration-500 bg-yellow-500"
                            : group === "fat"
                            ? "h-2 rounded-full transition-all duration-500 bg-purple-500"
                            : group === "fruit"
                            ? "h-2 rounded-full transition-all duration-500 bg-green-500"
                            : group === "vegetable"
                            ? "h-2 rounded-full transition-all duration-500 bg-emerald-500"
                            : group === "dairy"
                            ? "h-2 rounded-full transition-all duration-500 bg-blue-500"
                            : group === "grain"
                            ? "h-2 rounded-full transition-all duration-500 bg-amber-500"
                            : "h-2 rounded-full transition-all duration-500 bg-gray-500"
                        }
                        style={{ width: data.percentage + "%" }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {data.calories} calories from {group}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {Object.values(foodGroups).every((data) => data.count === 0) && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <FiPieChart className="mx-auto mb-2" size={24} />
              <p>Log your first meal to see food group breakdown</p>
            </div>
          )}
        </motion.div>

        {/* Water Intake Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <FiDroplet className="mr-2 text-blue-600" />
              Water Intake
            </h2>
            <button
              onClick={() => setShowWaterDetails(!showWaterDetails)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <FiChevronDown
                className={
                  showWaterDetails
                    ? "transform transition-transform rotate-180"
                    : "transform transition-transform"
                }
              />
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-48 bg-gray-200 dark:bg-gray-700 rounded-b-xl rounded-t-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              {/* Water fill animation */}
              <div
                className={
                  "absolute bottom-0 w-full transition-all duration-500 ease-out " +
                  getWaterFillColor()
                }
                style={{
                  height:
                    Math.min((waterIntake / targetWaterIntake) * 100, 100) +
                    "%",
                }}
              ></div>

              {/* Water measurement lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 px-1">
                {[1, 0.75, 0.5, 0.25, 0].map((fraction, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="w-2 h-0.5 bg-gray-400"></div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {(targetWaterIntake * fraction).toFixed(1)}L
                    </span>
                  </div>
                ))}
              </div>

              {/* Overflow indicator */}
              {waterIntake > targetWaterIntake && (
                <div className="absolute -top-2 left-0 right-0 flex justify-center">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    +{(waterIntake - targetWaterIntake).toFixed(1)}L
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-xl font-bold">{waterIntake.toFixed(1)}L</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              of {dailyWaterTarget}L daily target
            </div>
            <div
              className={
                getWaterStatus().color === "green"
                  ? "text-sm font-medium mt-1 text-green-600 dark:text-green-400"
                  : getWaterStatus().color === "blue"
                  ? "text-sm font-medium mt-1 text-blue-600 dark:text-blue-400"
                  : getWaterStatus().color === "yellow"
                  ? "text-sm font-medium mt-1 text-yellow-600 dark:text-yellow-400"
                  : "text-sm font-medium mt-1 text-red-600 dark:text-red-400"
              }
            >
              {getWaterStatus().message}
            </div>
          </div>

          {/* Water History (collapsible) */}
          {showWaterDetails && waterHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium mb-2">Today's Water Log</h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {waterHistory.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {entry.time}
                    </span>
                    <div className="flex items-center">
                      <span>{entry.amount}L</span>
                      <button
                        onClick={() =>
                          handleRemoveWaterEntry(entry.id, entry.amount)
                        }
                        className="ml-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Continue with other sections here... */}

      {/* Today's Meals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center">
            <FiCalendar className="mr-2 text-primary-600" />
            Today's Meals
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={filterByMealType}
              onChange={(e) => setFilterByMealType(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        {meals.length > 0 ? (
          <div className="space-y-4">
            {/* Meal Type Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.entries(dailyMealTypes).map(([mealType, status]) => (
                <div
                  key={mealType}
                  className={
                    status.logged
                      ? "p-3 rounded-lg border-2 transition-all duration-200 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "p-3 rounded-lg border-2 transition-all duration-200 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize text-sm font-medium">
                      {mealType}
                    </span>
                    {status.logged ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <FiCheck className="text-white" size={14} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                        <FiPlus className="text-gray-400" size={14} />
                      </div>
                    )}
                  </div>
                  {!status.logged && (
                    <button
                      onClick={() => {
                        setMealType(mealType);
                        setShowAddMeal(true);
                      }}
                      className="mt-2 w-full text-xs py-1 px-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      Log {mealType}
                    </button>
                  )}
                  {status.logged && (
                    <div className="mt-2 flex space-x-1">
                      <button
                        onClick={() => {
                          const meal = meals.find(
                            (m) => m.id === status.mealId
                          );
                          setEditingMeal(meal);
                          setShowEditMeal(true);
                        }}
                        className="flex-1 text-xs py-1 px-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMeal({
                            id: status.mealId,
                            type: mealType,
                          });
                          setShowDeleteConfirm(true);
                        }}
                        className="flex-1 text-xs py-1 px-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detailed Meals List */}
            {meals
              .filter(
                (meal) =>
                  filterByMealType === "all" ||
                  (meal.meal_type || meal.type) === filterByMealType
              )
              .map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={
                          (meal.meal_type || meal.type) === "breakfast"
                            ? "w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-yellow-100 dark:bg-yellow-900/30"
                            : (meal.meal_type || meal.type) === "lunch"
                            ? "w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-orange-100 dark:bg-orange-900/30"
                            : (meal.meal_type || meal.type) === "dinner"
                            ? "w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-purple-100 dark:bg-purple-900/30"
                            : "w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-green-100 dark:bg-green-900/30"
                        }
                      >
                        {(meal.meal_type || meal.type) === "breakfast"}
                        {(meal.meal_type || meal.type) === "lunch"}
                        {(meal.meal_type || meal.type) === "dinner"}
                        {(meal.meal_type || meal.type) === "snack"}
                      </div>
                      <div>
                        <span className="capitalize font-medium text-lg">
                          {meal.meal_type || meal.type}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <FiClock className="mr-1" size={14} />
                            {new Date(
                              meal.timestamp ||
                                meal.date_logged ||
                                meal.time_logged
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {(meal.portion_size || meal.size) && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                              {meal.portion_size || meal.size} portion
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mt-3 md:mt-0">
                      <div className="text-right mr-4">
                        <div className="font-bold text-lg">
                          {Math.round(
                            meal.total_calories || meal.calories || 0
                          )}{" "}
                          kcal
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          P:{" "}
                          {Math.round(meal.total_protein || meal.protein || 0)}g
                          • C:{" "}
                          {Math.round(
                            meal.total_carbs || meal.carbohydrates || 0
                          )}
                          g • F: {Math.round(meal.total_fat || meal.fat || 0)}g
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMeal(meal);
                            setShowMealDetails(true);
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiSearch size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingMeal(meal);
                            setShowEditMeal(true);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit Meal"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMeal(meal);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Meal"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Food Items in Meal */}
                  {meal.items && meal.items.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-3">
                      <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Food Items ({meal.items.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {meal.items.map((item, itemIndex) => (
                          <div
                            key={item.id || itemIndex}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">
                              {Math.round(
                                item.calories || item.energy_kcal || 0
                              )}{" "}
                              kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No meals logged yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start tracking your nutrition by logging your first meal of the
              day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAddMeal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Log Your First Meal
              </button>
              <button
                onClick={() => {
                  const currentHour = new Date().getHours();
                  const suggestedMealType =
                    currentHour < 10
                      ? "breakfast"
                      : currentHour < 15
                      ? "lunch"
                      : currentHour < 20
                      ? "dinner"
                      : "snack";
                  handleCopyPreviousMeal(suggestedMealType);
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" />
                Copy From Yesterday
              </button>
            </div>
          </div>
        )}
      </motion.div>
      {/* Meal Suggestions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center">
            <FiStar className="mr-2 text-primary-600" />
            Meal Suggestions
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const suggestions = generatePersonalizedSuggestions(allFoods);
                setMealSuggestions(suggestions);
                showSuccessMessage("Suggestions refreshed!");
              }}
              className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center"
            >
              <FiRefreshCw className="mr-1" size={14} />
              Refresh
            </button>
          </div>
        </div>

        {foodsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading suggestions...
            </span>
          </div>
        ) : foodsError ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{foodsError}</span>
            </div>
          </div>
        ) : mealSuggestions.length > 0 ? (
          <div>
            {/* Meal Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mealSuggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Suggestion Header */}
                  <div
                    className={
                      suggestion.type === "breakfast"
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/20 p-4 border-b border-gray-200 dark:border-gray-700"
                        : suggestion.type === "lunch"
                        ? "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/20 p-4 border-b border-gray-200 dark:border-gray-700"
                        : suggestion.type === "dinner"
                        ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/20 p-4 border-b border-gray-200 dark:border-gray-700"
                        : "bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/20 p-4 border-b border-gray-200 dark:border-gray-700"
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.name}
                      </h3>
                      <div className="text-2xl">
                        {suggestion.type === "breakfast"}
                        {suggestion.type === "lunch"}
                        {suggestion.type === "dinner"}
                        {suggestion.type === "snack"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                  </div>

                  {/* Suggestion Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(suggestion.calories)} calories
                      </span>
                      <div className="flex items-center">
                        {suggestion.canLog ? (
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            Already logged
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Food Items List */}
                    <div className="space-y-1.5 mb-4 max-h-32 overflow-y-auto">
                      {suggestion.items &&
                        suggestion.items.map((item, idx) => (
                          <div
                            key={suggestion.id + "-item-" + idx}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                              <span className="text-gray-700 dark:text-gray-300 text-xs">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              {Math.round(
                                item.energy_kcal || item.calories || 0
                              )}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddSuggestedMeal(suggestion)}
                        disabled={!suggestion.canLog}
                        className={
                          suggestion.canLog
                            ? "w-full py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                            : "w-full py-2 text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                        }
                      >
                        {suggestion.canLog ? "Add to Today" : "Already Logged"}
                      </button>

                      <button
                        onClick={() => {
                          // Add all items from suggestion to selected foods for manual meal creation
                          setSelectedFoodItems(suggestion.items);
                          setMealType(suggestion.type);
                          setShowAddMeal(true);
                        }}
                        className="w-full py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Customize & Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestion Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <FiStar
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Personalized Suggestions
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    These meal suggestions are generated based on available
                    foods in our database. You can add them directly or
                    customize them to match your preferences.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full">
                      🎯 Balanced nutrition
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full">
                      ⏰ Time-appropriate
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full">
                      🔄 Refreshed daily
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestion Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    // Add all available suggestions
                    const availableSuggestions = mealSuggestions.filter(
                      (s) => s.canLog
                    );
                    if (availableSuggestions.length === 0) {
                      showErrorMessage("No available meal suggestions to add.");
                      return;
                    }

                    availableSuggestions.forEach((suggestion, index) => {
                      setTimeout(() => {
                        handleAddSuggestedMeal(suggestion);
                      }, index * 1000); // Stagger the additions
                    });
                  }}
                  className="px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center"
                >
                  <FiPlus className="mr-2" size={14} />
                  Add All Available
                </button>

                <button
                  onClick={() => {
                    const currentHour = new Date().getHours();
                    let recommendedMeal = null;

                    if (currentHour >= 6 && currentHour < 10) {
                      recommendedMeal = mealSuggestions.find(
                        (s) => s.type === "breakfast" && s.canLog
                      );
                    } else if (currentHour >= 11 && currentHour < 15) {
                      recommendedMeal = mealSuggestions.find(
                        (s) => s.type === "lunch" && s.canLog
                      );
                    } else if (currentHour >= 17 && currentHour < 21) {
                      recommendedMeal = mealSuggestions.find(
                        (s) => s.type === "dinner" && s.canLog
                      );
                    } else {
                      recommendedMeal = mealSuggestions.find(
                        (s) => s.type === "snack" && s.canLog
                      );
                    }

                    if (recommendedMeal) {
                      handleAddSuggestedMeal(recommendedMeal);
                    } else {
                      showErrorMessage(
                        "No recommended meal available for this time."
                      );
                    }
                  }}
                  className="px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center"
                >
                  <FiClock className="mr-2" size={14} />
                  Add Recommended Now
                </button>

                <button
                  onClick={() => {
                    // Show only suggestions that match user's dietary preferences
                    if (user?.pref_diet) {
                      const dietaryPrefs = user.pref_diet.split(",");
                      alert(
                        "Filtering by dietary preferences: " +
                          dietaryPrefs.join(", ")
                      );
                      // This would filter suggestions based on dietary preferences
                    } else {
                      alert(
                        "Set your dietary preferences in your profile for personalized suggestions!"
                      );
                    }
                  }}
                  className="px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center"
                >
                  <FiFilter className="mr-2" size={14} />
                  Filter by Diet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No suggestions available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              We're loading meal suggestions for you. Please wait a moment.
            </p>
            <button
              onClick={() => {
                if (allFoods.length > 0) {
                  const suggestions = generatePersonalizedSuggestions(allFoods);
                  setMealSuggestions(suggestions);
                } else {
                  fetchAllFoods();
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center mx-auto"
            >
              <FiRefreshCw className="mr-2" />
              Generate Suggestions
            </button>
          </div>
        )}
      </motion.div>
      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Log a Meal</h2>
                <button
                  onClick={() => {
                    setShowAddMeal(false);
                    setSelectedFoodItems([]);
                    setShowFoodSearch(false);
                    setShowCustomFood(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Meal Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meal Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setMealType(type)}
                          className={
                            mealType === type
                              ? "p-3 rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium capitalize"
                              : "p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors capitalize"
                          }
                          disabled={!canLogMealType(type)}
                        >
                          {type}
                          {!canLogMealType(type) && (
                            <span className="block text-xs text-red-500 mt-1">
                              Already logged
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portion Size
                    </label>
                    <div className="flex space-x-2">
                      {["small", "medium", "large"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setMealSize(size)}
                          className={
                            mealSize === size
                              ? "flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium capitalize"
                              : "flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors capitalize"
                          }
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Food Items Summary */}
                  {selectedFoodItems.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Selected Items ({selectedFoodItems.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedFoodItems.map((item) => {
                          const nutrition = calculatePortionNutrition(
                            item,
                            mealSize
                          );
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between items-center bg-white dark:bg-gray-600 p-2 rounded-lg"
                            >
                              <div className="flex items-center">
                                <span className="font-medium text-sm">
                                  {item.name}
                                </span>
                                {item.isCustom && (
                                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm mr-2">
                                  {nutrition.calories} kcal
                                </span>
                                <button
                                  onClick={() =>
                                    handleRemoveFoodFromMeal(item.id)
                                  }
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Calories:</span>
                          <span>{calculateSelectedItemsTotal()} kcal</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Food Selection */}
                <div className="space-y-4">
                  {!showFoodSearch && !showCustomFood && (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowFoodSearch(true)}
                        className="w-full py-3 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-center"
                      >
                        <FiSearch size={18} className="mr-2" />
                        Search Food Database
                      </button>
                      <button
                        onClick={() => setShowCustomFood(true)}
                        className="w-full py-3 bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <FiPlus size={18} className="mr-2" />
                        Add Custom Food
                      </button>
                    </div>
                  )}

                  {/* Food Search Interface */}
                  {showFoodSearch && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Search Foods</h3>
                        <button
                          onClick={() => setShowFoodSearch(false)}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Back
                        </button>
                      </div>

                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search foods..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSearch className="text-gray-400" />
                        </div>
                        {searchLoading && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                          </div>
                        )}
                      </div>

                      {/* Food Tabs */}
                      <div className="flex space-x-2">
                        {["all", "favorites", "recent"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={
                              activeTab === tab
                                ? "px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg capitalize"
                                : "px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors capitalize"
                            }
                          >
                            {tab}
                            {tab === "favorites" &&
                              favoriteFoods.length > 0 && (
                                <span className="ml-1 text-xs">
                                  ({favoriteFoods.length})
                                </span>
                              )}
                            {tab === "recent" && recentFoods.length > 0 && (
                              <span className="ml-1 text-xs">
                                ({recentFoods.length})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Food Categories Filter */}
                      {getAvailableCategories().length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Filter by Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getAvailableCategories()
                              .slice(0, 6)
                              .map((category) => (
                                <button
                                  key={category}
                                  onClick={() => toggleCategoryFilter(category)}
                                  className={
                                    selectedCategories.includes(category)
                                      ? "px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full capitalize"
                                      : "px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors capitalize"
                                  }
                                >
                                  {category}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Food Results */}
                      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                        {searchResults.length > 0 ? (
                          searchResults.map((food) => (
                            <div
                              key={food.id}
                              className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center cursor-pointer"
                              onClick={() => handleAddFoodToMeal(food)}
                            >
                              <div className="flex items-center">
                                <div>
                                  <div className="font-medium text-sm">
                                    {food.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {food.category && (
                                      <span className="capitalize">
                                        {food.category} •{" "}
                                      </span>
                                    )}
                                    P: {food.protein || 0}g | C:{" "}
                                    {food.carbohydrates || food.carbs || 0}g |
                                    F: {food.fat || 0}g
                                  </div>
                                </div>
                                <div className="ml-2 flex items-center">
                                  {favoriteFoods.find(
                                    (f) => f.id === food.id
                                  ) && (
                                    <FiStar
                                      className="text-yellow-500 mr-1"
                                      size={12}
                                    />
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavoriteFood(food);
                                    }}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                  >
                                    <FiStar
                                      className={
                                        favoriteFoods.find(
                                          (f) => f.id === food.id
                                        )
                                          ? "text-yellow-500"
                                          : "text-gray-400"
                                      }
                                      size={12}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {food.energy_kcal || food.calories || 0} kcal
                              </div>
                            </div>
                          ))
                        ) : searchQuery ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No foods found matching "{searchQuery}"
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            {activeTab === "favorites" &&
                            favoriteFoods.length === 0
                              ? "No favorite foods yet. Star foods to add them here!"
                              : activeTab === "recent" &&
                                recentFoods.length === 0
                              ? "No recent foods. Foods you use will appear here."
                              : "Type to search for foods"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Custom Food Interface */}
                  {showCustomFood && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Add Custom Food</h3>
                        <button
                          onClick={() => setShowCustomFood(false)}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Back
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Food Name*
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={customFood.name}
                            onChange={handleCustomFoodChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Homemade Granola"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Calories*
                            </label>
                            <input
                              type="number"
                              name="energy_kcal"
                              value={customFood.energy_kcal}
                              onChange={handleCustomFoodChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="kcal"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Category
                            </label>
                            <select
                              name="category"
                              value={customFood.category}
                              onChange={handleCustomFoodChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="protein">Protein</option>
                              <option value="fruit">Fruit</option>
                              <option value="vegetable">Vegetable</option>
                              <option value="grain">Grain</option>
                              <option value="dairy">Dairy</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Protein (g)
                            </label>
                            <input
                              type="number"
                              name="protein"
                              value={customFood.protein}
                              onChange={handleCustomFoodChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Carbs (g)
                            </label>
                            <input
                              type="number"
                              name="carbohydrates"
                              value={customFood.carbohydrates}
                              onChange={handleCustomFoodChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Fat (g)
                            </label>
                            <input
                              type="number"
                              name="fat"
                              value={customFood.fat}
                              onChange={handleCustomFoodChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Serving Size
                          </label>
                          <input
                            type="text"
                            name="serving_size"
                            value={customFood.serving_size}
                            onChange={handleCustomFoodChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            placeholder="1 cup, 100g, etc."
                          />
                        </div>

                        <button
                          onClick={handleAddCustomFood}
                          disabled={!customFood.name || !customFood.energy_kcal}
                          className={
                            customFood.name && customFood.energy_kcal
                              ? "w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              : "w-full py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                          }
                        >
                          Add Custom Food
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddMeal(false);
                    setSelectedFoodItems([]);
                    setShowFoodSearch(false);
                    setShowCustomFood(false);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMeal}
                  disabled={selectedFoodItems.length === 0 || loading}
                  className={
                    selectedFoodItems.length > 0 && !loading
                      ? "flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                      : "flex-1 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center"
                  }
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>Save Meal ({selectedFoodItems.length} items)</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Meal Details Modal */}
      {showMealDetails && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {selectedMeal.meal_type || selectedMeal.type} Details
                </h2>
                <button
                  onClick={() => {
                    setShowMealDetails(false);
                    setSelectedMeal(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Nutrition Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Calories:
                      </span>
                      <span className="ml-2 font-medium">
                        {Math.round(
                          selectedMeal.total_calories ||
                            selectedMeal.calories ||
                            0
                        )}{" "}
                        kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Protein:
                      </span>
                      <span className="ml-2 font-medium">
                        {Math.round(
                          selectedMeal.total_protein ||
                            selectedMeal.protein ||
                            0
                        )}
                        g
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Carbs:
                      </span>
                      <span className="ml-2 font-medium">
                        {Math.round(
                          selectedMeal.total_carbs ||
                            selectedMeal.carbohydrates ||
                            0
                        )}
                        g
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Fat:
                      </span>
                      <span className="ml-2 font-medium">
                        {Math.round(
                          selectedMeal.total_fat || selectedMeal.fat || 0
                        )}
                        g
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Meal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Time:
                      </span>
                      <span>
                        {new Date(
                          selectedMeal.timestamp ||
                            selectedMeal.date_logged ||
                            selectedMeal.time_logged
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Portion:
                      </span>
                      <span className="capitalize">
                        {selectedMeal.portion_size ||
                          selectedMeal.size ||
                          "Medium"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedMeal.items && selectedMeal.items.length > 0 ? (
                  <div>
                    <h3 className="font-medium mb-2">Food Items</h3>
                    <div className="space-y-2">
                      {selectedMeal.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(item.calories || item.energy_kcal || 0)}{" "}
                            kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedMeal.food ? (
                  <div>
                    <h3 className="font-medium mb-2">Food Item</h3>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {selectedMeal.food.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.round(
                            selectedMeal.food.energy_kcal ||
                              selectedMeal.food.calories ||
                              0
                          )}{" "}
                          kcal
                        </span>
                      </div>
                      {selectedMeal.food.category && (
                        <div className="mt-1">
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                            {selectedMeal.food.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setShowMealDetails(false);
                    setEditingMeal(selectedMeal);
                    setShowEditMeal(true);
                  }}
                  className="flex-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Edit Meal
                </button>
                <button
                  onClick={() => {
                    setShowMealDetails(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Delete Meal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                  <FiTrash2
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Delete Meal</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this{" "}
                <span className="font-medium capitalize">
                  {selectedMeal.meal_type || selectedMeal.type}
                </span>{" "}
                meal? This will remove it from your daily nutrition tracking.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedMeal(null);
                  }}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleDeleteMeal(
                      selectedMeal.id,
                      selectedMeal.meal_type || selectedMeal.type
                    )
                  }
                  disabled={loading}
                  className={
                    loading
                      ? "flex-1 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center"
                      : "flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  }
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2" size={16} />
                      Delete Meal
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
});

export default NutritionPage;
