/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
} from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiDroplet,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
  FiTarget,
  FiRefreshCw,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as nutritionService from "../services/nutrition";
import * as activityService from "../services/activity";

const Dashboard = memo(() => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Real synchronized stats (from actual daily data)
  const [stats, setStats] = useState({
    calories: { consumed: 0, target: 2000 },
    water: { consumed: 0, target: 2.5 },
    activity: { burned: 0, target: 500 },
    steps: { count: 0, target: 10000 },
  });

  // Recent data
  const [recentMeals, setRecentMeals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // User goals (from user context like other pages)
  const [goals, setGoals] = useState({
    weight: { current: 0, target: 0, progress: 0 },
    activity: { current: 0, target: 0, progress: 0 },
    water: { average: 0, target: 0, progress: 0 },
  });

  /**
   * Update goals from user context (same pattern as other pages)
   */
  useEffect(() => {
    if (user) {
      setGoals({
        weight: {
          current: user.weight || 0,
          target: user.weight_goal || user.weight || 0,
          progress:
            user.weight && user.weight_goal
              ? Math.round(
                  ((user.weight_goal -
                    Math.abs(user.weight - user.weight_goal)) /
                    user.weight_goal) *
                    100
                )
              : 30,
        },
        activity: {
          current: 0, // Will be calculated from actual activity data
          target: user.weekly_activity_goal || 4,
          progress: 0, // Will be calculated from actual activity data
        },
        water: {
          average: 0, // Will be calculated from actual water data
          target: user.daily_water_goal || 2.5,
          progress: 0, // Will be calculated from actual water data
        },
      });

      // Update targets from user context including activity target
      setStats((prev) => ({
        ...prev,
        calories: {
          ...prev.calories,
          target: user.target_daily_calories || 2000,
        },
        water: { ...prev.water, target: user.daily_water_goal || 2.5 },
        steps: { ...prev.steps, target: user.daily_steps_goal || 10000 },
        activity: {
          ...prev.activity,
          target: user.target_daily_calories
            ? Math.round(user.target_daily_calories * 0.2)
            : 400,
        },
      }));
    }
  }, [user]);

  /**
   * Fetch today's nutrition data (same pattern as nutrition page)
   */
  const fetchTodayNutrition = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Get today's meals
      const mealsResponse = await nutritionService.getMealHistory({
        date: today,
        limit: 5,
      });

      let todayMeals = [];
      let totalCalories = 0;

      if (mealsResponse?.results) {
        // Filter to ensure only today's meals
        todayMeals = mealsResponse.results.filter((meal) => {
          if (meal.date_logged === today) return true;
          if (meal.timestamp) {
            const mealDate = meal.timestamp.split("T")[0];
            return mealDate === today;
          }
          return false;
        });

        // Calculate total calories from meals
        totalCalories = todayMeals.reduce((sum, meal) => {
          return sum + (meal.energy_kcal || meal.calories || 0);
        }, 0);

        // Format meals for display with better food name fetching
        const formattedMeals = await Promise.all(
          todayMeals.map(async (meal) => {
            let foodName = meal.food_name || meal.name;

            // If no food name found, try to fetch from food database using food_id
            if (!foodName && meal.food_id) {
              try {
                const foodResponse = await nutritionService.getFoodList();
                const foods = Array.isArray(foodResponse)
                  ? foodResponse
                  : foodResponse?.results || [];
                const foodItem = foods.find((food) => food.id === meal.food_id);
                if (foodItem) {
                  foodName = foodItem.name;
                }
              } catch (err) {
                console.warn("Could not fetch food name:", err);
              }
            }

            return {
              id: meal.id,
              name: foodName || "", // Empty string if no name found
              calories: Math.round(meal.energy_kcal || meal.calories || 0),
              timestamp: meal.timestamp || meal.date_logged + "T12:00:00Z",
              portion_size: meal.portion_size || "medium",
              meal_type: meal.meal_type || "snack",
            };
          })
        );

        setRecentMeals(formattedMeals);
      }

      // Get today's water intake
      let waterConsumed = 0;
      try {
        const waterResponse = await nutritionService.getWaterIntakeHistory({
          date: today,
        });
        if (waterResponse) {
          waterConsumed = waterResponse.total_water || 0;
        }
      } catch (err) {
        console.warn("Failed to load water data:", err);
      }

      // Update stats with nutrition data
      setStats((prev) => ({
        ...prev,
        calories: { ...prev.calories, consumed: Math.round(totalCalories) },
        water: { ...prev.water, consumed: Math.round(waterConsumed * 10) / 10 },
      }));

      // Update water goal progress with better calculation
      const waterProgress =
        waterConsumed > 0 && user?.daily_water_goal > 0
          ? Math.round((waterConsumed / user.daily_water_goal) * 100)
          : 0;

      setGoals((prev) => ({
        ...prev,
        water: {
          average: Math.round(waterConsumed * 10) / 10, // Today's actual consumption
          target: user?.daily_water_goal || 2.5,
          progress: Math.min(waterProgress, 100),
        },
      }));
    } catch (err) {
      console.error("Error fetching nutrition data:", err);
    }
  }, []);

  /**
   * Fetch today's activity data (same pattern as activity page)
   */
  const fetchTodayActivity = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Get today's activities
      const activitiesResponse = await activityService.getActivityHistory({
        date: today,
        limit: 5,
      });

      let todayActivities = [];
      let totalCaloriesBurned = 0;
      let totalWorkouts = 0;

      if (activitiesResponse?.results) {
        // Filter to ensure only today's activities
        todayActivities = activitiesResponse.results.filter((activity) => {
          if (activity.date === today) return true;
          if (activity.date_logged === today) return true;
          if (activity.timestamp) {
            const activityDate = activity.timestamp.split("T")[0];
            return activityDate === today;
          }
          return false;
        });

        // Calculate totals
        totalCaloriesBurned = todayActivities.reduce((sum, activity) => {
          return sum + (activity.calories_burned || 0);
        }, 0);

        totalWorkouts = todayActivities.length;

        // Format activities for display
        const formattedActivities = todayActivities.map((activity) => ({
          id: activity.id,
          name: activity.activity_type || activity.name || "Exercise",
          calories_burned: Math.round(activity.calories_burned || 0),
          duration_minutes: activity.duration_minutes || activity.duration || 0,
          timestamp:
            activity.timestamp ||
            activity.date_logged + "T12:00:00Z" ||
            activity.time ||
            activity.created_at,
          date: activity.date || today,
        }));

        setRecentActivities(formattedActivities);
      }

      // Get today's steps
      let todaySteps = 0;
      try {
        const stepsResponse = await activityService.getStepsHistory({
          date: today,
        });

        if (stepsResponse?.results?.length > 0) {
          const todayStepEntry = stepsResponse.results.find(
            (entry) => entry.date === today
          );
          todaySteps = todayStepEntry?.steps || 0;
        }
      } catch (err) {
        console.warn("Failed to load steps data:", err);
      }

      // Update stats with activity data
      setStats((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          burned: Math.round(totalCaloriesBurned),
          target: user?.target_daily_calories
            ? Math.round(user.target_daily_calories * 0.2)
            : 400, // 20% of daily calories as burn target
        },
        steps: { ...prev.steps, count: todaySteps },
      }));

      // Update activity goal progress (weekly basis)
      const weeklyProgress =
        totalWorkouts > 0 && user?.weekly_activity_goal
          ? Math.round((totalWorkouts / user.weekly_activity_goal) * 100)
          : 0;

      setGoals((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          current: totalWorkouts,
          progress: Math.min(weeklyProgress, 100),
        },
      }));
    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  }, [user]);

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        setError(null);

        if (!user) {
          return;
        }

        // Fetch all data in parallel for speed
        await Promise.all([fetchTodayNutrition(), fetchTodayActivity()]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load your dashboard data. Please try again later.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user, fetchTodayNutrition, fetchTodayActivity]
  );

  /**
   * Handle manual refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Load data on mount and when user changes
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Navigation handlers for quick actions
  const handleLogMeal = () => navigate("/app/nutrition");
  const handleLogActivity = () => navigate("/app/activity");
  const handleLogWater = () => navigate("/app/nutrition?tab=water");
  const handleUpdateGoals = () => navigate("/app/profile");

  // Helper function to format date/time
  const formatDateTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Recently";
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const itemDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      if (itemDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString();
      }
    } catch (err) {
      return "Recently";
    }
  };

  // Get today's date in a nice format
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-red-700 dark:text-red-400">
        <h3 className="font-semibold mb-2">Unable to Load Dashboard</h3>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user?.username || "User"}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{today}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`${refreshing ? "animate-spin" : ""}`}
                size={18}
              />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Calories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiBarChart2
                className="text-orange-600 dark:text-orange-400"
                size={24}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round(
                (stats.calories.consumed / stats.calories.target) * 100
              )}
              %
            </span>
          </div>
          <h3 className="font-semibold mt-3 mb-2">Calories</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Consumed</span>
              <span className="font-medium">{stats.calories.consumed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">{stats.calories.target}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (stats.calories.consumed / stats.calories.target) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Water */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiDroplet
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round((stats.water.consumed / stats.water.target) * 100)}%
            </span>
          </div>
          <h3 className="font-semibold mt-3 mb-2">Water</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Consumed</span>
              <span className="font-medium">{stats.water.consumed}L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">{stats.water.target}L</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (stats.water.consumed / stats.water.target) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiActivity
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round((stats.steps.count / stats.steps.target) * 100)}%
            </span>
          </div>
          <h3 className="font-semibold mt-3 mb-2">Steps</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Count</span>
              <span className="font-medium">
                {stats.steps.count.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">
                {stats.steps.target.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (stats.steps.count / stats.steps.target) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Calories Burned */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiTrendingUp
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.activity.burned}
            </span>
          </div>
          <h3 className="font-semibold mt-3 mb-2">Calories Burned</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Today</span>
              <span className="font-medium">{stats.activity.burned} cal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Activities
              </span>
              <span className="font-medium">{goals.activity.current || 0}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleLogMeal}
            className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
          >
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
              <FiBarChart2
                className="text-orange-600 dark:text-orange-400"
                size={24}
              />
            </div>
            <p className="font-medium text-center">Log Meal</p>
          </button>

          <button
            onClick={handleLogActivity}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
              <FiActivity
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
            <p className="font-medium text-center">Log Activity</p>
          </button>

          <button
            onClick={handleLogWater}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
              <FiDroplet
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
            <p className="font-medium text-center">Log Water</p>
          </button>

          <button
            onClick={handleUpdateGoals}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
              <FiTarget
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
            <p className="font-medium text-center">Update Goals</p>
          </button>
        </div>
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Weight Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
              <FiTarget
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
            </div>
            <div>
              <h3 className="font-medium">Weight Goal</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user?.goal === "weight_loss"
                  ? "Lose Weight"
                  : user?.goal === "weight_gain"
                  ? "Gain Weight"
                  : user?.goal === "maintain"
                  ? "Maintain Weight"
                  : user?.goal === "build_muscle"
                  ? "Build Muscle"
                  : "Improve Health"}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Current: {goals.weight.current}kg</span>
              <span>Target: {goals.weight.target}kg</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(goals.weight.progress || 0, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {goals.weight.progress || 0}% completed
            </p>
          </div>
        </div>

        {/* Activity Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg mr-3">
              <FiActivity
                className="text-secondary-600 dark:text-secondary-400"
                size={20}
              />
            </div>
            <div>
              <h3 className="font-medium">Weekly Workouts</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Exercise {goals.activity.target} times per week
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>This week: {goals.activity.current}</span>
              <span>Target: {goals.activity.target}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-secondary-600 dark:bg-secondary-500 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(goals.activity.progress || 0, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {goals.activity.progress || 0}% completed
            </p>
          </div>
        </div>

        {/* Water Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <FiDroplet
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>
            <div>
              <h3 className="font-medium">Daily Hydration</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {goals.water.target}L daily target
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Today: {goals.water.average}L</span>
              <span>Target: {goals.water.target}L</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(goals.water.progress || 0, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {goals.water.progress || 0}% of daily goal
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Meals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Meals</h2>
            <Link
              to="/app/nutrition"
              className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
            >
              View all
            </Link>
          </div>

          {recentMeals.length > 0 ? (
            <div className="space-y-3">
              {recentMeals.map((meal, index) => (
                <div
                  key={meal.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mr-3">
                      <FiBarChart2
                        className="text-orange-600 dark:text-orange-400"
                        size={16}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">
                        {meal.name || `${meal.calories} cal meal`}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(meal.timestamp)} •{" "}
                        {meal.meal_type || "Meal"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{meal.calories} cal</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {meal.portion_size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiBarChart2 className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="mb-2">No meals logged today</p>
              <button
                onClick={handleLogMeal}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                Log your first meal
              </button>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <Link
              to="/app/activity"
              className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
            >
              View all
            </Link>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
                      <FiActivity
                        className="text-green-600 dark:text-green-400"
                        size={16}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{activity.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(activity.timestamp)} •{" "}
                        {activity.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {activity.calories_burned} cal
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      burned
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiActivity className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p className="mb-2">No activities logged today</p>
              <button
                onClick={handleLogActivity}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                Log your first activity
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});

export default Dashboard;
