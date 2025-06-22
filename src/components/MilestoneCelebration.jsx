/* eslint-disable no-unused-vars */
// src/components/MilestoneCelebration.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiX } from "react-icons/fi";

const MilestoneCelebration = ({ show, message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    // Auto-hide after 5 seconds
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-8 right-8 z-50 max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div
              className={`${
                type === "success"
                  ? "bg-green-500"
                  : type === "warning"
                  ? "bg-yellow-500"
                  : "bg-primary-500"
              } px-4 py-2 flex justify-between items-center`}
            >
              <h3 className="text-white font-bold flex items-center">
                <FiAward className="mr-2" />
                {type === "success"
                  ? "Achievement Unlocked!"
                  : type === "warning"
                  ? "Almost There!"
                  : "Milestone Reached!"}
              </h3>
              <button
                onClick={() => {
                  setVisible(false);
                  if (onClose) onClose();
                }}
                className="text-white hover:text-gray-200"
              >
                <FiX />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800 dark:text-gray-200">{message}</p>

              {type === "success" && (
                <div className="mt-3 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <span className="text-2xl">🎉</span>
                  </div>
                </div>
              )}

              {type === "warning" && (
                <div className="mt-3 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <span className="text-2xl">💪</span>
                  </div>
                </div>
              )}

              {type !== "success" && type !== "warning" && (
                <div className="mt-3 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneCelebration;
