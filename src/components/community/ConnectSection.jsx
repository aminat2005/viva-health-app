// src/components/community/ConnectSection.jsx
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUsers,
  FiSearch,
  FiUserPlus,
  FiUserCheck,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiMoreVertical,
  FiActivity,
  FiAward,
} from "react-icons/fi";

// Mock data for demonstration
const mockFriends = [
  {
    id: 1,
    name: "Emma Johnson",
    avatar: null,
    status: "Online",
    stats: { workouts: 24, streak: 8 },
    isFollowing: true,
  },
  {
    id: 2,
    name: "Noah Williams",
    avatar: null,
    status: "Last active 2h ago",
    stats: { workouts: 18, streak: 5 },
    isFollowing: true,
  },
  {
    id: 3,
    name: "Olivia Smith",
    avatar: null,
    status: "Online",
    stats: { workouts: 32, streak: 14 },
    isFollowing: true,
  },
];

const mockSuggestions = [
  {
    id: 4,
    name: "Liam Brown",
    avatar: null,
    mutualFriends: 3,
    stats: { workouts: 15, streak: 3 },
    isFollowing: false,
  },
  {
    id: 5,
    name: "Sophia Garcia",
    avatar: null,
    mutualFriends: 2,
    stats: { workouts: 22, streak: 7 },
    isFollowing: false,
  },
  {
    id: 6,
    name: "Jackson Miller",
    avatar: null,
    mutualFriends: 5,
    stats: { workouts: 28, streak: 10 },
    isFollowing: false,
  },
];

const mockPosts = [
  {
    id: 1,
    user: { id: 2, name: "Noah Williams", avatar: null },
    time: "2 hours ago",
    content:
      "Just hit a new personal record on my 5K run! 🏃‍♂️ Feeling great and motivated to keep pushing further.",
    image: null,
    achievement: { type: "running", value: "5K in 22:45" },
    likes: 12,
    comments: 3,
    isLiked: false,
  },
  {
    id: 2,
    user: { id: 3, name: "Olivia Smith", avatar: null },
    time: "5 hours ago",
    content:
      "Day 14 of my healthy eating challenge complete! I've noticed so much more energy throughout the day. Who else is focusing on nutrition this month?",
    image: null,
    likes: 24,
    comments: 7,
    isLiked: true,
  },
  {
    id: 3,
    user: { id: 4, name: "Liam Brown", avatar: null },
    time: "Yesterday",
    content: "Check out my workout stats for the week! Consistency is key 💪",
    image: null,
    stats: {
      workouts: 5,
      minutes: 225,
      calories: 1250,
    },
    likes: 18,
    comments: 4,
    isLiked: false,
  },
];

const ConnectSection = () => {
  const [activeView, setActiveView] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveView("feed")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "feed"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Activity Feed
          </button>
          <button
            onClick={() => setActiveView("friends")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "friends"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveView("discover")}
            className={`px-4 py-2 rounded-lg ${
              activeView === "discover"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Discover People
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-10 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {activeView === "feed" && (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FiUsers className="text-gray-500" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share your health journey..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <FiActivity className="mr-2" />
                Log Activity
              </button>
              <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <FiAward className="mr-2" />
                Share Achievement
              </button>
              <button className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm">
                Post
              </button>
            </div>
          </div>

          {/* Posts */}
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FiUsers className="text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">{post.user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {post.time}
                    </div>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <FiMoreVertical className="text-gray-500" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>
              </div>

              {/* Achievement or Stats (if any) */}
              {post.achievement && (
                <div className="mb-3 bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FiAward className="text-primary-600 dark:text-primary-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium">New Achievement</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {post.achievement.value}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {post.stats && (
                <div className="mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-medium">
                        {post.stats.workouts}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Workouts
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium">
                        {post.stats.minutes}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Minutes
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium">
                        {post.stats.calories}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Calories
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  className={`flex items-center text-sm ${
                    post.isLiked
                      ? "text-red-500"
                      : "text-gray-600 dark:text-gray-400"
                  } hover:text-red-500`}
                >
                  <FiHeart className="mr-1" />
                  {post.likes} Likes
                </button>
                <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <FiMessageSquare className="mr-1" />
                  {post.comments} Comments
                </button>
                <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <FiShare2 className="mr-1" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === "friends" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-4">Your Friends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FiUsers className="text-gray-500" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{friend.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {friend.status}
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <FiMoreVertical className="text-gray-500" />
                  </button>
                </div>

                <div className="flex justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="font-medium">{friend.stats.workouts}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Workouts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{friend.stats.streak}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Day Streak
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex justify-center items-center py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50">
                    <FiMessageSquare className="mr-1" size={14} />
                    Message
                  </button>
                  <button className="flex-1 flex justify-center items-center py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                    <FiActivity className="mr-1" size={14} />
                    Compare Stats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "discover" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-4">People You Might Know</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSuggestions.map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FiUsers className="text-gray-500" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {person.mutualFriends} mutual{" "}
                        {person.mutualFriends === 1 ? "friend" : "friends"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="font-medium">{person.stats.workouts}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Workouts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{person.stats.streak}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Day Streak
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex justify-center items-center py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                    Ignore
                  </button>
                  <button className="flex-1 flex justify-center items-center py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                    <FiUserPlus className="mr-1" size={14} />
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectSection;
