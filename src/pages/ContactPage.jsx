/* eslint-disable no-unused-vars */
// src/pages/ContactPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiMail,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiUser,
  FiHelpCircle,
} from "react-icons/fi";

const contactOptions = [
  {
    id: "support",
    title: "Customer Support",
    description:
      "Get help with technical issues or questions about using Viva Health",
    icon: (
      <FiHelpCircle
        className="text-primary-600 dark:text-primary-400"
        size={24}
      />
    ),
  },
  {
    id: "feedback",
    title: "Feature Feedback",
    description:
      "Share your thoughts and suggestions on how we can improve Viva Health",
    icon: (
      <FiMessageSquare
        className="text-green-600 dark:text-green-400"
        size={24}
      />
    ),
  },
  {
    id: "business",
    title: "Business Inquiries",
    description: "Contact us about partnerships or business opportunities",
    icon: <FiPhone className="text-blue-600 dark:text-blue-400" size={24} />,
  },
  {
    id: "other",
    title: "Other",
    description: "Any other questions or comments",
    icon: <FiMail className="text-purple-600 dark:text-purple-400" size={24} />,
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      'You can reset your password by clicking on the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.',
  },
  {
    question: "Can I use Viva Health on multiple devices?",
    answer:
      "Yes! Your Viva Health account can be accessed from any device. Simply download the app or visit our website and log in with your credentials. Your data will sync across all devices.",
  },
  {
    question: "Is my health data secure?",
    answer:
      "Absolutely. We take data security very seriously. All your health data is encrypted both in transit and at rest. We never share your personal information with third parties without your explicit consent.",
  },
];

const ContactPage = () => {
  const [selectedOption, setSelectedOption] = useState("support");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful submission
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get in{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>
      </header>

      {/* Contact Options and Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Options Sidebar */}
              <div className="md:w-1/3 bg-gray-50 dark:bg-gray-900 p-6">
                <h2 className="text-xl font-bold mb-6">How can we help?</h2>

                <div className="space-y-3">
                  {contactOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-start ${
                        selectedOption === option.id
                          ? "bg-primary-100 dark:bg-primary-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="mr-3 mt-1">{option.icon}</div>
                      <div>
                        <div
                          className={`font-medium ${
                            selectedOption === option.id
                              ? "text-primary-700 dark:text-primary-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {option.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-medium mb-2">
                    You can also reach us at:
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FiMail className="mr-2 text-gray-500" />
                      support@Viva Health.com
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FiPhone className="mr-2 text-gray-500" />
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-start text-gray-700 dark:text-gray-300">
                      <FiMapPin className="mr-2 text-gray-500 mt-1" />
                      <div>
                        123 Health Avenue
                        <br />
                        San Francisco, CA 94158
                        <br />
                        United States
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:w-2/3 p-6 md:p-8">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">
                      {selectedOption === "support" &&
                        "Contact Customer Support"}
                      {selectedOption === "feedback" && "Share Your Feedback"}
                      {selectedOption === "business" && "Business Inquiries"}
                      {selectedOption === "other" && "General Inquiry"}
                    </h2>

                    {submitError && (
                      <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                        Something went wrong. Please try again or contact us
                        directly.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Your Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="text-gray-400" />
                            </div>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="text-gray-400" />
                            </div>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Subject
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                >
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Can't find what you're looking for?
              </p>
              <a
                href="#top"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
