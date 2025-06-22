/* eslint-disable no-unused-vars */
// src/components/ApiErrorDisplay.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiWifi,
  FiWifiOff,
  FiAlertCircle,
  FiRefreshCw,
  FiX,
  FiInfo,
} from "react-icons/fi";

const ApiErrorDisplay = ({ error, onRetry, onDismiss, className = "" }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case "NETWORK_ERROR":
        return <FiWifiOff className="w-5 h-5" />;
      case "AUTH_ERROR":
      case "AUTH_EXPIRED":
        return <FiInfo className="w-5 h-5" />;
      case "SERVER_ERROR":
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiAlertCircle className="w-5 h-5" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case "NETWORK_ERROR":
        return "orange";
      case "AUTH_ERROR":
      case "AUTH_EXPIRED":
        return "blue";
      case "SERVER_ERROR":
        return "red";
      default:
        return "red";
    }
  };

  const color = getErrorColor();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start">
          <div
            className={`text-${color}-600 dark:text-${color}-400 mr-3 mt-0.5`}
          >
            {getErrorIcon()}
          </div>

          <div className="flex-1">
            <h4
              className={`text-sm font-medium text-${color}-800 dark:text-${color}-200 mb-1`}
            >
              {error.operation && `${error.operation.replace(/_/g, " ")}: `}
              Error
            </h4>

            <p className={`text-sm text-${color}-700 dark:text-${color}-300`}>
              {error.userMessage || error.message}
            </p>

            {error.isRetryable && onRetry && (
              <button
                onClick={onRetry}
                className={`mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-${color}-700 bg-${color}-100 hover:bg-${color}-200 dark:text-${color}-200 dark:bg-${color}-900/40 dark:hover:bg-${color}-900/60 transition-colors`}
              >
                <FiRefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </button>
            )}
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`text-${color}-600 dark:text-${color}-400 hover:text-${color}-800 dark:hover:text-${color}-200 ml-2`}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApiErrorDisplay;
