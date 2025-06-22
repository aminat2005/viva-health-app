/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiDroplet,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
  FiTarget,
  FiAward,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import * as userService from "../services/user";
import * as nutritionService from "../services/nutrition";
import * as activityService from "../services/activity";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ProgressPage = () => {
  const { user } = useContext(AuthContext);

  // Core state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("daily"); // daily, weekly, monthly
  const [refreshing, setRefreshing] = useState(false);

  // User goals and metrics (from user context - same pattern as Nutrition/Activity pages)
  const [userMetrics, setUserMetrics] = useState({
    daily_calories_target: user?.target_daily_calories || 2000,
    water_target: user?.daily_water_goal || 2.5,
    daily_steps_goal: user?.daily_steps_goal || 10000,
    weekly_activity_goal: user?.weekly_activity_goal || 5,
    activity_calories_target: 500, // Not in user object, use default
  });

  // Progress data
  const [progressData, setProgressData] = useState({
    // Daily data
    daily: {
      date: new Date().toISOString().split("T")[0],
      calories: { consumed: 0, burned: 0, target: 2000 },
      water: { consumed: 0, target: 2.5 },
      steps: { count: 0, target: 10000 },
      workouts: { completed: 0, target: 1 },
      meals: [],
      activities: [],
    },
    // Weekly data (7 days)
    weekly: {
      period: "week",
      startDate: null,
      endDate: null,
      calories: { consumed: 0, burned: 0, target: 0 },
      water: { consumed: 0, target: 0 },
      steps: { count: 0, target: 0 },
      workouts: { completed: 0, target: 5 },
      dailyBreakdown: [],
    },
    // Monthly data (30 days)
    monthly: {
      period: "month",
      startDate: null,
      endDate: null,
      calories: { consumed: 0, burned: 0, target: 0 },
      water: { consumed: 0, target: 0 },
      steps: { count: 0, target: 0 },
      workouts: { completed: 0, target: 20 },
      weeklyBreakdown: [],
    },
  });

  // Chart data
  const [chartData, setChartData] = useState({
    caloriesTrend: [],
    waterTrend: [],
    stepsTrend: [],
    workoutsTrend: [],
    nutritionBreakdown: [],
  });

  // Achievements and insights
  const [achievements, setAchievements] = useState([]);
  const [insights, setInsights] = useState([]);

  // Update userMetrics when user context changes
  useEffect(() => {
    if (user) {
      setUserMetrics({
        daily_calories_target: user.target_daily_calories || 2000,
        water_target: user.daily_water_goal || 2.5,
        daily_steps_goal: user.daily_steps_goal || 10000,
        weekly_activity_goal: user.weekly_activity_goal || 5,
        activity_calories_target: 500, // Default since not in user object
      });
    }
  }, [user]);

  /**
   * Fetch nutrition data for a date range
   */
  const fetchNutritionData = useCallback(async (startDate, endDate) => {
    try {
      const promises = [];
      const dates = [];

      // Generate date range
      const current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      // Fetch meals and water for each date
      for (const date of dates) {
        promises.push(
          Promise.allSettled([
            nutritionService.getMealHistory({ date }),
            nutritionService.getWaterIntakeHistory({ date }),
            nutritionService.getNutritionSummary({ date }),
          ]).then(([mealsResult, waterResult, summaryResult]) => {
            let meals = [];
            let water = 0;
            let summary = null;

            // Handle meals
            if (mealsResult.status === "fulfilled") {
              const mealsData =
                mealsResult.value?.results || mealsResult.value || [];
              meals = Array.isArray(mealsData) ? mealsData : [];

              // Filter meals to ensure they're actually for this date
              meals = meals.filter((meal) => {
                if (meal.date_logged === date) return true;
                if (meal.timestamp) {
                  const mealDate = meal.timestamp.split("T")[0];
                  return mealDate === date;
                }
                if (meal.created_at) {
                  const mealDate = meal.created_at.split("T")[0];
                  return mealDate === date;
                }
                return false;
              });
            }

            // Handle water
            if (waterResult.status === "fulfilled") {
              water = waterResult.value?.total_water || 0;
            }

            // Handle summary
            if (summaryResult.status === "fulfilled") {
              summary = summaryResult.value;
            }

            return {
              date,
              meals,
              water,
              summary,
            };
          })
        );
      }

      const results = await Promise.all(promises);

      return results;
    } catch (err) {
      console.error("Error fetching nutrition data:", err);
      return [];
    }
  }, []);

  /**
   * Fetch activity data for a date range
   */
  const fetchActivityData = useCallback(async (startDate, endDate) => {
    try {
      const promises = [];
      const dates = [];

      // Generate date range
      const current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      // Fetch activities and steps for each date
      for (const date of dates) {
        promises.push(
          Promise.allSettled([
            activityService.getActivityHistory({ date }),
            activityService.getStepsHistory({ date }),
          ]).then(([activitiesResult, stepsResult]) => {
            let steps = 0;
            let activities = [];

            // Handle activities
            if (activitiesResult.status === "fulfilled") {
              const activityData =
                activitiesResult.value?.results || activitiesResult.value || [];
              activities = Array.isArray(activityData) ? activityData : [];

              // Filter activities to ensure they're actually for this date
              activities = activities.filter((activity) => {
                if (activity.date === date) return true;
                if (activity.date_logged === date) return true;
                if (activity.timestamp) {
                  const activityDate = activity.timestamp.split("T")[0];
                  return activityDate === date;
                }
                if (activity.created_at) {
                  const activityDate = activity.created_at.split("T")[0];
                  return activityDate === date;
                }
                return false;
              });
            }

            // Handle steps - check different response formats
            if (stepsResult.status === "fulfilled") {
              const stepsData = stepsResult.value;
              if (stepsData?.results?.length > 0) {
                // Find entry for this specific date
                const dayEntry = stepsData.results.find(
                  (entry) => entry.date === date
                );
                steps = dayEntry?.steps || 0;
              } else if (stepsData?.steps) {
                steps = stepsData.steps;
              } else if (typeof stepsData === "number") {
                steps = stepsData;
              }
            }

            return {
              date,
              activities,
              steps,
            };
          })
        );
      }

      const results = await Promise.all(promises);

      return results;
    } catch (err) {
      console.error("Error fetching activity data:", err);
      return [];
    }
  }, []);

  /**
   * Calculate daily progress metrics
   */
  const calculateDailyProgress = useCallback(
    (nutritionData, activityData, date, metrics) => {
      const nutrition = nutritionData.find((n) => n.date === date) || {
        meals: [],
        water: 0,
        summary: null,
      };
      const activity = activityData.find((a) => a.date === date) || {
        activities: [],
        steps: 0,
      };

      // Calculate calories consumed
      let caloriesConsumed = 0;
      if (nutrition.summary?.total_calories) {
        caloriesConsumed = nutrition.summary.total_calories;
      } else {
        // Fallback: calculate from meals
        caloriesConsumed = nutrition.meals.reduce((sum, meal) => {
          const mealCalories = meal.energy_kcal || meal.calories || 0;

          return sum + mealCalories;
        }, 0);
      }

      // Calculate calories burned
      const caloriesBurned = activity.activities.reduce((sum, act) => {
        return sum + (act.calories_burned || 0);
      }, 0);

      // Count workouts
      const workoutsCompleted = activity.activities.length;

      return {
        date,
        calories: {
          consumed: Math.round(caloriesConsumed),
          burned: Math.round(caloriesBurned),
          target: metrics.daily_calories_target,
          progress: Math.round(
            (caloriesConsumed / metrics.daily_calories_target) * 100
          ),
        },
        water: {
          consumed: Math.round(nutrition.water * 10) / 10,
          target: metrics.water_target,
          progress: Math.round((nutrition.water / metrics.water_target) * 100),
        },
        steps: {
          count: activity.steps,
          target: metrics.daily_steps_goal,
          progress: Math.round(
            (activity.steps / metrics.daily_steps_goal) * 100
          ),
        },
        workouts: {
          completed: workoutsCompleted,
          target: metrics.weekly_activity_goal, // Show weekly target even on daily view
          progress: Math.round(
            (workoutsCompleted / metrics.weekly_activity_goal) * 100
          ),
        },
        meals: nutrition.meals,
        activities: activity.activities,
      };
    },
    []
  );

  /**
   * Calculate weekly progress metrics
   */
  const calculateWeeklyProgress = useCallback((dailyData, metrics) => {
    const weekData = dailyData.slice(0, 7); // Last 7 days
    const startDate = new Date(
      weekData[weekData.length - 1]?.date || new Date()
    );
    const endDate = new Date(weekData[0]?.date || new Date());

    const totals = weekData.reduce(
      (acc, day) => ({
        caloriesConsumed: acc.caloriesConsumed + day.calories.consumed,
        caloriesBurned: acc.caloriesBurned + day.calories.burned,
        waterConsumed: acc.waterConsumed + day.water.consumed,
        steps: acc.steps + day.steps.count,
        workouts: acc.workouts + day.workouts.completed, // Sum workouts for the week
      }),
      {
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterConsumed: 0,
        steps: 0,
        workouts: 0,
      }
    );

    const targets = {
      calories: metrics.daily_calories_target * 7,
      water: metrics.water_target * 7,
      steps: metrics.daily_steps_goal * 7,
      workouts: metrics.weekly_activity_goal,
    };

    return {
      period: "week",
      startDate,
      endDate,
      calories: {
        consumed: Math.round(totals.caloriesConsumed),
        burned: Math.round(totals.caloriesBurned),
        target: targets.calories,
        progress: Math.round(
          (totals.caloriesConsumed / targets.calories) * 100
        ),
      },
      water: {
        consumed: Math.round(totals.waterConsumed * 10) / 10,
        target: Math.round(targets.water * 10) / 10,
        progress: Math.round((totals.waterConsumed / targets.water) * 100),
      },
      steps: {
        count: totals.steps,
        target: targets.steps,
        progress: Math.round((totals.steps / targets.steps) * 100),
      },
      workouts: {
        completed: totals.workouts,
        target: targets.workouts,
        progress: Math.round((totals.workouts / targets.workouts) * 100),
      },
      dailyBreakdown: weekData.reverse(), // Oldest to newest
    };
  }, []);

  /**
   * Calculate monthly progress metrics
   */
  const calculateMonthlyProgress = useCallback((dailyData, metrics) => {
    const monthData = dailyData.slice(0, 30); // Last 30 days
    const startDate = new Date(
      monthData[monthData.length - 1]?.date || new Date()
    );
    const endDate = new Date(monthData[0]?.date || new Date());

    const totals = monthData.reduce(
      (acc, day) => ({
        caloriesConsumed: acc.caloriesConsumed + day.calories.consumed,
        caloriesBurned: acc.caloriesBurned + day.calories.burned,
        waterConsumed: acc.waterConsumed + day.water.consumed,
        steps: acc.steps + day.steps.count,
        workouts: acc.workouts + day.workouts.completed,
      }),
      {
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterConsumed: 0,
        steps: 0,
        workouts: 0,
      }
    );

    const targets = {
      calories: metrics.daily_calories_target * 30,
      water: metrics.water_target * 30,
      steps: metrics.daily_steps_goal * 30,
      workouts: metrics.weekly_activity_goal * 4, // 4 weeks in a month
    };

    // Group into weekly breakdown
    const weeklyBreakdown = [];
    for (let i = 0; i < monthData.length; i += 7) {
      const weekData = monthData.slice(i, i + 7);
      const weekTotals = weekData.reduce(
        (acc, day) => ({
          caloriesConsumed: acc.caloriesConsumed + day.calories.consumed,
          caloriesBurned: acc.caloriesBurned + day.calories.burned,
          waterConsumed: acc.waterConsumed + day.water.consumed,
          steps: acc.steps + day.steps.count,
          workouts: acc.workouts + day.workouts.completed,
        }),
        {
          caloriesConsumed: 0,
          caloriesBurned: 0,
          waterConsumed: 0,
          steps: 0,
          workouts: 0,
        }
      );

      weeklyBreakdown.push({
        week: Math.floor(i / 7) + 1,
        startDate: weekData[weekData.length - 1]?.date,
        endDate: weekData[0]?.date,
        ...weekTotals,
      });
    }

    return {
      period: "month",
      startDate,
      endDate,
      calories: {
        consumed: Math.round(totals.caloriesConsumed),
        burned: Math.round(totals.caloriesBurned),
        target: targets.calories,
        progress: Math.round(
          (totals.caloriesConsumed / targets.calories) * 100
        ),
      },
      water: {
        consumed: Math.round(totals.waterConsumed * 10) / 10,
        target: Math.round(targets.water * 10) / 10,
        progress: Math.round((totals.waterConsumed / targets.water) * 100),
      },
      steps: {
        count: totals.steps,
        target: targets.steps,
        progress: Math.round((totals.steps / targets.steps) * 100),
      },
      workouts: {
        completed: totals.workouts,
        target: targets.workouts,
        progress: Math.round((totals.workouts / targets.workouts) * 100),
      },
      weeklyBreakdown: weeklyBreakdown.reverse(), // Oldest to newest
    };
  }, []);

  /**
   * Generate chart data for visualization
   */
  const generateChartData = useCallback((dailyData, currentTimeframe) => {
    const last7Days = dailyData.slice(0, 7).reverse(); // Oldest to newest
    const last14Days = dailyData.slice(0, 14).reverse();

    // Calories trend (daily)
    const caloriesTrend = last7Days.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      consumed: day.calories.consumed,
      burned: day.calories.burned,
      target: day.calories.target,
      net: day.calories.consumed - day.calories.burned,
    }));

    // Water trend (daily)
    const waterTrend = last7Days.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      consumed: day.water.consumed,
      target: day.water.target,
      progress: day.water.progress,
    }));

    // Steps trend (daily)
    const stepsTrend = last7Days.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      steps: day.steps.count,
      target: day.steps.target,
      progress: day.steps.progress,
    }));

    // Workouts trend (daily)
    const workoutsTrend = last7Days.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      workouts: day.workouts.completed,
      calories: day.calories.burned,
    }));

    // Nutrition breakdown (pie chart) - based on current timeframe
    let mealsToAnalyze = [];
    if (currentTimeframe === "daily") {
      mealsToAnalyze = dailyData[0]?.meals || [];
    } else if (currentTimeframe === "weekly") {
      // Collect all meals from the past 7 days
      mealsToAnalyze = last7Days.reduce((allMeals, day) => {
        return allMeals.concat(day.meals || []);
      }, []);
    } else {
      // Monthly - collect all meals from the past 14 days for analysis
      mealsToAnalyze = last14Days.reduce((allMeals, day) => {
        return allMeals.concat(day.meals || []);
      }, []);
    }

    const nutritionBreakdown = mealsToAnalyze.reduce((acc, meal) => {
      // Try to get meal type from different possible fields
      let mealType = "snack";

      // Check various possible field names from your backend
      if (meal.meal_type) {
        mealType = meal.meal_type.toLowerCase();
      } else if (meal.type) {
        mealType = meal.type.toLowerCase();
      } else if (meal.category) {
        mealType = meal.category.toLowerCase();
      } else if (meal.meal_category) {
        mealType = meal.meal_category.toLowerCase();
      } else {
        // If no meal type found, try to determine from timestamp
        if (meal.timestamp) {
          const hour = new Date(meal.timestamp).getHours();
          if (hour >= 5 && hour < 11) {
            mealType = "breakfast";
          } else if (hour >= 11 && hour < 17) {
            mealType = "lunch";
          } else if (hour >= 17 && hour < 23) {
            mealType = "dinner";
          } else {
            mealType = "snack";
          }
        }
      }

      // Ensure we have proper meal types
      const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
      if (!validMealTypes.includes(mealType)) {
        mealType = "snack";
      }

      // Capitalize for display
      const displayName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

      const calories = meal.energy_kcal || meal.calories || 0;

      const existing = acc.find((item) => item.name === displayName);
      if (existing) {
        existing.value += calories;
      } else {
        acc.push({
          name: displayName,
          value: Math.round(calories),
        });
      }
      return acc;
    }, []);

    return {
      caloriesTrend,
      waterTrend,
      stepsTrend,
      workoutsTrend,
      nutritionBreakdown,
    };
  }, []);

  /**
   * Generate achievements based on progress data
   */
  const generateAchievements = useCallback((dailyData) => {
    const achievements = [];
    const today = dailyData[0];
    const yesterday = dailyData[1];
    const last7Days = dailyData.slice(0, 7);

    // Today's achievements
    if (today?.water.progress >= 100) {
      achievements.push({
        id: "water_goal",
        icon: FiDroplet,
        title: "Hydration Hero",
        description: "Reached daily water goal",
        color: "blue",
        earned: today.date,
      });
    }

    if (today?.steps.progress >= 100) {
      achievements.push({
        id: "steps_goal",
        icon: FiActivity,
        title: "Step Master",
        description: "Completed daily step goal",
        color: "green",
        earned: today.date,
      });
    }

    if (today?.workouts.completed >= 1) {
      achievements.push({
        id: "workout_complete",
        icon: FiTarget,
        title: "Workout Warrior",
        description: "Completed a workout today",
        color: "orange",
        earned: today.date,
      });
    }

    // Weekly achievements
    const weeklyWaterGoals = last7Days.filter(
      (day) => day.water.progress >= 100
    ).length;
    if (weeklyWaterGoals >= 5) {
      achievements.push({
        id: "weekly_water",
        icon: FiAward,
        title: "Hydration Streak",
        description: `Hit water goal ${weeklyWaterGoals} days this week`,
        color: "blue",
        earned: today.date,
      });
    }

    const weeklyStepsGoals = last7Days.filter(
      (day) => day.steps.progress >= 100
    ).length;
    if (weeklyStepsGoals >= 5) {
      achievements.push({
        id: "weekly_steps",
        icon: FiTrendingUp,
        title: "Consistent Walker",
        description: `Hit step goal ${weeklyStepsGoals} days this week`,
        color: "green",
        earned: today.date,
      });
    }

    return achievements.slice(0, 4); // Limit to 4 achievements
  }, []);

  /**
   * Generate insights based on progress data
   */
  const generateInsights = useCallback((dailyData) => {
    const insights = [];
    const today = dailyData[0];
    const yesterday = dailyData[1];
    const last7Days = dailyData.slice(0, 7);
    const prev7Days = dailyData.slice(7, 14);

    if (!today || !yesterday) return insights;

    // Calorie insights
    const calorieDiff = today.calories.consumed - yesterday.calories.consumed;
    const caloriePercentChange =
      yesterday.calories.consumed > 0
        ? Math.round((calorieDiff / yesterday.calories.consumed) * 100)
        : 0;

    if (Math.abs(caloriePercentChange) >= 10) {
      insights.push({
        type: caloriePercentChange > 0 ? "increase" : "decrease",
        metric: "Calories",
        change: `${Math.abs(caloriePercentChange)}%`,
        description: `Your calorie intake ${
          caloriePercentChange > 0 ? "increased" : "decreased"
        } compared to yesterday`,
        icon: FiBarChart2,
        color: caloriePercentChange > 0 ? "orange" : "green",
      });
    }

    // Weekly comparison
    const thisWeekAvg = {
      calories: Math.round(
        last7Days.reduce((sum, day) => sum + day.calories.consumed, 0) /
          last7Days.length
      ),
      water:
        Math.round(
          (last7Days.reduce((sum, day) => sum + day.water.consumed, 0) /
            last7Days.length) *
            10
        ) / 10,
      steps: Math.round(
        last7Days.reduce((sum, day) => sum + day.steps.count, 0) /
          last7Days.length
      ),
    };

    const prevWeekAvg = {
      calories: Math.round(
        prev7Days.reduce((sum, day) => sum + day.calories.consumed, 0) /
          prev7Days.length
      ),
      water:
        Math.round(
          (prev7Days.reduce((sum, day) => sum + day.water.consumed, 0) /
            prev7Days.length) *
            10
        ) / 10,
      steps: Math.round(
        prev7Days.reduce((sum, day) => sum + day.steps.count, 0) /
          prev7Days.length
      ),
    };

    // Steps comparison
    if (prevWeekAvg.steps > 0) {
      const stepsChange = Math.round(
        ((thisWeekAvg.steps - prevWeekAvg.steps) / prevWeekAvg.steps) * 100
      );
      if (Math.abs(stepsChange) >= 5) {
        insights.push({
          type: stepsChange > 0 ? "increase" : "decrease",
          metric: "Steps",
          change: `${Math.abs(stepsChange)}%`,
          description: `Your daily steps ${
            stepsChange > 0 ? "increased" : "decreased"
          } this week vs last week`,
          icon: FiActivity,
          color: stepsChange > 0 ? "green" : "red",
        });
      }
    }

    // Water comparison
    if (prevWeekAvg.water > 0) {
      const waterChange = Math.round(
        ((thisWeekAvg.water - prevWeekAvg.water) / prevWeekAvg.water) * 100
      );
      if (Math.abs(waterChange) >= 5) {
        insights.push({
          type: waterChange > 0 ? "increase" : "decrease",
          metric: "Water",
          change: `${Math.abs(waterChange)}%`,
          description: `Your water intake ${
            waterChange > 0 ? "improved" : "decreased"
          } this week`,
          icon: FiDroplet,
          color: waterChange > 0 ? "blue" : "orange",
        });
      }
    }

    return insights.slice(0, 3); // Limit to 3 insights
  }, []);

  /**
   * Main data fetching and processing function
   */
  const fetchAndProcessData = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        setError(null);

        // No need to fetch metrics - we get them from user context
        if (!userMetrics || !user) {
          return;
        }

        // Calculate date ranges
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Fetch data in parallel
        const [nutritionData, activityData] = await Promise.all([
          fetchNutritionData(
            thirtyDaysAgo.toISOString().split("T")[0],
            today.toISOString().split("T")[0]
          ),
          fetchActivityData(
            thirtyDaysAgo.toISOString().split("T")[0],
            today.toISOString().split("T")[0]
          ),
        ]);

        // Generate date array (30 days)
        const dates = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split("T")[0]);
        }

        // Calculate daily progress for all dates using userMetrics from context
        const dailyProgressArray = dates.map((date) =>
          calculateDailyProgress(nutritionData, activityData, date, userMetrics)
        );

        // Calculate aggregated data using userMetrics from context
        const weeklyProgress = calculateWeeklyProgress(
          dailyProgressArray,
          userMetrics
        );
        const monthlyProgress = calculateMonthlyProgress(
          dailyProgressArray,
          userMetrics
        );

        // Update progress data
        setProgressData({
          daily: dailyProgressArray[0], // Today's data
          weekly: weeklyProgress,
          monthly: monthlyProgress,
        });

        // Generate chart data with current timeframe
        const charts = generateChartData(dailyProgressArray, timeframe);
        setChartData(charts);

        // Generate achievements and insights
        const newAchievements = generateAchievements(dailyProgressArray);
        const newInsights = generateInsights(dailyProgressArray);

        setAchievements(newAchievements);
        setInsights(newInsights);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError("Failed to load progress data. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userMetrics, user]
  ); // Removed all function dependencies to prevent infinite loops

  // Initial data load
  useEffect(() => {
    fetchAndProcessData(true);
  }, [fetchAndProcessData]);

  // Refresh data when timeframe changes
  useEffect(() => {
    if (progressData.daily) {
      // Data is already loaded, just update display
      return;
    }
  }, [timeframe, progressData.daily]);

  /**
   * Handle manual refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await fetchAndProcessData(false);
  }, [fetchAndProcessData]);

  /**
   * Get current data based on timeframe
   */
  const getCurrentData = () => {
    switch (timeframe) {
      case "weekly":
        return progressData.weekly;
      case "monthly":
        return progressData.monthly;
      default:
        return progressData.daily;
    }
  };

  const currentData = getCurrentData();

  // Loading state
  if (loading || !userMetrics || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
            <FiBarChart2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
              Unable to Load Progress
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchAndProcessData(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-6 pb-8">
      {/* Header with timeframe selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Progress</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {timeframe === "daily"
                ? new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : timeframe === "weekly"
                ? `This Week ${
                    currentData.startDate && currentData.endDate
                      ? `(${new Date(currentData.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )} - ${new Date(currentData.endDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )})`
                      : ""
                  }`
                : `This Month ${
                    currentData.startDate && currentData.endDate
                      ? `(${new Date(currentData.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )} - ${new Date(currentData.endDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )})`
                      : ""
                  }`}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <FiTrendingUp
                className={`${refreshing ? "animate-spin" : ""}`}
                size={18}
              />
              <span className="text-sm">Refresh</span>
            </button>

            {/* Timeframe Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {["daily", "weekly", "monthly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeframe === period
                      ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Progress Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Calories Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiBarChart2
                className="text-orange-600 dark:text-orange-400"
                size={20}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round(currentData.calories?.progress || 0)}%
            </span>
          </div>
          <h3 className="font-semibold mb-2">Calories</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Consumed</span>
              <span className="font-medium">
                {currentData.calories?.consumed || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Burned</span>
              <span className="font-medium">
                {currentData.calories?.burned || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">
                {currentData.calories?.target || 0}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    currentData.calories?.progress || 0,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiDroplet
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round(currentData.water?.progress || 0)}%
            </span>
          </div>
          <h3 className="font-semibold mb-2">Water Intake</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Consumed</span>
              <span className="font-medium">
                {currentData.water?.consumed || 0}L
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">
                {currentData.water?.target || 0}L
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(currentData.water?.progress || 0, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiActivity
                className="text-green-600 dark:text-green-400"
                size={20}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round(currentData.steps?.progress || 0)}%
            </span>
          </div>
          <h3 className="font-semibold mb-2">Steps</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Count</span>
              <span className="font-medium">
                {(currentData.steps?.count || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">
                {(currentData.steps?.target || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(currentData.steps?.progress || 0, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Workouts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiTarget
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>
            <span className="text-2xl font-bold">
              {Math.round(currentData.workouts?.progress || 0)}%
            </span>
          </div>
          <h3 className="font-semibold mb-2">Workouts</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Completed
              </span>
              <span className="font-medium">
                {currentData.workouts?.completed || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium">
                {currentData.workouts?.target || 0}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    currentData.workouts?.progress || 0,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Calories Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-orange-600" />
            Calories Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.caloriesTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Line
                type="monotone"
                dataKey="consumed"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Consumed"
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="burned"
                stroke="#EF4444"
                strokeWidth={2}
                name="Burned"
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#6B7280"
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Target"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiDroplet className="mr-2 text-blue-600" />
            Water Intake (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.waterTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value, name) => [
                  name === "consumed" ? `${value}L` : `${value}%`,
                  name === "consumed" ? "Consumed" : "Progress",
                ]}
              />
              <Bar
                dataKey="consumed"
                fill="#3B82F6"
                name="consumed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Steps Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiActivity className="mr-2 text-green-600" />
            Daily Steps (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.stepsTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value, name) => [
                  name === "steps" ? value.toLocaleString() : `${value}%`,
                  name === "steps" ? "Steps" : "Progress",
                ]}
              />
              <Bar
                dataKey="steps"
                fill="#10B981"
                name="steps"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nutrition Breakdown Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiTarget className="mr-2 text-purple-600" />
            {timeframe === "daily"
              ? "Today's"
              : timeframe === "weekly"
              ? "This Week's"
              : "This Month's"}{" "}
            Meal Breakdown
          </h3>
          {chartData.nutritionBreakdown &&
          chartData.nutritionBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.nutritionBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.nutritionBreakdown.map((entry, index) => {
                    const colors = [
                      "#F59E0B",
                      "#3B82F6",
                      "#10B981",
                      "#8B5CF6",
                      "#EF4444",
                    ];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                  formatter={(value) => [`${value} cal`, "Calories"]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FiCalendar className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>
                  No meals logged{" "}
                  {timeframe === "daily"
                    ? "today"
                    : `this ${timeframe.slice(0, -2)}`}
                </p>
                <p className="text-sm">Start tracking to see breakdown</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FiAward className="mr-2 text-primary-600" />
            Recent Achievements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const colorClasses = {
                blue: "from-blue-400 to-blue-600 text-blue-600",
                green: "from-green-400 to-green-600 text-green-600",
                orange: "from-orange-400 to-orange-600 text-orange-600",
                purple: "from-purple-400 to-purple-600 text-purple-600",
              };

              return (
                <div
                  key={achievement.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${
                        colorClasses[achievement.color]
                      } rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                        {achievement.description}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        {new Date(achievement.earned).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-primary-600" />
            Progress Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                green:
                  "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                orange:
                  "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
                red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
              };

              const TrendIcon =
                insight.type === "increase" ? FiChevronUp : FiChevronDown;
              const trendColorClass =
                insight.type === "increase" ? "text-green-600" : "text-red-600";

              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`p-3 ${
                      colorClasses[insight.color]
                    } rounded-full mr-4`}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <TrendIcon
                        className={`${trendColorClass} mr-1`}
                        size={16}
                      />
                      <span className={`text-2xl font-bold ${trendColorClass}`}>
                        {insight.change}
                      </span>
                      <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">
                        {insight.metric}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressPage;
