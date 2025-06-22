// src/hooks/useApiStatus.js
import { useState, useEffect } from "react";
import { testConnection, checkNetworkStatus } from "../services/api";

export const useApiStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    apiConnected: null,
    lastChecked: null,
    error: null,
  });

  const checkStatus = async () => {
    const networkStatus = checkNetworkStatus();

    if (!networkStatus) {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        apiConnected: false,
        lastChecked: new Date(),
        error: "No internet connection",
      }));
      return;
    }

    try {
      const result = await testConnection();
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        apiConnected: result.status === "connected",
        lastChecked: new Date(),
        error: result.error || null,
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        apiConnected: false,
        lastChecked: new Date(),
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    // Check status on mount
    checkStatus();

    // Listen for online/offline events
    const handleOnline = () => checkStatus();
    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        apiConnected: false,
        error: "Internet connection lost",
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodic status check every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { ...status, checkStatus };
};
