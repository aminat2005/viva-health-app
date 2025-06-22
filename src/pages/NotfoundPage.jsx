import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <FiAlertCircle size={80} className="text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          404
        </h1>
        <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
        >
          <FiHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
