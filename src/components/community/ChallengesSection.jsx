/* eslint-disable no-unused-vars */
// src/components/community/ChallengesSection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiUser,
  FiUsers,
  FiCalendar,
  FiBarChart,
  FiTarget,
  FiPlus,
  FiFilter,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";

// Mock data for demonstration
const mockActiveChallenges = [
  {
    id: 1,
    title: "10K Steps Daily",
    category: "Walking",
    duration: "30 days",
    startDate: "Feb 15, 2025",
    endDate: "Mar 17, 2025",
    progress: 60,
    participants: 1248,
    joined: true,
    description:
      "Walk 10,000 steps every day for 30 days to improve your cardiovascular health and build a daily exercise habit.",
  },
  {
    id: 2,
    title: "No Sugar March",
    category: "Nutrition",
    duration: "31 days",
    startDate: "Mar 1, 2025",
    endDate: "Mar 31, 2025",
    progress: 45,
    participants: 956,
    joined: true,
    description:
      "Eliminate added sugars from your diet for the entire month. Track your progress daily and share tips with other participants.",
  },
];

const mockUpcomingChallenges = [
  {
    id: 3,
    title: "Spring Strength Challenge",
    category: "Strength",
    duration: "21 days",
    startDate: "Apr 1, 2025",
    endDate: "Apr 21, 2025",
    participants: 756,
    joined: false,
    description:
      "Complete 21 days of strength training exercises. Beginner, intermediate, and advanced tracks available.",
  },
  {
    id: 4,
    title: "Hydration Hero",
    category: "Wellness",
    duration: "14 days",
    startDate: "Mar 20, 2025",
    endDate: "Apr 3, 2025",
    participants: 1543,
    joined: false,
    description:
      "Drink at least 2.5 liters of water every day for two weeks. Track your intake and feel the benefits of proper hydration.",
  },
  {
    id: 5,
    title: "Meditation Marathon",
    category: "Mindfulness",
    duration: "30 days",
    startDate: "Apr 5, 2025",
    endDate: "May 5, 2025",
    participants: 834,
    joined: false,
    description:
      "Practice meditation daily, starting with just 5 minutes and building up to 20 minutes by the end of the challenge.",
  },
];

const mockCompletedChallenges = [
  {
    id: 6,
    title: "New Year, New You",
    category: "Fitness",
    duration: "30 days",
    startDate: "Jan 1, 2025",
    endDate: "Jan 30, 2025",
    result: "Completed",
    successRate: 92,
    participants: 2435,
    description:
      "Kickstart your fitness journey with daily workouts and healthy habits for the first month of the year.",
  },
  {
    id: 7,
    title: "Veganuary",
    category: "Nutrition",
    duration: "31 days",
    startDate: "Jan 1, 2025",
    endDate: "Jan 31, 2025",
    result: "Partially Completed",
    successRate: 65,
    participants: 1872,
    description:
      "Try a plant-based diet for the month of January. Discover new recipes and reduce your environmental impact.",
  },
];

const ChallengesSection = () => {
  const [activeView, setActiveView] = useState("active");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const categories = [
    "all",
    "fitness",
    "nutrition",
    "walking",
    "running",
    "strength",
    "mindfulness",
    "wellness",
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => setActiveView("active")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "active"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Active Challenges
          </button>
          <button
            onClick={() => setActiveView("upcoming")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "upcoming"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveView("completed")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "completed"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex space-x-2">
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FiFilter className="mr-2" />
              <span className="capitalize">{filterCategory}</span>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setFilterCategory(category);
                      setShowFilterDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 capitalize"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
          >
            <FiPlus className="mr-2" />
            Create Challenge
          </button>
        </div>
      </div>

      {activeView === "active" && (
        <div className="space-y-6">
          {mockActiveChallenges.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockActiveChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setShowChallengeDetails(challenge)}
                >
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{challenge.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center mr-4">
                          <FiCalendar className="mr-1" size={14} />
                          {challenge.duration}
                        </span>
                        <span className="flex items-center">
                          <FiUsers className="mr-1" size={14} />
                          {challenge.participants.toLocaleString()} participants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                      <FiAward
                        className="text-primary-600 dark:text-primary-400"
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Progress: {challenge.progress}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {challenge.startDate} - {challenge.endDate}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 flex items-center">
                      View Details <FiChevronRight className="ml-1" size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FiAward className="mx-auto text-gray-400 mb-3" size={40} />
              <h3 className="text-lg font-medium mb-1">No Active Challenges</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You're not participating in any challenges at the moment.
              </p>
              <button
                onClick={() => setActiveView("upcoming")}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Browse Upcoming Challenges
              </button>
            </div>
          )}
        </div>
      )}

      {activeView === "upcoming" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockUpcomingChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setShowChallengeDetails(challenge)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{challenge.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs capitalize mr-2">
                        {challenge.category}
                      </span>
                      <span className="flex items-center mr-4">
                        <FiCalendar className="mr-1" size={14} />
                        {challenge.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <FiAward
                      className="text-gray-600 dark:text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Starts: {challenge.startDate}
                  </span>
                  <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Join Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "completed" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCompletedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setShowChallengeDetails(challenge)}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{challenge.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs capitalize mr-2">
                        {challenge.category}
                      </span>
                      <span className="flex items-center mr-4">
                        <FiCalendar className="mr-1" size={14} />
                        {challenge.duration}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      challenge.result === "Completed"
                        ? "bg-green-50 dark:bg-green-900/30"
                        : "bg-yellow-50 dark:bg-yellow-900/30"
                    }`}
                  >
                    {challenge.result === "Completed" ? (
                      <FiCheckCircle
                        className="text-green-600 dark:text-green-400"
                        size={20}
                      />
                    ) : (
                      <FiAlertCircle
                        className="text-yellow-600 dark:text-yellow-400"
                        size={20}
                      />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Completion Rate</span>
                    <span>{challenge.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        challenge.successRate > 80
                          ? "bg-green-500"
                          : challenge.successRate > 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${challenge.successRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {challenge.startDate} - {challenge.endDate}
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 flex items-center">
                    View Results <FiChevronRight className="ml-1" size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Detail Modal */}
      {showChallengeDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {showChallengeDetails.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs capitalize mr-2">
                      {showChallengeDetails.category}
                    </span>
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" size={14} />
                      {showChallengeDetails.duration}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowChallengeDetails(null)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {showChallengeDetails.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </div>
                  <div className="font-medium">
                    {showChallengeDetails.startDate}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </div>
                  <div className="font-medium">
                    {showChallengeDetails.endDate}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Participants
                  </div>
                  <div className="font-medium">
                    {showChallengeDetails.participants?.toLocaleString() || "0"}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </div>
                  <div className="font-medium capitalize">
                    {showChallengeDetails.joined
                      ? "Joined"
                      : showChallengeDetails.result || "Not Joined"}
                  </div>
                </div>
              </div>

              {showChallengeDetails.progress !== undefined && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Progress: {showChallengeDetails.progress}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${showChallengeDetails.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {showChallengeDetails.successRate !== undefined && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Completion Rate: {showChallengeDetails.successRate}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        showChallengeDetails.successRate > 80
                          ? "bg-green-500"
                          : showChallengeDetails.successRate > 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${showChallengeDetails.successRate}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowChallengeDetails(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                {!showChallengeDetails.joined &&
                  !showChallengeDetails.result && (
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                      Join Challenge
                    </button>
                  )}
                {showChallengeDetails.joined && (
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    View Progress
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Challenge</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    placeholder="e.g., 30-Day Meditation Challenge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700">
                    <option value="">Select Category</option>
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="walking">Walking</option>
                    <option value="running">Running</option>
                    <option value="strength">Strength</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    rows="4"
                    placeholder="Describe your challenge and what participants should do..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Create Challenge
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChallengesSection;
