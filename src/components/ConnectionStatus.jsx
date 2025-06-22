/* eslint-disable no-unused-vars */
// src/components/ConnectionStatus.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifi, FiWifiOff, FiAlertCircle } from "react-icons/fi";
import { useApiStatus } from "../hooks/useApiStatus";

const ConnectionStatus = () => {
  const { isOnline, apiConnected, error } = useApiStatus();

  // Don't show anything if everything is working
  if (isOnline && apiConnected) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium"
      >
        <div className="flex items-center justify-center">
          {!isOnline ? (
            <>
              <FiWifiOff className="mr-2" />
              No internet connection
            </>
          ) : !apiConnected ? (
            <>
              <FiAlertCircle className="mr-2" />
              Server connection lost
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;
