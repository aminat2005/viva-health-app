// src/App.jsx
import React, { useState, useEffect, useContext, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeContext } from "./contexts/ThemeContext";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ConnectionStatus from "./components/ConnectionStatus";
// Public Pages (keep these normal - critical for initial load)
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotfoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Layout (keep normal - needed for app structure)
import MainLayout from "./components/layout/MainLayout";

// ✅ Lazy load heavy/less critical components
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NutritionPage = React.lazy(() => import("./pages/NutritionPage"));
const ActivityPage = React.lazy(() => import("./pages/ActivityPage"));
const ProgressPage = React.lazy(() => import("./pages/ProgressPage"));
const CommunityPage = React.lazy(() => import("./pages/CommunityPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

// Company Pages (can be lazy loaded)
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const CareersPage = React.lazy(() => import("./pages/CareersPage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));

// Legal Pages (can be lazy loaded)
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const CookiePolicyPage = React.lazy(() => import("./pages/CookiePolicyPage"));

// ✅ Loading Component
const PageLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-white font-bold text-xl">VH</span>
        </div>
        <div className="animate-spin w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

// Auth Guard component
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login and save the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ErrorBoundary>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* ✅ Public routes - load immediately */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                {/* ✅ Company Pages - lazy loaded with Suspense */}
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <AboutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/careers"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CareersPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <BlogPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <ContactPage />
                    </Suspense>
                  }
                />

                {/* ✅ Legal Pages - lazy loaded with Suspense */}
                <Route
                  path="/privacy"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <PrivacyPolicyPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <TermsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/cookies"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CookiePolicyPage />
                    </Suspense>
                  }
                />

                {/* ✅ Protected routes with MainLayout - lazy loaded with Suspense */}
                <Route
                  path="/app"
                  element={
                    <PrivateRoute>
                      <MainLayout />
                    </PrivateRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="nutrition"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <NutritionPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="activity"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <ActivityPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="progress"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <ProgressPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="community"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <CommunityPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <SettingsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <ProfilePage />
                      </Suspense>
                    }
                  />
                </Route>

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
