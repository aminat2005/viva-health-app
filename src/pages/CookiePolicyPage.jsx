/* eslint-disable no-unused-vars */
// src/pages/CookiePolicyPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiFile,
  FiShield,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.",
    required: true,
    cookies: [
      {
        name: "session_id",
        purpose: "Maintains your session across page requests",
        duration: "Session",
      },
      {
        name: "auth_token",
        purpose: "Authenticates your login status",
        duration: "30 days",
      },
      {
        name: "csrf_token",
        purpose: "Prevents cross-site request forgery attacks",
        duration: "Session",
      },
    ],
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description:
      "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
    required: false,
    cookies: [
      {
        name: "language",
        purpose: "Remembers your preferred language",
        duration: "1 year",
      },
      {
        name: "theme",
        purpose: "Remembers your dark/light mode preference",
        duration: "1 year",
      },
      {
        name: "last_viewed",
        purpose: "Tracks your most recently viewed features",
        duration: "30 days",
      },
    ],
  },
  {
    id: "performance",
    name: "Performance Cookies",
    description:
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
    required: false,
    cookies: [
      {
        name: "_ga",
        purpose: "Google Analytics - Distinguishes unique users",
        duration: "2 years",
      },
      {
        name: "_gid",
        purpose: "Google Analytics - Identifies user session",
        duration: "24 hours",
      },
      {
        name: "perf_timing",
        purpose: "Measures page load performance",
        duration: "Session",
      },
    ],
  },
  {
    id: "targeting",
    name: "Targeting Cookies",
    description:
      "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.",
    required: false,
    cookies: [
      {
        name: "ad_id",
        purpose: "Used for targeted advertising",
        duration: "90 days",
      },
      {
        name: "click_id",
        purpose: "Tracks advertisement clicks",
        duration: "30 days",
      },
      {
        name: "conversion_id",
        purpose: "Tracks marketing conversion events",
        duration: "90 days",
      },
    ],
  },
];

const CookiePolicyPage = () => {
  const [expandedCategory, setExpandedCategory] = useState("essential");

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
              Cookie{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              Last Updated: March 15, 2025
            </p>
            <div className="flex justify-center">
              <FiFile
                className="text-primary-600 dark:text-primary-400"
                size={48}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="lead">
                  This Cookie Policy explains what cookies are and how we use
                  them on our website and mobile applications. It also explains
                  how you can control and manage cookies through your browser
                  settings and cookie preference center.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiFile className="mr-2 text-primary-600 dark:text-primary-400" />
                  What Are Cookies?
                </h2>

                <p>
                  Cookies are small text files that are stored on your device
                  (computer, tablet, or mobile) when you visit a website.
                  Cookies are widely used to make websites work more efficiently
                  and provide information to the website owners.
                </p>

                <p>
                  Cookies serve various functions, such as enabling certain
                  features, remembering your preferences, and understanding how
                  visitors use the website so it can be improved.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiShield className="mr-2 text-primary-600 dark:text-primary-400" />
                  How We Use Cookies
                </h2>

                <p>We use cookies for several purposes, including:</p>

                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Essential:</strong> These are necessary for the
                    website to function properly and cannot be disabled.
                  </li>
                  <li>
                    <strong>Functional:</strong> These help enhance your
                    experience by remembering your preferences.
                  </li>
                  <li>
                    <strong>Performance:</strong> These help us understand how
                    visitors interact with our website so we can improve it.
                  </li>
                  <li>
                    <strong>Targeting:</strong> These are used to deliver
                    relevant advertisements to you on our website and other
                    websites.
                  </li>
                </ul>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiSettings className="mr-2 text-primary-600 dark:text-primary-400" />
                  Types of Cookies We Use
                </h2>
              </motion.div>

              {/* Cookie Categories Accordion */}
              <div className="mt-6 space-y-4">
                {cookieCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category.id ? null : category.id
                        )
                      }
                      className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        {category.required && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedCategory === category.id
                            ? "transform rotate-180"
                            : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {category.description}
                        </p>

                        <h4 className="font-medium mb-2">
                          Cookies in this category:
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Purpose
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Duration
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                              {category.cookies.map((cookie, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0
                                      ? "bg-gray-50 dark:bg-gray-800/50"
                                      : ""
                                  }
                                >
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                    {cookie.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {cookie.purpose}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {cookie.duration}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiSettings className="mr-2 text-primary-600 dark:text-primary-400" />
                  Managing Your Cookie Preferences
                </h2>

                <p>
                  You can set or modify your cookie preferences at any time by
                  using our cookie preference center. Additionally, most web
                  browsers allow some control of cookies through the browser
                  settings. To find out more about cookies, including how to see
                  what cookies have been set and how to manage and delete them,
                  visit{" "}
                  <a
                    href="https://www.allaboutcookies.org"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.allaboutcookies.org
                  </a>
                  .
                </p>

                <p>
                  Please note that disabling certain cookies may affect the
                  functionality of our website and your ability to use certain
                  features.
                </p>

                <h3 className="font-bold mt-6 mb-2">Browser Settings</h3>
                <p>
                  You can manage cookies through your web browser settings.
                  Here's how to do it in popular browsers:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Google Chrome:</strong> Settings → Privacy and
                    Security → Cookies and other site data
                  </li>
                  <li>
                    <strong>Mozilla Firefox:</strong> Options → Privacy &
                    Security → Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies and
                    website data
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong> Settings → Cookies and site
                    permissions → Cookies and site data
                  </li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  Changes to This Cookie Policy
                </h2>
                <p>
                  We may update our Cookie Policy from time to time to reflect
                  changes in technology, regulation, or our business practices.
                  Any changes will be posted on this page with an updated "Last
                  Updated" date. We encourage you to check this page
                  periodically to stay informed about our use of cookies.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies or this
                  Cookie Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>By email: privacy@Viva Health.com</li>
                  <li>
                    By visiting the contact page on our website:{" "}
                    <Link
                      to="/contact"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">
                        Cookie Preference Center
                      </h3>
                      <div className="mt-2 text-sm text-primary-700 dark:text-primary-200">
                        <p>
                          You can manage your cookie preferences at any time by
                          clicking the "Cookie Settings" button below.
                        </p>
                        <button className="mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm">
                          Cookie Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicyPage;
