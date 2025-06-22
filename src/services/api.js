// src/services/api.js
import axios from "axios";

// Base URL for the API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://health-tracker-gzw8.onrender.com/";

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request counter for debugging
let requestCounter = 0;

// Enhanced retry function with exponential backoff
export const apiCallWithRetry = async (
  apiCall,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryableError = isErrorRetryable(error);

      if (isLastAttempt || !isRetryableError) {
        throw enhanceError(error);
      }

      // Calculate delay with exponential backoff + jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(
        `API retry attempt ${attempt + 1}/${maxRetries + 1} in ${delay}ms`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Check if error is retryable
const isErrorRetryable = (error) => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }

  const status = error.response.status;
  // Retry on server errors (5xx) and specific client errors
  return status >= 500 || status === 408 || status === 429;
};

// Enhance error with user-friendly messages
const enhanceError = (error) => {
  if (!error.response) {
    // Network error
    return {
      ...error,
      userMessage:
        "Network connection failed. Please check your internet connection.",
      type: "NETWORK_ERROR",
      isRetryable: true,
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  let userMessage = "An unexpected error occurred. Please try again.";
  let type = "UNKNOWN_ERROR";

  switch (status) {
    case 400:
      userMessage =
        data?.message || "Invalid request. Please check your input.";
      type = "VALIDATION_ERROR";
      break;
    case 401:
      userMessage = "Your session has expired. Please log in again.";
      type = "AUTH_ERROR";
      break;
    case 403:
      userMessage = "You don't have permission to perform this action.";
      type = "PERMISSION_ERROR";
      break;
    case 404:
      userMessage = "The requested resource was not found.";
      type = "NOT_FOUND_ERROR";
      break;
    case 429:
      userMessage = "Too many requests. Please wait a moment and try again.";
      type = "RATE_LIMIT_ERROR";
      break;
    case 500:
      userMessage = "Server error. Our team has been notified.";
      type = "SERVER_ERROR";
      break;
    case 503:
      userMessage = "Service temporarily unavailable. Please try again later.";
      type = "SERVICE_UNAVAILABLE";
      break;
  }

  return {
    ...error,
    userMessage,
    type,
    isRetryable: isErrorRetryable(error),
  };
};

// Add request interceptor with enhanced logging
api.interceptors.request.use(
  (config) => {
    // Increment request counter
    requestCounter++;
    config.metadata = {
      startTime: Date.now(),
      requestId: requestCounter,
    };

    // Get token from localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request [${config.metadata.requestId}]:`, {
        method: config.method.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;

    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response [${response.config.metadata.requestId}]:`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Calculate request duration if available
    const duration = originalRequest?.metadata
      ? Date.now() - originalRequest.metadata.startTime
      : "unknown";

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error [${originalRequest?.metadata?.requestId || "unknown"}]:`,
        {
          status: error.response?.status,
          duration: typeof duration === "number" ? `${duration}ms` : duration,
          url: originalRequest?.url,
          message: error.message,
        }
      );
    }

    // Enhanced token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          console.log("🔄 Attempting token refresh...");

          const response = await axios.post(
            `${API_BASE_URL}api/token/refresh/`,
            { refresh: refreshToken },
            { timeout: 10000 } // Shorter timeout for refresh
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Update the original request's Authorization header
          originalRequest.headers["Authorization"] = `Bearer ${access}`;

          console.log("✅ Token refreshed successfully");

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Clear all auth data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_profile");

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject({
          ...refreshError,
          userMessage: "Your session has expired. Please log in again.",
          type: "AUTH_EXPIRED",
        });
      }
    }

    return Promise.reject(enhanceError(error));
  }
);

// Network status detection
export const checkNetworkStatus = () => {
  return navigator.onLine;
};

// Test API connection
export const testConnection = async () => {
  try {
    await api.get("/api/health-check/", { timeout: 5000 });
    return { status: "connected" };
  } catch (error) {
    return {
      status: "disconnected",
      error: error.userMessage || error.message,
    };
  }
};

export default api;
