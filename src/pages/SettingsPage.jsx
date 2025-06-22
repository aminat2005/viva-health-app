/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiSave,
  FiBell,
  FiEye,
  FiLock,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import * as authService from "../services/auth";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    reminderNotifications: true,
    marketingEmails: false,
  });

  // State for privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareActivity: false,
    showProfileToOthers: true,
    anonymousStatistics: true,
  });

  // State for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Handle notification settings changes
  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  // Handle privacy settings changes
  const handlePrivacyChange = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
  };

  // Navigate to password reset page
  const handlePasswordChange = () => {
    navigate("/forgot-password");
  };

  // Handle save notifications settings
  const saveNotificationSettings = async () => {
    setIsLoading(true);

    try {
      // In a real app, you would make an API call here
      // For example:
      // await api.post("/api/user/notification-settings", notificationSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success notification
      setNotification({
        show: true,
        message: "Notification settings saved successfully!",
        type: "success",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to save settings. Please try again.",
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save privacy settings
  const savePrivacySettings = async () => {
    setIsLoading(true);

    try {
      // In a real app, you would make an API call here
      // For example:
      // await api.post("/api/user/privacy-settings", privacySettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success notification
      setNotification({
        show: true,
        message: "Privacy settings saved successfully!",
        type: "success",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to save settings. Please try again.",
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      {/* Notification Banner */}
      {notification.show && (
        <div
          className={`mb-6 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 dark:bg-primary-800 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <FiSettings className="mr-2" /> App Settings
            </h1>
            <p className="text-sm mt-1 text-gray-100">
              Settings for {user?.username || "your"} account
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-medium dark:text-gray-200">
                  Dark Mode
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex items-center cursor-pointer"
              >
                {darkMode ? (
                  <FiToggleRight size={28} className="text-primary-500" />
                ) : (
                  <FiToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 dark:bg-primary-800 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FiBell className="mr-2" /> Notification Settings
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    Email Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("emailNotifications")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {notificationSettings.emailNotifications ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    App Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive in-app notifications
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("appNotifications")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {notificationSettings.appNotifications ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">Reminders</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive reminders for scheduled activities
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleNotificationChange("reminderNotifications")
                  }
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {notificationSettings.reminderNotifications ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    Marketing Emails
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive promotional emails and updates
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("marketingEmails")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {notificationSettings.marketingEmails ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveNotificationSettings}
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
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 dark:bg-primary-800 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FiLock className="mr-2" /> Privacy Settings
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    Share Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Allow others to see your health activities
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange("shareActivity")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {privacySettings.shareActivity ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    Profile Visibility
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Allow others to view your profile
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange("showProfileToOthers")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {privacySettings.showProfileToOthers ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    Anonymous Statistics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Allow your data to be used for anonymous statistics
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange("anonymousStatistics")}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {privacySettings.anonymousStatistics ? (
                    <FiToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <FiToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={savePrivacySettings}
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
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security Section - Simplified with only Change Password option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 dark:bg-primary-800 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FiEye className="mr-2" /> Security Settings
            </h2>
          </div>

          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your account security settings and password.
            </p>

            <div className="space-y-4">
              <button
                onClick={handlePasswordChange}
                className="w-full md:w-auto px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-md transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
