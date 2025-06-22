/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef, useEffect } from "react";
import {
  FiUser,
  FiEdit,
  FiSave,
  FiX,
  FiUpload,
  FiActivity,
  FiTarget,
  FiDroplet,
  FiTrendingUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import * as userService from "../services/user";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    profile: {
      age: "",
      gender: "",
      weight: "",
      height: "",
      waist_circ: "",
      hip_circ: "",
      activity_level: "",
      goal: "",
      pref_diet: [],
    },
    goals: {
      weight_goal: 60,
      daily_steps_goal: 5000,
      weekly_activity_goal: 4,
      daily_water_goal: 2.5,
      target_daily_calories: 2000,
    },
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Update form data when user data is available
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // Get the latest profile data from the API
        const profileData = await userService.getUserProfile();

        if (profileData) {
          // Map backend profile data to form data structure
          setFormData({
            username: profileData.username || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            bio: profileData.bio || "",
            profile: {
              age: profileData.age || "",
              gender: profileData.gender || "",
              weight: profileData.weight || "",
              height: profileData.height || "",
              waist_circ: profileData.waist_circ || "",
              hip_circ: profileData.hip_circ || "",
              activity_level: profileData.activity_level || "moderate",
              goal: profileData.goal || "weight_loss",
              pref_diet: profileData.pref_diet
                ? typeof profileData.pref_diet === "string"
                  ? profileData.pref_diet.split(",")
                  : profileData.pref_diet
                : [],
            },
            goals: {
              weight_goal: profileData.weight_goal || profileData.weight || "",
              weekly_activity_goal: profileData.weekly_activity_goal || 4,
              daily_water_goal: profileData.daily_water_goal || 2.5,
              daily_steps_goal: profileData.daily_steps_goal || 10000,
              target_daily_calories: profileData.target_daily_calories || 2000,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setNotification({
          show: true,
          message: "Failed to load profile data. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Handle input changes for basic info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for profile data
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle dietary preferences checkboxes
      setFormData((prev) => {
        const currentPreferences = [...prev.profile.pref_diet];
        if (checked) {
          // Add preference if it's not already in the array
          if (!currentPreferences.includes(value)) {
            currentPreferences.push(value);
          }
        } else {
          // Remove preference
          const index = currentPreferences.indexOf(value);
          if (index > -1) {
            currentPreferences.splice(index, 1);
          }
        }

        return {
          ...prev,
          profile: {
            ...prev.profile,
            pref_diet: currentPreferences,
          },
        };
      });
    } else {
      // Handle other profile inputs
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value,
        },
      }));
    }
  };

  // Handle input changes for goals data
  const handleGoalsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      goals: {
        ...prev.goals,
        [name]: value,
      },
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      const resetData = async () => {
        try {
          const profileData = await userService.getUserProfile();
          if (profileData) {
            setFormData({
              username: profileData.username || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
              bio: profileData.bio || "",
              profile: {
                age: profileData.age || "",
                gender: profileData.gender || "",
                weight: profileData.weight || "",
                height: profileData.height || "",
                waist_circ: profileData.waist_circ || "",
                hip_circ: profileData.hip_circ || "",
                activity_level: profileData.activity_level || "moderate",
                goal: profileData.goal || "weight_loss",
                pref_diet: profileData.pref_diet
                  ? typeof profileData.pref_diet === "string"
                    ? profileData.pref_diet.split(",")
                    : profileData.pref_diet
                  : [],
              },
              goals: {
                weight_goal:
                  profileData.weight_goal || profileData.weight || "",
                weekly_activity_goal: profileData.weekly_activity_goal || 4,
                daily_water_goal: profileData.daily_water_goal || 2.5,
                daily_steps_goal: profileData.daily_steps_goal || 10000,
                target_daily_calories:
                  profileData.target_daily_calories || 2000,
              },
            });
            //setPreviewUrl(profileData.profile_picture || null);
          }
        } catch (error) {
          console.error("Error resetting form data:", error);
        }
      };

      resetData();
      //setProfilePicture(null);
    }
    setIsEditing(!isEditing);
  };

  // Format goal or activity level for display
  const formatForDisplay = (str) => {
    if (!str) return "";

    // Handle backend keys with underscores
    const formatted = str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/([A-Z])/g, " $1"); // Insert space before capital letters

    // Capitalize first letter of each word
    return formatted
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, prepare the profile data to match backend expectations
      const profileData = {
        username: formData.username,
        email: formData.email,
        age: parseInt(formData.profile.age) || 0,
        gender: formData.profile.gender || "",
        weight: parseFloat(formData.profile.weight) || 0,
        height: parseFloat(formData.profile.height) || 0,
        waist_circ: parseFloat(formData.profile.waist_circ) || 0,
        hip_circ: parseFloat(formData.profile.hip_circ) || 0,
        activity_level: formData.profile.activity_level || "moderate",
        goal: formData.profile.goal || "weight_loss",
        pref_diet: formData.profile.pref_diet.join(","),
        weight_goal:
          parseFloat(formData.goals.weight_goal) ||
          parseFloat(formData.profile.weight) ||
          0,
        weekly_activity_goal:
          parseInt(formData.goals.weekly_activity_goal) || 4,
        daily_water_goal: parseFloat(formData.goals.daily_water_goal) || 2.5,
        daily_steps_goal: parseInt(formData.goals.daily_steps_goal) || 10000,
        target_daily_calories:
          parseInt(formData.goals.target_daily_calories) || 2000,
      };

      // Upload logic (with or without image)

      await userService.updateUserProfile(profileData);

      // ✅ Refetch updated profile and sync
      const updatedProfile = await userService.getUserProfile();
      localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
      setUser(updatedProfile);

      setNotification({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });

      setIsEditing(false);

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Please try again.";

      setNotification({
        show: true,
        message: `Failed to update profile: ${errorMsg}`,
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // If data is still loading, show loading state
  if (isLoading && !isEditing) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 dark:bg-primary-800 p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <button
            onClick={toggleEditMode}
            className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-3 py-1.5 rounded-md"
          >
            {isEditing ? (
              <>
                <FiX size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <FiEdit size={18} />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center mb-8">
              <div className="relative group mb-4 sm:mb-0 sm:mr-8">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <FiUser
                    className="text-primary-600 dark:text-primary-400"
                    size={48}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-gray-100">
                  {formData.username || "User"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.email || "user@example.com"}
                </p>
                {formData.profile && formData.profile.goal && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FiTarget className="mr-1" size={14} />
                    <span>Goal: {formatForDisplay(formData.profile.goal)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                Basic Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Health Goals Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                Health Goals
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="weight_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Weight Goal (kg)
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
                        <FiTarget
                          className="text-primary-600 dark:text-primary-400"
                          size={18}
                        />
                      </div>
                      <input
                        type="number"
                        id="weight_goal"
                        name="weight_goal"
                        value={formData.goals.weight_goal}
                        onChange={handleGoalsChange}
                        disabled={!isEditing}
                        min="20"
                        max="300"
                        step="0.1"
                        placeholder={formData.profile.weight || "Target weight"}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Your target weight for your fitness journey
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="daily_steps_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Daily Steps Goal
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                        <FiTrendingUp
                          className="text-purple-600 dark:text-purple-400"
                          size={18}
                        />
                      </div>
                      <input
                        type="number"
                        id="daily_steps_goal"
                        name="daily_steps_goal"
                        value={formData.goals.daily_steps_goal}
                        onChange={handleGoalsChange}
                        disabled={!isEditing}
                        min="1000"
                        max="50000"
                        step="500"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Your daily step count goal
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="weekly_activity_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Weekly Activity Goal
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                        <FiActivity
                          className="text-green-600 dark:text-green-400"
                          size={18}
                        />
                      </div>
                      <input
                        type="number"
                        id="weekly_activity_goal"
                        name="weekly_activity_goal"
                        value={formData.goals.weekly_activity_goal}
                        onChange={handleGoalsChange}
                        disabled={!isEditing}
                        min="1"
                        max="21"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Number of workouts per week
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="target_daily_calories"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Daily Calorie Goal
                    </label>
                    <input
                      type="number"
                      id="target_daily_calories"
                      name="target_daily_calories"
                      value={formData.goals.target_daily_calories}
                      onChange={handleGoalsChange}
                      disabled={!isEditing}
                      min="1000"
                      max="5000"
                      step="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="daily_water_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Daily Water Goal (L)
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FiDroplet
                          className="text-blue-600 dark:text-blue-400"
                          size={18}
                        />
                      </div>
                      <input
                        type="number"
                        id="daily_water_goal"
                        name="daily_water_goal"
                        value={formData.goals.daily_water_goal}
                        onChange={handleGoalsChange}
                        disabled={!isEditing}
                        min="0.5"
                        max="8"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Liters of water per day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                Health Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="profile.age"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      id="profile.age"
                      name="age"
                      value={formData.profile.age}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      min="12"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile.gender"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Gender
                    </label>
                    <select
                      id="profile.gender"
                      name="gender"
                      value={formData.profile.gender}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="profile.weight"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="profile.weight"
                      name="weight"
                      min="20"
                      max="500"
                      step="0.1"
                      value={formData.profile.weight}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile.height"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="profile.height"
                      name="height"
                      min="50"
                      max="300"
                      value={formData.profile.height}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile.waist_circ"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Waist Circumference (cm)
                    </label>
                    <input
                      type="number"
                      id="profile.waist_circ"
                      name="waist_circ"
                      min="40"
                      max="200"
                      value={formData.profile.waist_circ}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile.hip_circ"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Hip Circumference (cm)
                    </label>
                    <input
                      type="number"
                      id="profile.hip_circ"
                      name="hip_circ"
                      min="40"
                      max="200"
                      value={formData.profile.hip_circ}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="profile.activity_level"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Activity Level
                    </label>
                    <select
                      id="profile.activity_level"
                      name="activity_level"
                      value={formData.profile.activity_level}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    >
                      <option value="sedentary">
                        Sedentary (little or no exercise)
                      </option>
                      <option value="light">
                        Light (exercise 1-3 times/week)
                      </option>
                      <option value="moderate">
                        Moderate (exercise 3-5 times/week)
                      </option>
                      <option value="active">
                        Active (exercise 6-7 times/week)
                      </option>
                      <option value="very_active">
                        Very Active (intense exercise 6-7 times/week)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="profile.goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Primary Goal
                    </label>
                    <select
                      id="profile.goal"
                      name="goal"
                      value={formData.profile.goal}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    >
                      <option value="weight_loss">Lose Weight</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="weight_gain">Gain Weight</option>
                      <option value="build_muscle">Build Muscle</option>
                      <option value="improve_endurance">
                        Improve Endurance
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dietary Preferences
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {[
                      "vegetarian",
                      "vegan",
                      "gluten_free",
                      "dairy_free",
                      "keto",
                      "paleo",
                    ].map((diet) => (
                      <div key={diet} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`diet-${diet}`}
                          name="pref_diet"
                          value={diet}
                          checked={formData.profile.pref_diet.includes(diet)}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
                        />
                        <label
                          htmlFor={`diet-${diet}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300 capitalize"
                        >
                          {formatForDisplay(diet)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
