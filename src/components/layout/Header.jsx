/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import {
  FiUser,
  FiLogOut,
  FiBell,
  FiMenu,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContext";

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useContext(NotificationContext);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Handle user profile image - check various possible property names
  useEffect(() => {
    if (user) {
      // Check different possible property names for the profile image
      const possibleImageProps = [
        user.image,
        user.profile_picture,
        user.profilePicture,
        user.avatar,
        user.profile?.profile_picture,
        user.profile?.image,
      ];

      // Find the first non-null/undefined image URL
      const imageUrl = possibleImageProps.find((prop) => prop);

      if (imageUrl) {
        setProfileImage(imageUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    if (showNotifications) setShowNotifications(false);
    if (showUserMenu) setShowUserMenu(false);
  };

  // Navigate to profile page and close menu
  const goToProfile = () => {
    navigate("/app/profile");
    setShowUserMenu(false);
  };

  // Navigate to settings page and close menu
  const goToSettings = () => {
    navigate("/app/settings");
    setShowUserMenu(false);
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.name) return user.name;
    if (user?.email) {
      // If only email is available, display the part before @
      return user.email.split("@")[0];
    }
    return "User";
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 z-10 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="text-gray-600 dark:text-gray-300" size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FiSun className="text-yellow-400" size={20} />
            ) : (
              <FiMoon className="text-gray-600 dark:text-gray-300" size={20} />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              aria-label="Notifications"
            >
              <FiBell className="text-gray-600 dark:text-gray-300" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            !notification.read
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="text-sm">{notification.message}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={getUserDisplayName()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser
                    className="text-primary-600 dark:text-primary-400"
                    size={16}
                  />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {getUserDisplayName()}
              </span>
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium">{getUserDisplayName()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || "user@example.com"}
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={goToProfile}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Profile
                    </button>
                    <button
                      onClick={goToSettings}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                    >
                      <FiLogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
