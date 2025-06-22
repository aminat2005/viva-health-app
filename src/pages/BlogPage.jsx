// src/pages/BlogPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiArrowLeft, FiSearch, FiClock, FiUser, FiTag } from "react-icons/fi";

const blogPosts = [
  {
    id: 1,
    title: "10 Simple Ways to Increase Your Daily Water Intake",
    excerpt:
      "Staying hydrated is essential for overall health. Learn easy strategies to ensure youre drinking enough water throughout the day.",
    category: "Hydration",
    date: "May 15, 2025",
    author: "Maria Rodriguez",
    imageUrl: "/blog/water-intake.jpg",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Science Behind Effective Calorie Tracking",
    excerpt:
      "Understanding how calorie tracking works can help you achieve your health goals more effectively. We break down the science and best practices.",
    category: "Nutrition",
    date: "May 8, 2025",
    author: "David Chen",
    imageUrl: "/blog/calorie-tracking.jpg",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "How Activity Tracking Can Improve Your Fitness Results",
    excerpt:
      "Regular tracking of your physical activity can lead to better fitness outcomes. Discover how to use activity data to optimize your workouts.",
    category: "Fitness",
    date: "April 30, 2025",
    author: "James Wilson",
    imageUrl: "/blog/activity-tracking.jpg",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Building Healthy Eating Habits That Last",
    excerpt:
      "Creating sustainable eating habits is more effective than crash diets. Learn strategies for developing a healthy relationship with food.",
    category: "Nutrition",
    date: "April 22, 2025",
    author: "Sarah Johnson",
    imageUrl: "/blog/healthy-eating.jpg",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Connection Between Sleep and Weight Management",
    excerpt:
      "Sleep quality plays a crucial role in weight management and overall health. Discover how to optimize your sleep for better results.",
    category: "Wellness",
    date: "April 15, 2025",
    author: "Maria Rodriguez",
    imageUrl: "/blog/sleep-weight.jpg",
    readTime: "9 min read",
  },
  {
    id: 6,
    title: "Using Data to Reach Your Health Goals Faster",
    excerpt:
      "Learn how to interpret and act on your health tracking data to accelerate progress and achieve better results.",
    category: "Data Analysis",
    date: "April 8, 2025",
    author: "David Chen",
    imageUrl: "/blog/health-data.jpg",
    readTime: "10 min read",
  },
];

const categories = [
  "All",
  "Nutrition",
  "Fitness",
  "Hydration",
  "Wellness",
  "Data Analysis",
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 mb-8 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Viva Health{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Expert insights, tips, and stories to support your health journey
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200" preserveAspectRatio="none"%3E%3Crect fill="%23CCCCCC" width="400" height="200" /%3E%3Ctext fill="%23666666" font-family="sans-serif" font-size="18" dy=".3em" text-anchor="middle" x="200" y="100"%3E${post.category}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 space-x-4">
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {post.author}
                      </span>
                      <span>{post.date}</span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.id}`}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center"
                    >
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700 dark:text-gray-300">
                No articles found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-50 dark:bg-primary-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Get the latest health tips, app updates, and exclusive content
              delivered to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              By subscribing, you agree to our{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              . We'll never share your email address.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
