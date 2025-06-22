/* eslint-disable no-unused-vars */
// src/components/community/ForumsSection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiUsers,
  FiHeart,
  FiMessageCircle,
  FiEye,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiPlusCircle,
  FiArrowLeft,
  FiShare2,
  FiBookmark,
  FiClock,
} from "react-icons/fi";

// Mock data for forums
const mockForumCategories = [
  {
    id: 1,
    name: "Nutrition & Diet",
    icon: "🥗",
    description:
      "Discuss healthy eating habits, recipes, meal plans and dietary questions",
    topics: 248,
    posts: 1893,
  },
  {
    id: 2,
    name: "Fitness & Exercise",
    icon: "💪",
    description:
      "Share workout routines, exercise tips, and fitness achievements",
    topics: 312,
    posts: 2456,
  },
  {
    id: 3,
    name: "Weight Loss",
    icon: "⚖️",
    description: "Support and strategies for sustainable weight loss journeys",
    topics: 189,
    posts: 1459,
  },
  {
    id: 4,
    name: "Mental Wellness",
    icon: "🧠",
    description:
      "Discussions on mental health, stress management, and mindfulness",
    topics: 154,
    posts: 982,
  },
  {
    id: 5,
    name: "Success Stories",
    icon: "🏆",
    description: "Share your health and fitness milestones and achievements",
    topics: 127,
    posts: 764,
  },
  {
    id: 6,
    name: "Ask the Community",
    icon: "❓",
    description: "General questions and advice from fellow health enthusiasts",
    topics: 203,
    posts: 1547,
  },
];

const mockTopics = [
  {
    id: 101,
    categoryId: 1,
    title: "Is intermittent fasting effective for weight loss?",
    author: {
      id: 1,
      name: "Emma Johnson",
      avatar: null,
    },
    date: "Mar 10, 2025",
    views: 1283,
    replies: 47,
    lastReply: {
      author: {
        id: 5,
        name: "Sophia Garcia",
      },
      date: "2 hours ago",
    },
    isPinned: true,
    isHot: true,
  },
  {
    id: 102,
    categoryId: 1,
    title: "Healthy meal prep ideas for busy professionals",
    author: {
      id: 3,
      name: "Olivia Smith",
      avatar: null,
    },
    date: "Mar 8, 2025",
    views: 876,
    replies: 32,
    lastReply: {
      author: {
        id: 2,
        name: "Noah Williams",
      },
      date: "Yesterday",
    },
    isPinned: false,
    isHot: true,
  },
  {
    id: 103,
    categoryId: 2,
    title: "How to properly do squats to avoid knee injury",
    author: {
      id: 2,
      name: "Noah Williams",
      avatar: null,
    },
    date: "Mar 5, 2025",
    views: 1053,
    replies: 38,
    lastReply: {
      author: {
        id: 4,
        name: "Liam Brown",
      },
      date: "5 hours ago",
    },
    isPinned: false,
    isHot: false,
  },
  {
    id: 104,
    categoryId: 4,
    title: "Tips for reducing stress through mindfulness",
    author: {
      id: 6,
      name: "Jackson Miller",
      avatar: null,
    },
    date: "Mar 1, 2025",
    views: 689,
    replies: 24,
    lastReply: {
      author: {
        id: 3,
        name: "Olivia Smith",
      },
      date: "3 days ago",
    },
    isPinned: false,
    isHot: false,
  },
  {
    id: 105,
    categoryId: 5,
    title: "I've lost 50 pounds in 8 months - here's how I did it",
    author: {
      id: 5,
      name: "Sophia Garcia",
      avatar: null,
    },
    date: "Feb 28, 2025",
    views: 2147,
    replies: 83,
    lastReply: {
      author: {
        id: 1,
        name: "Emma Johnson",
      },
      date: "Today",
    },
    isPinned: true,
    isHot: true,
  },
];

// Mock post data for a single topic
const mockPosts = [
  {
    id: 1001,
    topicId: 101,
    author: {
      id: 1,
      name: "Emma Johnson",
      avatar: null,
      joinDate: "Jan 2023",
      posts: 342,
    },
    date: "Mar 10, 2025",
    content:
      "I've been hearing a lot about intermittent fasting lately and I'm curious about its effectiveness for weight loss. Has anyone here tried it? What was your experience like? Did you notice any significant changes in your energy levels or overall health?\n\nI'm particularly interested in the 16/8 method, where you fast for 16 hours and eat during an 8-hour window. Is this sustainable in the long term? Any tips for beginners would be greatly appreciated!",
    likes: 28,
    isLiked: false,
  },
  {
    id: 1002,
    topicId: 101,
    author: {
      id: 3,
      name: "Olivia Smith",
      avatar: null,
      joinDate: "Mar 2023",
      posts: 189,
    },
    date: "Mar 10, 2025",
    content:
      "I've been doing intermittent fasting (16/8) for about 6 months now and have seen great results. Lost about 15 pounds and feel much more energetic throughout the day.\n\nThe first week was challenging as my body adjusted, but it gets easier. I typically skip breakfast and eat between 12pm-8pm. Having a big lunch and moderate dinner works best for me.\n\nMake sure to stay hydrated during fasting periods and don't overeat during your eating window. Also, it pairs well with regular exercise for maximum benefits.",
    likes: 42,
    isLiked: true,
  },
  {
    id: 1003,
    topicId: 101,
    author: {
      id: 2,
      name: "Noah Williams",
      avatar: null,
      joinDate: "Feb 2023",
      posts: 267,
    },
    date: "Mar 11, 2025",
    content:
      "Just wanted to add that intermittent fasting isn't just about weight loss - I noticed improvements in my mental clarity and focus as well. There's some research suggesting it may have benefits for cellular repair and longevity too.\n\nOne tip that helped me: start gradually. Maybe try a 12/12 schedule first, then work your way up to 16/8. And don't be too rigid - if you have a special occasion or just need to eat outside your window occasionally, it's okay. Consistency over time is what matters most.",
    likes: 15,
    isLiked: false,
  },
  {
    id: 1004,
    topicId: 101,
    author: {
      id: 5,
      name: "Sophia Garcia",
      avatar: null,
      joinDate: "Nov 2023",
      posts: 98,
    },
    date: "2 hours ago",
    content:
      "I agree with the others, but I also want to mention that intermittent fasting isn't for everyone. Some people with certain medical conditions or those taking specific medications should avoid fasting without consulting their doctor first.\n\nPersonally, I found that a 14/10 schedule works better for me than 16/8. It allows me to have a small breakfast which helps with my morning workout performance.\n\nEmma, if you decide to try it, track your progress and how you feel. That way you can adjust based on your personal experience!",
    likes: 7,
    isLiked: false,
  },
];

const ForumsSection = () => {
  const [activeView, setActiveView] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveView("topics");
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setActiveView("posts");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setActiveView("categories");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setActiveView("topics");
  };

  // Get topics for selected category
  const categoryTopics = selectedCategory
    ? mockTopics.filter((topic) => topic.categoryId === selectedCategory.id)
    : [];

  // Get posts for selected topic
  const topicPosts = selectedTopic
    ? mockPosts.filter((post) => post.topicId === selectedTopic.id)
    : [];

  // Filter categories based on search query
  const filteredCategories = mockForumCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          {activeView === "topics" && (
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back to Categories
            </button>
          )}

          {activeView === "posts" && (
            <button
              onClick={handleBackToTopics}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back to Topics
            </button>
          )}

          <h2 className="text-lg font-medium">
            {activeView === "categories" && "Forum Categories"}
            {activeView === "topics" && selectedCategory?.name}
            {activeView === "posts" && selectedTopic?.title}
          </h2>
        </div>

        <div className="flex space-x-2">
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

          {activeView === "topics" && (
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
            >
              <FiPlusCircle className="mr-2" />
              New Topic
            </button>
          )}

          {activeView === "posts" && (
            <button
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
            >
              <FiMessageCircle className="mr-2" />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Categories View */}
      {activeView === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center mr-4">
                      <FiMessageSquare className="mr-1" size={12} />
                      {category.topics} topics
                    </span>
                    <span className="flex items-center">
                      <FiMessageCircle className="mr-1" size={12} />
                      {category.posts} posts
                    </span>
                  </div>
                </div>
                <FiArrowRight className="text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Topics View */}
      {activeView === "topics" && selectedCategory && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center space-x-4 mb-3">
              <div className="text-3xl">{selectedCategory.icon}</div>
              <div>
                <h3 className="font-medium text-lg">{selectedCategory.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory.description}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">{selectedCategory.topics} topics</span>
              <span>{selectedCategory.posts} posts</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium border-b border-gray-200 dark:border-gray-600">
              <div className="col-span-6">Topic</div>
              <div className="col-span-2 text-center">Replies</div>
              <div className="col-span-2 text-center">Views</div>
              <div className="col-span-2 text-center">Last Post</div>
            </div>

            {categoryTopics.map((topic) => (
              <div
                key={topic.id}
                className="grid grid-cols-12 p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                onClick={() => handleTopicClick(topic)}
              >
                <div className="col-span-6">
                  <div className="flex items-center mb-1">
                    {topic.isPinned && (
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full mr-2">
                        Pinned
                      </span>
                    )}
                    {topic.isHot && (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-0.5 rounded-full mr-2">
                        Hot
                      </span>
                    )}
                    <h4 className="font-medium">{topic.title}</h4>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Started by {topic.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{topic.date}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-sm">
                    {topic.replies}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <FiEye className="mr-1" size={14} />
                  {topic.views}
                </div>
                <div className="col-span-2 text-xs text-right">
                  <div className="text-gray-900 dark:text-gray-300">
                    {topic.lastReply.author.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {topic.lastReply.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts View */}
      {activeView === "posts" && selectedTopic && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <h3 className="font-medium text-lg mb-1">{selectedTopic.title}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center mr-3">
                <FiUsers className="mr-1" size={14} />
                Started by {selectedTopic.author.name}
              </span>
              <span className="flex items-center mr-3">
                <FiClock className="mr-1" size={14} />
                {selectedTopic.date}
              </span>
              <span className="flex items-center mr-3">
                <FiMessageCircle className="mr-1" size={14} />
                {selectedTopic.replies} replies
              </span>
              <span className="flex items-center">
                <FiEye className="mr-1" size={14} />
                {selectedTopic.views} views
              </span>
            </div>
          </div>

          {topicPosts.map((post, index) => (
            <div
              key={post.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
                index === 0 ? "border-l-4 border-l-primary-500" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Author Info */}
                <div className="sm:w-48 p-4 bg-gray-50 dark:bg-gray-750 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                  <div className="flex flex-row sm:flex-col items-center sm:items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 mr-4 sm:mr-0">
                      <FiUsers className="text-gray-500" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{post.author.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Member since {post.author.joinDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {post.author.posts} posts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Posted on {post.date}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <FiShare2 size={16} />
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <FiBookmark size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <p className="whitespace-pre-line">{post.content}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className={`flex items-center text-sm ${
                        post.isLiked
                          ? "text-red-500"
                          : "text-gray-600 dark:text-gray-400"
                      } hover:text-red-500`}
                    >
                      <FiHeart className="mr-1" size={16} />
                      {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                    </button>
                    <button className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Reply to this post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiMessageCircle className="mr-2" />
              Reply to Topic
            </button>
          </div>
        </div>
      )}

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Topic</h2>
                <button
                  onClick={() => setShowNewTopicModal(false)}
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
                    Topic Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    placeholder="Enter a descriptive title for your topic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-750 px-3 py-2 rounded-lg">
                    <span className="text-2xl mr-2">
                      {selectedCategory.icon}
                    </span>
                    <span>{selectedCategory.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    rows="6"
                    placeholder="Share your thoughts, questions, or information..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTopicModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Create Topic
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Post/Reply Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reply to Topic</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
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

              <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg mb-4">
                <div className="font-medium">{selectedTopic?.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Replying to topic in {selectedCategory?.name}
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Reply
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                    rows="8"
                    placeholder="Write your reply here..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Post Reply
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

export default ForumsSection;
