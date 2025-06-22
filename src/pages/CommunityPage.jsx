/* eslint-disable no-unused-vars */
// src/pages/CommunityPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiAward,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiFilter,
  FiHeart,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";

// Import components (we'll create these next)
import ConnectSection from "../components/community/ConnectSection";
import ChallengesSection from "../components/community/ChallengesSection";
import ForumsSection from "../components/community/ForumsSection";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("connect");

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Community</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect, share, and grow with others on your health journey
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("connect")}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "connect"
                ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FiUsers className="mr-2" />
            Connect
          </button>

          <button
            onClick={() => setActiveTab("challenges")}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "challenges"
                ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FiAward className="mr-2" />
            Challenges
          </button>

          <button
            onClick={() => setActiveTab("forums")}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "forums"
                ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FiMessageSquare className="mr-2" />
            Forums
          </button>
        </div>

        <div className="p-6">
          {activeTab === "connect" && <ConnectSection />}
          {activeTab === "challenges" && <ChallengesSection />}
          {activeTab === "forums" && <ForumsSection />}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
