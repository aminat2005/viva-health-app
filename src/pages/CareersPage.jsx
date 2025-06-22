/* eslint-disable no-unused-vars */
// src/pages/CareersPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiSearch,
} from "react-icons/fi";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for an experienced frontend developer to join our team and help build amazing user experiences for our health tracking app.",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Design intuitive and beautiful interfaces for our health tracking applications across web and mobile platforms.",
  },
  {
    id: 3,
    title: "Nutrition Specialist",
    department: "Content",
    location: "Remote",
    type: "Contract",
    description:
      "Help develop and curate nutrition content, recipes, and meal plans for our health-conscious users.",
  },
  {
    id: 4,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build robust, scalable APIs and services that power our health tracking platform.",
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Lead the development of new features and improvements for our health tracking platform.",
  },
];

const CareersPage = () => {
  const [filter, setFilter] = useState("");

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.department.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Hero section */}
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
              Join Our{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Mission
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              We're on a mission to help people live healthier lives through
              technology. Join our team and make a meaningful impact on millions
              of users.
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search positions..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl"
            >
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Impact-Driven</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We build technology that makes a real difference in people's
                lives, helping them achieve their health goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-xl"
            >
              <div className="text-secondary-600 dark:text-secondary-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">User-Focused</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We put our users at the center of everything we do, building
                intuitive tools that meet their needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We're constantly exploring new ideas and technologies to create
                better health tracking solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Current Openings
          </h2>

          {filteredJobs.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiBriefcase className="mr-1" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiMapPin className="mr-1" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="mr-1" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {job.description}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700 dark:text-gray-300">
                No positions found matching your search.
              </p>
              <button
                onClick={() => setFilter("")}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Don't see a position that matches your skills?
            </p>
            <a
              href="mailto:careers@Viva Health.com"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Contact us at careers@Viva Health.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
