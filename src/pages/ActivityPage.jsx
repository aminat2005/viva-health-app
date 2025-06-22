/* eslint-disable no-unused-vars */
// src/pages/ActivityPage.jsx

import React, { useState, useEffect, useContext, memo } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiPlus,
  FiBarChart2,
  FiClock,
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiX,
  FiPlay,
  FiCheck,
  FiYoutube,
  FiAlertCircle,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import * as activityService from "../services/activity";

// Simplified exercise data
const exerciseOptions = [
  {
    id: 1,
    name: "Running",
    category: "Cardio",
    caloriesPerMinute: 12,
    description: "Running at moderate pace outdoors or on treadmill",
    videoUrl: "https://youtu.be/_kGESn8ArrU?si=qffiSl-AhHTm3t9h",
  },
  {
    id: 2,
    name: "Cycling",
    category: "Cardio",
    caloriesPerMinute: 10,
    description: "Cycling on stationary bike or outdoors",
    videoUrl: "https://youtu.be/t5IHTuW_NBU?si=u_T5_d0zvH9yPsBv",
  },
  {
    id: 3,
    name: "Swimming",
    category: "Cardio",
    caloriesPerMinute: 11,
    description: "Swimming laps in pool",
    videoUrl: "https://youtu.be/Rr_CnIfr5u8?si=hHsql-sur9PzCCTm",
  },
  {
    id: 4,
    name: "Weightlifting",
    category: "Strength",
    caloriesPerMinute: 8,
    description: "Resistance training with weights",
    videoUrl: "https://youtu.be/WIHy-ZnSndA?si=z0WWHjhtoM1h2-ku",
  },
  {
    id: 5,
    name: "Yoga",
    category: "Flexibility",
    caloriesPerMinute: 5,
    description:
      "Mind-body practice focusing on strength, flexibility and breathing",
    videoUrl: "https://youtu.be/v7AYKMP6rOE?si=zOSqRjJNd2S6nNjS",
  },
];

// Utility function to calculate calories burned
const calculateCaloriesBurned = (
  exerciseName,
  duration,
  intensity = "moderate",
  bodyWeight = 70
) => {
  const exercise = exerciseOptions.find((ex) => ex.name === exerciseName);
  if (!exercise) return 0;

  let intensityMultiplier = 1;
  if (intensity === "light") intensityMultiplier = 0.8;
  if (intensity === "vigorous") intensityMultiplier = 1.3;

  return Math.floor(
    exercise.caloriesPerMinute * duration * intensityMultiplier
  );
};

const ActivityPage = memo(() => {
  const { user } = useContext(AuthContext);

  // State variables for UI controls
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [showLogSteps, setShowLogSteps] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);
  const [activityForm, setActivityForm] = useState({
    exercise: "",
    duration: 30,
    intensity: "moderate",
    date: new Date().toISOString().split("T")[0],
    time: `${new Date().getHours()}:${
      new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes()
    }`,
  });
  const [stepsForm, setStepsForm] = useState({
    count: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Stats
  const [todayStats, setTodayStats] = useState({
    steps: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
    workoutsCompleted: 0,
  });

  // Goals
  // Goals (synced from user signup data)
  const [goals, setGoals] = useState({
    dailySteps: user?.daily_steps_goal || 10000,
    weeklyWorkouts: user?.weekly_activity_goal || 5,
    activeMinutesPerDay: user?.daily_active_minutes_goal || 240,
  });

  // Loading and notification states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" or "error"
  });

  // Calculate calories burned based on current form values
  const estimatedCalories = activityForm.exercise
    ? calculateCaloriesBurned(
        activityForm.exercise,
        parseInt(activityForm.duration),
        activityForm.intensity
      )
    : 0;

  // Fetch activity data and user goals on mount

  // Sync goals from user data when user changes
  useEffect(() => {
    if (user) {
      setGoals({
        dailySteps: user.daily_steps_goal || 10000,
        weeklyWorkouts: user.weekly_activity_goal || 5,
        activeMinutesPerDay: user.daily_active_minutes_goal || 240,
      });
    }
  }, [user]);
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setIsLoading(true);

        // Get today's date
        const today = new Date().toISOString().split("T")[0];

        // Check for date change (daily reset like nutrition page)
        const lastActivityDate = localStorage.getItem("lastActivityDate");
        if (lastActivityDate !== today) {
          // New day - reset steps display
          setTodayStats((prev) => ({ ...prev, steps: 0 }));
          localStorage.setItem("lastActivityDate", today);
        }

        // Get steps data for today (FIXED)
        let todaySteps = 0;
        try {
          const stepsResponse = await activityService.getStepsHistory({
            date: today,
          });

          if (
            stepsResponse &&
            stepsResponse.results &&
            stepsResponse.results.length > 0
          ) {
            // Find the entry for today - use 'steps' field not 'count'
            const todayStepEntry = stepsResponse.results.find(
              (entry) => entry.date === today
            );
            todaySteps = todayStepEntry?.steps || 0; // FIXED: use .steps from your backend response
          }
        } catch (error) {
          console.error("Failed to fetch steps data:", error);
        }

        // Get activity history
        let activityData = [];
        let totalCalories = 0;
        let totalDuration = 0;
        let workoutsCount = 0;

        try {
          const activityResponse = await activityService.getActivityHistory();

          if (activityResponse && activityResponse.results) {
            activityData = activityResponse.results;

            // Calculate today's stats from activity history
            const todayActivities = activityData.filter((activity) => {
              const activityDate =
                activity.date ||
                (activity.timestamp ? activity.timestamp.split("T")[0] : "");
              return activityDate === today;
            });

            totalCalories = todayActivities.reduce(
              (sum, activity) => sum + (activity.calories_burned || 0),
              0
            );

            totalDuration = todayActivities.reduce(
              (sum, activity) =>
                sum + (activity.duration_minutes || activity.duration || 0),
              0
            );

            workoutsCount = todayActivities.length;
            setActivityHistory(activityData);
          }
        } catch (error) {
          console.error("Failed to fetch activity history:", error);
        }

        // Update today's stats with fetched data
        setTodayStats({
          steps: todaySteps, // Now shows persistent steps from backend
          caloriesBurned: totalCalories,
          activeMinutes: totalDuration,
          workoutsCompleted: workoutsCount,
        });
      } catch (error) {
        console.error("Error fetching activity data:", error);
        showNotification(
          "Failed to load activity data. Please try again later.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, []);
  // useEffect(() => {
  //   const fetchActivityData = async () => {
  //     try {
  //       setIsLoading(true);

  //       // Get today's date
  //       const today = new Date().toISOString().split("T")[0];

  //       // Get steps data for today
  //       let todaySteps = 0;
  //       try {
  //         const stepsResponse = await activityService.getStepsHistory({
  //           date: today,
  //         });

  //         if (
  //           stepsResponse &&
  //           stepsResponse.results &&
  //           stepsResponse.results.length > 0
  //         ) {
  //           // Find the entry for today
  //           const todayStepEntry =
  //             stepsResponse.results.find((entry) => entry.date === today) ||
  //             stepsResponse.results[0]; // Default to first entry if today not found

  //           todaySteps = todayStepEntry.count || 0;
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch steps data:", error);
  //         // Continue anyway to show activity data
  //       }

  //       // Get activity history
  //       let activityData = [];
  //       let totalCalories = 0;
  //       let totalDuration = 0;
  //       let workoutsCount = 0;

  //       try {
  //         const activityResponse = await activityService.getActivityHistory();

  //         if (activityResponse && activityResponse.results) {
  //           activityData = activityResponse.results;

  //           // Calculate today's stats from activity history
  //           const todayActivities = activityData.filter((activity) => {
  //             // Handle different date formats (backend might send date or timestamp)
  //             const activityDate =
  //               activity.date ||
  //               (activity.timestamp ? activity.timestamp.split("T")[0] : "");
  //             return activityDate === today;
  //           });

  //           // Calculate totals
  //           totalCalories = todayActivities.reduce(
  //             (sum, activity) => sum + (activity.calories_burned || 0),
  //             0
  //           );

  //           totalDuration = todayActivities.reduce(
  //             (sum, activity) => sum + (activity.duration || 0),
  //             0
  //           );

  //           workoutsCount = todayActivities.length;

  //           // Set activity history
  //           setActivityHistory(activityData);
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch activity history:", error);
  //         // Keep default empty array if API fails
  //       }

  //       // Update today's stats
  //       setTodayStats({
  //         steps: todaySteps,
  //         caloriesBurned: totalCalories,
  //         activeMinutes: totalDuration,
  //         workoutsCompleted: workoutsCount,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching activity data:", error);
  //       showNotification(
  //         "Failed to load activity data. Please try again later.",
  //         "error"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchActivityData();
  // }, []);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  // Handler for form changes
  const handleActivityFormChange = (e) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for steps form changes
  const handleStepsFormChange = (e) => {
    const { name, value } = e.target;
    setStepsForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for logging a new activity
  // Handler for logging a new activity
  const handleLogActivity = async () => {
    if (!activityForm.exercise || !activityForm.duration) {
      showNotification("Please select an exercise and enter duration", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the activity data object matching the backend model field names
      const activityData = {
        activity_type: activityForm.exercise,
        duration_minutes: parseInt(activityForm.duration),
        calories_burned: estimatedCalories,
      };

      // Send to API
      const response = await activityService.logActivity(activityData);

      if (response) {
        // Format the activity for the activity history display
        const newActivity = {
          id: response.id,
          activity_type: response.activity_type,
          duration_minutes: response.duration_minutes,
          calories_burned: response.calories_burned,
          date: response.date,
          time: response.time,
        };

        // Add to local state
        setActivityHistory((prev) => [newActivity, ...prev]);

        // Update today's stats
        setTodayStats((prev) => ({
          ...prev,
          caloriesBurned: prev.caloriesBurned + newActivity.calories_burned,
          activeMinutes: prev.activeMinutes + newActivity.duration_minutes,
          workoutsCompleted: prev.workoutsCompleted + 1,
        }));

        // Reset form
        setActivityForm({
          exercise: "",
          duration: 30,
          intensity: "moderate",
          date: new Date().toISOString().split("T")[0],
          time: `${new Date().getHours()}:${
            new Date().getMinutes() < 10
              ? "0" + new Date().getMinutes()
              : new Date().getMinutes()
          }`,
        });

        // Close modal
        setShowLogActivity(false);

        // Show success notification
        showNotification("Activity logged successfully!");
      }
    } catch (error) {
      console.error("Error logging activity:", error);
      showNotification("Failed to log activity. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for logging steps
  const handleLogSteps = async () => {
    if (!stepsForm.count) {
      showNotification("Please enter the number of steps", "error");
      return;
    }

    const newStepsToAdd = parseInt(stepsForm.count);
    if (newStepsToAdd <= 0) {
      showNotification("Please enter a valid number of steps", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // STEP 1: Get current steps for today
      const today = new Date().toISOString().split("T")[0];
      let currentSteps = 0;

      try {
        const currentStepsData = await activityService.getStepsHistory({
          date: today,
        });

        if (currentStepsData?.results?.length > 0) {
          const todayEntry = currentStepsData.results.find(
            (entry) => entry.date === today
          );
          currentSteps = todayEntry?.steps || 0;
        }
      } catch (err) {
        currentSteps = 0;
      }

      // STEP 2: Calculate new total (CUMULATIVE)
      const newTotal = currentSteps + newStepsToAdd;

      // STEP 3: Send total steps to backend
      const response = await activityService.logSteps({
        count: newTotal, // Send the total cumulative steps
      });

      if (response) {
        // STEP 4: Update UI with new total
        setTodayStats((prev) => ({
          ...prev,
          steps: newTotal, // Show the cumulative total
        }));

        // Reset form and show success
        setStepsForm({
          count: "",
          date: new Date().toISOString().split("T")[0],
        });
        setShowLogSteps(false);

        // Show success with details
        showNotification(
          `Added ${newStepsToAdd} steps! Total: ${newTotal}/${goals.dailySteps}`,
          "success"
        );
      }
    } catch (err) {
      console.error("Error logging steps:", err);
      showNotification("Failed to log steps. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open YouTube video in new tab
  const openWorkoutVideo = (url) => {
    window.open(url, "_blank");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if date is today or yesterday
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Group activity history by date

  const groupedActivities = activityHistory.reduce((groups, activity) => {
    // Handle different date formats (backend might send date or timestamp)
    const dateStr =
      activity.date ||
      (activity.timestamp ? activity.timestamp.split("T")[0] : "");

    if (!dateStr) return groups;

    if (!groups[dateStr]) {
      groups[dateStr] = {
        date: dateStr,
        formattedDate: formatDate(dateStr),
        activities: [],
        totalCalories: 0,
        totalDuration: 0,
      };
    }

    groups[dateStr].activities.push(activity);

    // Handle different field names for calories and duration
    const calories = activity.calories_burned || 0;
    const duration = activity.duration_minutes || activity.duration || 0;

    groups[dateStr].totalCalories += calories;
    groups[dateStr].totalDuration += duration;

    return groups;
  }, {});

  // Convert grouped activities to array and sort by date
  const activityByDate = Object.values(groupedActivities).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          } flex items-center`}
        >
          {notification.type === "error" && <FiAlertCircle className="mr-2" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Activity Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowLogSteps(true)}
              className="btn flex items-center justify-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <FiTrendingUp className="mr-2" />
              Log Steps
            </button>
            <button
              onClick={() => setShowLogActivity(true)}
              className="btn flex items-center justify-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
            >
              <FiPlus className="mr-2" />
              Log Activity
            </button>
          </div>
        </div>
      </motion.div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Steps Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Steps
              </span>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">
                  {todayStats.steps.toLocaleString()}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                  / {goals.dailySteps.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiActivity
                className="text-green-600 dark:text-green-400"
                size={20}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (todayStats.steps / goals.dailySteps) * 100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.max(
                0,
                goals.dailySteps - todayStats.steps
              ).toLocaleString()}{" "}
              steps left to goal
            </p>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Calories Burned
              </span>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">
                  {todayStats.caloriesBurned}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                  kcal
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FiBarChart2
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Daily Activity</span>
              <span>{todayStats.activeMinutes} min</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {Math.max(
                0,
                goals.activeMinutesPerDay - todayStats.activeMinutes
              )}{" "}
              minutes of activity left today
            </div>
          </div>
        </div>

        {/* Weekly Workouts Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Weekly Workouts
              </span>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">
                  {todayStats.workoutsCompleted}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                  / {goals.weeklyWorkouts}
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiCalendar
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex space-x-1">
              {[...Array(goals.weeklyWorkouts)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < todayStats.workoutsCompleted
                      ? "bg-purple-600 dark:bg-purple-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.max(0, goals.weeklyWorkouts - todayStats.workoutsCompleted)}{" "}
              more workouts this week
            </p>
          </div>
        </div>
      </motion.div>

      {/* Activity Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <FiTarget className="mr-2 text-primary-600" />
          Activity Goals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <FiActivity
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>
              <div>
                <h3 className="font-medium">Daily Steps</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Target: {goals.dailySteps.toLocaleString()} steps
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (todayStats.steps / goals.dailySteps) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((todayStats.steps / goals.dailySteps) * 100)}%
                completed
              </p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                <FiCalendar
                  className="text-purple-600 dark:text-purple-400"
                  size={20}
                />
              </div>
              <div>
                <h3 className="font-medium">Weekly Workouts</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Target: {goals.weeklyWorkouts} workouts
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (todayStats.workoutsCompleted / goals.weeklyWorkouts) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {todayStats.workoutsCompleted} of {goals.weeklyWorkouts}{" "}
                completed
              </p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <FiClock
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
              </div>
              <div>
                <h3 className="font-medium">Active Minutes</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Target: {goals.activeMinutesPerDay} min daily
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (todayStats.activeMinutes / goals.activeMinutesPerDay) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {todayStats.activeMinutes} of {goals.activeMinutesPerDay}{" "}
                minutes
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workout Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <FiPlay className="mr-2 text-primary-600" />
          Workout Videos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exerciseOptions.map((exercise) => (
            <div
              key={exercise.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="h-40 bg-gray-100 dark:bg-gray-700 relative">
                {/* Replace this with actual image URL when you have them */}
                <img
                  src={`/${exercise.name.toLowerCase()}.avif`}
                  alt={`${exercise.name} workout`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a color with text if image fails to load
                    e.target.style.display = "none";
                    e.target.parentNode.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    e.target.parentNode.innerHTML = `<div class="text-xl font-bold text-gray-400 dark:text-gray-500">${exercise.name}</div>`;
                  }}
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                  <FiYoutube size={20} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="font-bold text-white">{exercise.name}</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {exercise.description}
                </p>
                <button
                  onClick={() => openWorkoutVideo(exercise.videoUrl)}
                  className="w-full py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <FiPlay className="mr-2" /> Watch Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <FiActivity className="mr-2 text-primary-600" />
          Activity History
        </h2>

        <div className="space-y-4">
          {activityByDate.length > 0 ? (
            activityByDate.slice(0, 5).map((day) => (
              <div
                key={day.date}
                className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{day.formattedDate}</h3>
                  <div className="flex space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{day.totalCalories || 0} kcal</span>
                    <span>{day.totalDuration || 0} min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-750 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3">
                          <FiActivity
                            className="text-primary-600 dark:text-primary-400"
                            size={16}
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {activity.activity_type ||
                              activity.name ||
                              activity.type ||
                              "Activity"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time ||
                              (activity.timestamp
                                ? new Date(
                                    activity.timestamp
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "12:00")}{" "}
                            •{" "}
                            {activity.duration_minutes ||
                              activity.duration ||
                              0}{" "}
                            min
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {activity.calories_burned || 0} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No activities logged yet. Click "Log Activity" to get started.
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            View All Activity
          </button>
        </div>
      </motion.div>

      {/* Log Activity Modal */}
      {showLogActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Log Activity</h2>
                <button
                  onClick={() => setShowLogActivity(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exercise Type
                  </label>
                  <select
                    name="exercise"
                    value={activityForm.exercise}
                    onChange={handleActivityFormChange}
                    className="form-select w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select an exercise</option>
                    {exerciseOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={activityForm.duration}
                    onChange={handleActivityFormChange}
                    className="form-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    min="1"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Intensity
                  </label>
                  <select
                    name="intensity"
                    value={activityForm.intensity}
                    onChange={handleActivityFormChange}
                    className="form-select w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="vigorous">Vigorous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={activityForm.date}
                    onChange={handleActivityFormChange}
                    className="form-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={activityForm.time}
                    onChange={handleActivityFormChange}
                    className="form-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {activityForm.exercise && (
                  <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      Estimated Calories
                    </div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {estimatedCalories} kcal
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Based on {activityForm.duration} min of{" "}
                      {activityForm.intensity} {activityForm.exercise}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowLogActivity(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogActivity}
                    disabled={
                      !activityForm.exercise ||
                      !activityForm.duration ||
                      isSubmitting
                    }
                    className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Log Activity"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Log Steps Modal */}
      {showLogSteps && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Log Steps</h2>
                <button
                  onClick={() => setShowLogSteps(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Steps Count
                  </label>
                  <input
                    type="number"
                    name="count"
                    value={stepsForm.count}
                    onChange={handleStepsFormChange}
                    className="form-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    min="1"
                    placeholder="Enter number of steps"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={stepsForm.date}
                    onChange={handleStepsFormChange}
                    className="form-input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium mb-1">Daily Goal</div>
                      <div className="text-lg font-bold">
                        {goals.dailySteps.toLocaleString()} steps
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Progress</div>
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {Math.round(
                          (todayStats.steps / goals.dailySteps) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowLogSteps(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogSteps}
                    disabled={!stepsForm.count || isSubmitting}
                    className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Log Steps"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
});

export default ActivityPage;
