/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiHome,
  FiActivity,
  FiBarChart2,
  FiDroplet,
  FiUsers,
  FiSettings,
  FiX,
  FiTrendingUp,
  FiCoffee,
  FiHeart,
  FiSun,
  FiRefreshCw,
} from "react-icons/fi";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../services/api";

const Sidebar = ({ setSidebarOpen }) => {
  const { darkMode } = useContext(ThemeContext);
  const [tip, setTip] = useState({
    content:
      "Make sure to track your water intake regularly. Staying hydrated is key to maintaining energy levels!",
    category: "hydration",
  });
  const [allTips, setAllTips] = useState([]); // Store all tips
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/app" },
    {
      name: "Nutrition",
      icon: <FiBarChart2 size={20} />,
      path: "/app/nutrition",
    },
    { name: "Activity", icon: <FiActivity size={20} />, path: "/app/activity" },
    {
      name: "Progress",
      icon: <FiTrendingUp size={20} />,
      path: "/app/progress",
    },
    { name: "Community", icon: <FiUsers size={20} />, path: "/app/community" },
    { name: "Settings", icon: <FiSettings size={20} />, path: "/app/settings" },
  ];

  // Fetch all tips once on mount
  const fetchAllTips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/tips/");

      let tips = [];

      // Handle different possible API response structures
      if (Array.isArray(response.data)) {
        tips = response.data;
      } else if (response.data && Array.isArray(response.data.tips)) {
        tips = response.data.tips;
      } else if (response.data && response.data.results) {
        tips = response.data.results;
      }

      if (tips.length > 0) {
        setAllTips(tips);
        // Set initial tip
        const randomIndex = Math.floor(Math.random() * tips.length);
        setTip(tips[randomIndex]);
        setCurrentTipIndex(randomIndex);
      } else {
        console.error("No tips found in response");
      }
    } catch (err) {
      console.error("Error fetching tips:", err);
      setError("Failed to load tips. Using default.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change to next tip
  const changeToNextTip = () => {
    if (allTips.length === 0) return;

    setIsChanging(true);

    // Get next tip (different from current)
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * allTips.length);
    } while (nextIndex === currentTipIndex && allTips.length > 1);

    setTimeout(() => {
      setTip(allTips[nextIndex]);
      setCurrentTipIndex(nextIndex);
      setIsChanging(false);
    }, 300);
  };

  // Fetch all tips on component mount
  useEffect(() => {
    fetchAllTips();
  }, []);

  // Set up interval to change tips
  useEffect(() => {
    // Only set up interval if we have tips
    if (allTips.length > 0) {
      const tipInterval = setInterval(() => {
        changeToNextTip();
      }, 30 * 1000); // 30 seconds

      return () => clearInterval(tipInterval);
    }
  }, [allTips, currentTipIndex]);

  // Manual refresh handler
  const handleRefreshTip = () => {
    if (allTips.length > 0) {
      changeToNextTip();
    } else {
      fetchAllTips(); // Try to fetch again if no tips
    }
  };

  // Get the appropriate icon based on the tip category
  const getTipIcon = () => {
    switch (tip.category?.toLowerCase()) {
      case "hydration":
        return (
          <FiDroplet
            className="text-primary-600 dark:text-primary-400"
            size={16}
          />
        );
      case "activity":
        return (
          <FiActivity
            className="text-primary-600 dark:text-primary-400"
            size={16}
          />
        );
      case "nutrition":
        return (
          <FiCoffee
            className="text-primary-600 dark:text-primary-400"
            size={16}
          />
        );
      case "wellness":
        return (
          <FiHeart
            className="text-primary-600 dark:text-primary-400"
            size={16}
          />
        );
      default:
        return (
          <FiSun className="text-primary-600 dark:text-primary-400" size={16} />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <img
              src="/viva-health-logo.png"
              alt="VIVA HEALTH"
              className="h-10 md:h-15 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Close sidebar"
        >
          <FiX className="text-gray-600 dark:text-gray-300" size={20} />
        </button>
      </div>

      {/* Navigation - with fixed height and no overflow */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tip Section - fixed at bottom */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg ${
            darkMode ? "border border-primary-700/20" : ""
          } relative overflow-hidden`}
        >
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mr-2">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                getTipIcon()
              )}
            </div>
            <h4 className="font-medium text-primary-600 dark:text-primary-400">
              Pro Tip
            </h4>
            <button
              onClick={handleRefreshTip}
              className="ml-auto p-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-colors"
              aria-label="Refresh tip"
              disabled={isLoading || isChanging}
            >
              <FiRefreshCw
                size={14}
                className={`text-primary-500 dark:text-primary-400 ${
                  isLoading || isChanging ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tip.content || Math.random()} // Fallback key for edge cases
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tip.content}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Subtle refresh indicator */}
          {isChanging && (
            <motion.div
              className="absolute inset-0 bg-primary-200/20 dark:bg-primary-500/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
