/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Import icons
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiActivity,
  FiBarChart2,
  FiDroplet,
  FiHeart,
  FiTarget,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Header */}
      <header
        className={`fixed w-full transition-all duration-300 z-50 ${
          scrollY > 50
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
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

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex items-center space-x-8"
            >
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hover:scale-105 transition-transform font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hover:scale-105 transition-transform font-medium"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hover:scale-105 transition-transform font-medium"
              >
                How it Works
              </button>
            </motion.nav>

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center space-x-4"
            >
              <Link
                to="/login"
                className="px-5 py-2.5 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-primary-600/20"
              >
                Sign Up
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 py-6 px-4 space-y-6 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border-2 border-gray-100 dark:border-gray-700 backdrop-blur-lg relative z-50"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.98)", // Force thick white background
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    scrollToSection("features");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-200"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection("benefits");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-200"
                >
                  Benefits
                </button>
                <button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-200"
                >
                  How it Works
                </button>
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  className="py-3 px-6 text-center text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="py-3 px-6 text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl transition-all duration-300 shadow-lg font-medium hover:shadow-xl transform hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </header>
      {/* hero section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2 mb-12 md:mb-0"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 md:bg-transparent md:p-0 shadow-lg md:shadow-none">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Transform Your{" "}
                  <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 bg-clip-text text-transparent">
                    Health Journey
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                  Track your nutrition, activity, and water intake all in one
                  place. Achieve your health goals with personalized insights
                  and recommendations.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center py-3.5 px-8 text-center font-medium text-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-primary-500/30 group"
                  >
                    Get Started
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300 animate-pulse" />
                  </Link>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="flex items-center justify-center py-3.5 px-8 text-center font-medium text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                  >
                    Learn More
                    <FiArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:w-1/2"
            >
              {/* Image Collage */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 rounded-3xl transform rotate-2"></div>
                <div className="relative z-10 grid grid-cols-2 gap-4 p-4">
                  {/* Activity Image */}
                  <div className="row-span-2 col-span-1">
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-xl overflow-hidden shadow-md h-full"
                    >
                      <img
                        src="/exercise.webp"
                        alt="Physical Activity Tracking"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" preserveAspectRatio="none"%3E%3Crect fill="%23FF7D51" width="300" height="300" /%3E%3Ctext fill="%23FFF" font-family="sans-serif" font-size="18" dy=".3em" text-anchor="middle" x="150" y="150"%3EActivity%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Nutrition Image */}
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden shadow-md"
                  >
                    <img
                      src="/nutrition.webp"
                      alt="Nutrition Tracking"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150" preserveAspectRatio="none"%3E%3Crect fill="%2362CD8F" width="300" height="150" /%3E%3Ctext fill="%23FFF" font-family="sans-serif" font-size="18" dy=".3em" text-anchor="middle" x="150" y="75"%3ENutrition%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </motion.div>

                  {/* Water Intake Image */}
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden shadow-md"
                  >
                    <img
                      src="/water-intake.webp"
                      alt="Water Intake Tracking"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150" preserveAspectRatio="none"%3E%3Crect fill="%233F8CFF" width="300" height="150" /%3E%3Ctext fill="%23FFF" font-family="sans-serif" font-size="18" dy=".3em" text-anchor="middle" x="150" y="75"%3EWater Intake%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 z-20"
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                      <FiActivity
                        className="text-green-600 dark:text-green-400"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Today's Steps
                      </p>
                      <p className="font-bold">8,749</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-6 right-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 z-20"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                      <FiDroplet
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Water Intake
                      </p>
                      <p className="font-bold">1.8L</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary-100/50 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need To Stay Healthy
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our comprehensive tracking tools help you monitor every aspect of
              your health journey, all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                <FiActivity className="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Activity Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Monitor your workouts, steps, and daily movement to stay on
                track with your fitness goals.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                <FiBarChart2 className="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Nutrition Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Track your meals and get insights on your caloric intake,
                macros, and nutritional balance.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                <FiDroplet className="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Water Intake</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Stay hydrated with our water intake tracker and personalized
                reminders throughout the day.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                <FiHeart className="text-primary-600 dark:text-primary-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Insights</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Get personalized recommendations and insights based on your
                activity and nutrition data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Benefits Section (replacing testimonials) */}
      <section
        id="benefits"
        className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute right-0 top-1/4 text-primary-100 dark:text-primary-900/20 w-1/3 h-1/3 opacity-50"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M42.7,-73.2C55.9,-65.7,67.7,-55.5,76.6,-42.8C85.4,-30.1,91.3,-15.1,92.6,0.7C93.9,16.6,90.6,33.1,81.9,46.6C73.2,60.1,59.1,70.5,44.1,76.2C29.2,81.9,13.6,82.9,-1.1,84.6C-15.8,86.3,-31.5,88.7,-44.1,82.7C-56.7,76.7,-66.1,62.3,-71.8,47.7C-77.6,33,-79.8,18.2,-81.9,2.5C-84,-13.3,-86.1,-29.5,-79.2,-41.3C-72.3,-53.1,-56.5,-60.5,-41.9,-67.2C-27.2,-73.9,-13.6,-79.9,0.6,-80.9C14.8,-81.9,29.5,-80.7,42.7,-73.2Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute left-0 bottom-1/4 text-secondary-100 dark:text-secondary-900/20 w-1/3 h-1/3 opacity-50"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M52.8,-75.7C67.9,-68.4,79.3,-52.9,84.6,-36.2C89.9,-19.5,89,-1.7,83.8,14C78.6,29.8,69.1,43.4,56.6,53.5C44.1,63.7,28.7,70.4,12.4,74.4C-3.9,78.4,-21,79.8,-35.5,73.5C-50,67.2,-61.9,53.3,-70.9,37.9C-79.8,22.5,-85.8,5.7,-83.2,-9.5C-80.7,-24.7,-69.6,-38.3,-56.6,-46.9C-43.6,-55.6,-28.8,-59.2,-14.2,-67.6C0.4,-75.9,14.8,-89,32.2,-88.1C49.6,-87.3,69.8,-72.4,83.6,-54.8"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Real Benefits, Real Results
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our users experience tangible improvements in their health and
              lifestyle. See how Viva Health can transform your well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 - Water Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
            >
              <div className="mb-4 text-blue-500 dark:text-blue-400">
                <FiDroplet size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Improved Hydration</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Users report drinking 40% more water after using our water
                tracking feature. Better hydration leads to improved energy,
                skin health, and cognitive function.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Visual water bottle representation
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Smart hydration reminders
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Personalized daily water targets
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Benefit 2 - Calorie Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
            >
              <div className="mb-4 text-primary-500 dark:text-primary-400">
                <FiBarChart2 size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Calorie Awareness</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                People who track food intake consume an average of 300 fewer
                calories per day and make healthier food choices when they can
                see their nutritional data.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive food database
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Macro and micronutrient tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Visual meal breakdown analytics
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Benefit 3 - Activity Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
            >
              <div className="mb-4 text-green-500 dark:text-green-400">
                <FiActivity size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Increased Activity</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Users increase their daily physical activity by up to 27% within
                the first month of using our activity tracking features, leading
                to improved fitness and mood.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Step counter with goals
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Workout tracking and suggestions
                  </span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Progress visualization and streaks
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How Viva Health Works
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our simple 3-step process makes health tracking easier than ever
              before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-8">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <motion.div
                  className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent"
                  style={{ display: "none" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Set up your profile with your health goals, preferences, and
                baseline metrics
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center mb-8">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Track Your Data</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Log your meals, activity, and water intake using our intuitive
                interface
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mb-8">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Insights</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Receive personalized insights and recommendations to optimize
                your health journey
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 text-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center py-3.5 px-8 text-center font-medium text-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
            >
              Start Your Journey Today
            </Link>
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-300 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative z-10">
            {/* Left side content */}
            <div className="md:w-1/2 p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-md"
              >
                <div className="inline-block p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-6 text-primary-600 dark:text-primary-400">
                  <FiAward size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Health Journey?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Join thousands of users who have improved their lives with
                  Viva Health. Sign up today and take the first step towards a
                  healthier you.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/signup"
                    className="py-3 px-6 text-center font-medium bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md flex items-center justify-center group"
                  >
                    Get Started Now
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    to="/login"
                    className="py-3 px-6 text-center font-medium border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right side image/decoration */}
            <div className="md:w-1/2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 p-8 md:p-0 hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="h-full flex items-center justify-center"
              >
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-200 dark:bg-primary-700 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-secondary-200 dark:bg-secondary-700 rounded-full opacity-50"></div>

                  {/* Main icons/illustrations */}
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <FiActivity className="text-primary-500 mb-3" size={36} />
                      <h3 className="font-bold mb-1">Track Activity</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monitor your workouts and daily movement
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <FiBarChart2
                        className="text-secondary-500 mb-3"
                        size={36}
                      />
                      <h3 className="font-bold mb-1">Analyze Nutrition</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track calories and nutrients
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <FiDroplet className="text-blue-500 mb-3" size={36} />
                      <h3 className="font-bold mb-1">Measure Hydration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stay hydrated with water tracking
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <FiTarget className="text-green-500 mb-3" size={36} />
                      <h3 className="font-bold mb-1">Reach Goals</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Achieve your health targets
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <img
                  src="/viva-health-logo.png"
                  alt="VIVA HEALTH"
                  className="h-10 md:h-15 mb-4 w-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
              <p className="text-gray-400 mb-4">
                Taking control of your health has never been easier.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 transition-transform duration-300"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 transition-transform duration-300"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110 transition-transform duration-300"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-3">
                <li className="text-gray-400">Activity Tracking</li>
                <li className="text-gray-400">Nutrition Analysis</li>
                <li className="text-gray-400">Water Intake Monitoring</li>
                <li className="text-gray-400">Community Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform transition-transform duration-300 block"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Viva Health. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
