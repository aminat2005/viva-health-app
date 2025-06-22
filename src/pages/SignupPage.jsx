/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiTarget,
  FiAtSign,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Account Info
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // This will be sent as password2

    // Personal Info
    age: "",
    gender: "",
    weight: "",
    height: "",
    waistCircumference: "",
    hipCircumference: "", // Added hip circumference

    // Goals and Preferences
    activityLevel: "moderate",
    goal: "weight_loss", // Default value matching backend expectation
    dietaryPreferences: [],

    // NEWLY ADDED Goal Fields
    weight_goal: 60,
    daily_steps_goal: 5000,
    weekly_activity_goal: 4,
    daily_water_goal: 2.5,
    target_daily_calories: 2000,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle dietary preferences (checkboxes)
      setFormData((prev) => {
        if (checked) {
          return {
            ...prev,
            dietaryPreferences: [...prev.dietaryPreferences, value],
          };
        } else {
          return {
            ...prev,
            dietaryPreferences: prev.dietaryPreferences.filter(
              (pref) => pref !== value
            ),
          };
        }
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("All fields are required");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }

      // Check if username is valid (no spaces, special chars limited)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError("Username can only contain letters, numbers, and underscores");
        return false;
      }
    }

    if (step === 2) {
      if (
        !formData.age ||
        !formData.gender ||
        !formData.weight ||
        !formData.height ||
        !formData.waistCircumference ||
        !formData.hipCircumference // Added hip circumference validation
      ) {
        setError("All fields are required");
        return false;
      }

      // Check if age, weight, and height are valid
      if (isNaN(formData.age) || formData.age < 12 || formData.age > 120) {
        setError("Please enter a valid age between 12 and 120");
        return false;
      }

      if (
        isNaN(formData.weight) ||
        formData.weight < 20 ||
        formData.weight > 500
      ) {
        setError("Please enter a valid weight between 20 and 500 kg");
        return false;
      }

      if (
        isNaN(formData.height) ||
        formData.height < 50 ||
        formData.height > 300
      ) {
        setError("Please enter a valid height between 50 and 300 cm");
        return false;
      }

      // Validate waist circumference
      if (
        isNaN(formData.waistCircumference) ||
        formData.waistCircumference < 40 ||
        formData.waistCircumference > 200
      ) {
        setError(
          "Please enter a valid waist circumference between 40 and 200 cm"
        );
        return false;
      }

      // Validate hip circumference
      if (
        isNaN(formData.hipCircumference) ||
        formData.hipCircumference < 40 ||
        formData.hipCircumference > 200
      ) {
        setError(
          "Please enter a valid hip circumference between 40 and 200 cm"
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      // Prepare registration data exactly as the backend expects it
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        age: parseInt(formData.age),
        gender: formData.gender.toLowerCase(),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        waist_circ: parseFloat(formData.waistCircumference),
        hip_circ: parseFloat(formData.hipCircumference),
        activity_level: formData.activityLevel,
        goal: formData.goal,
        pref_diet:
          formData.dietaryPreferences.length > 0
            ? formData.dietaryPreferences.join(",")
            : "",
        weight_goal: parseFloat(formData.weight_goal),
        daily_steps_goal: parseInt(formData.daily_steps_goal),
        weekly_activity_goal: parseInt(formData.weekly_activity_goal),
        daily_water_goal: parseFloat(formData.daily_water_goal),
        target_daily_calories: parseInt(formData.target_daily_calories),
      };

      // Register the user with all data
      await register(registrationData);

      // Navigate to dashboard after successful signup
      navigate("/app");
    } catch (err) {
      console.error("Full signup error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`flex items-center ${
              num < step
                ? "text-primary-600 dark:text-primary-400"
                : num === step
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                num < step
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-2 border-primary-500"
                  : num === step
                  ? "bg-primary-600 text-white border-2 border-primary-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-700"
              }`}
            >
              {num < step ? "✓" : num}
            </div>
            {num < 4 && (
              <div
                className={`w-12 sm:w-16 h-1 ml-1 ${
                  num < step ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <img
                  src="/viva-health-logo.png"
                  alt="VIVA HEALTH"
                  className="h-10 md:h-15 mb-4 ml-5 w-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            </Link>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {step === 1 && "Create your account to start your health journey"}
              {step === 2 && "Tell us about yourself"}
              {step === 3 && "Set your health goals"}
              {step === 4 && "Set your daily target goals"}
            </p>
          </div>

          {renderStepIndicator()}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={step === 4 ? handleSubmit : nextStep}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <FiAtSign className="text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Only letters, numbers, and underscores
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      At least 8 characters with letters and numbers
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Age
                    </label>
                    <div className="relative">
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="12"
                        max="120"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        placeholder="30"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        name="gender"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <input
                          id="weight"
                          name="weight"
                          type="number"
                          min="20"
                          max="500"
                          step="0.1"
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          placeholder="70"
                          value={formData.weight}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="height"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Height (cm)
                      </label>
                      <div className="relative">
                        <input
                          id="height"
                          name="height"
                          type="number"
                          min="50"
                          max="300"
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          placeholder="175"
                          value={formData.height}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="waistCircumference"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Waist (cm)
                      </label>
                      <div className="relative">
                        <input
                          id="waistCircumference"
                          name="waistCircumference"
                          type="number"
                          min="40"
                          max="200"
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          placeholder="80"
                          value={formData.waistCircumference}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="hipCircumference"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Hip (cm)
                      </label>
                      <div className="relative">
                        <input
                          id="hipCircumference"
                          name="hipCircumference"
                          type="number"
                          min="40"
                          max="200"
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                          placeholder="95"
                          value={formData.hipCircumference}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="activityLevel"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Activity Level
                    </label>
                    <select
                      id="activityLevel"
                      name="activityLevel"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      value={formData.activityLevel}
                      onChange={handleChange}
                    >
                      <option value="sedentary">
                        Sedentary (little or no exercise)
                      </option>
                      <option value="light">
                        Light (exercise 1-3 times/week)
                      </option>
                      <option value="moderate">
                        Moderate (exercise 3-5 times/week)
                      </option>
                      <option value="active">
                        Active (exercise 6-7 times/week)
                      </option>
                      <option value="very_active">
                        Very Active (intense exercise 6-7 times/week)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Primary Goal
                    </label>
                    <div className="relative">
                      <select
                        id="goal"
                        name="goal"
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        value={formData.goal}
                        onChange={handleChange}
                      >
                        <option value="weight_loss">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="weight_gain">Gain Weight</option>
                        <option value="build_muscle">Build Muscle</option>
                        <option value="improve_endurance">
                          Improve Endurance
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Dietary Preferences (Optional)
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {[
                        "vegetarian",
                        "vegan",
                        "gluten_free",
                        "dairy_free",
                        "keto",
                        "paleo",
                      ].map((diet) => (
                        <div key={diet} className="flex items-center">
                          <input
                            id={`diet-${diet}`}
                            name="dietaryPreferences"
                            value={diet}
                            type="checkbox"
                            className="h-5 w-5 text-primary-600 border-gray-300 rounded-md focus:ring-primary-500"
                            checked={formData.dietaryPreferences.includes(diet)}
                            onChange={handleChange}
                          />
                          <label
                            htmlFor={`diet-${diet}`}
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300 capitalize"
                          >
                            {diet
                              .replace(/([A-Z])/g, " $1")
                              .replace(/_/g, " ")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="weight_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight_goal"
                      value={formData.weight_goal}
                      onChange={handleChange}
                      min="30"
                      max="300"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="daily_steps_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Daily Steps Goal
                    </label>
                    <input
                      type="number"
                      name="daily_steps_goal"
                      value={formData.daily_steps_goal}
                      onChange={handleChange}
                      min="1000"
                      max="30000"
                      step="100"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="weekly_activity_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Weekly Activity Goal
                    </label>
                    <input
                      type="number"
                      name="weekly_activity_goal"
                      value={formData.weekly_activity_goal}
                      onChange={handleChange}
                      min="1"
                      max="14"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="daily_water_goal"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Daily Water Goal (liters)
                    </label>
                    <input
                      type="number"
                      name="daily_water_goal"
                      value={formData.daily_water_goal}
                      onChange={handleChange}
                      min="0.5"
                      max="6"
                      step="0.1"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="target_daily_calories"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Daily Calorie Target
                    </label>
                    <input
                      type="number"
                      name="target_daily_calories"
                      value={formData.target_daily_calories}
                      onChange={handleChange}
                      min="1200"
                      max="5000"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center py-3 px-5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                >
                  <FiArrowLeft className="mr-2" />
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex items-center justify-center py-3 px-5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                >
                  <FiArrowLeft className="mr-2" />
                  Home
                </Link>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center py-3 px-8 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70 disabled:hover:bg-primary-600"
              >
                {step === 4
                  ? loading
                    ? "Creating Account..."
                    : "Create Account"
                  : "Continue"}
                {step !== 4 && <FiArrowRight className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
