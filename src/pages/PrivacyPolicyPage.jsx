/* eslint-disable no-unused-vars */
// src/pages/PrivacyPolicyPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiLock,
  FiDatabase,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

const PrivacyPolicyPage = () => {
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
              Privacy{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              Last Updated: March 15, 2025
            </p>
            <div className="flex justify-center">
              <FiLock
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
                  At Viva Health, we take your privacy seriously. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our health tracking application
                  and related services. Please read this privacy policy
                  carefully. If you do not agree with the terms of this privacy
                  policy, please do not access the application.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiDatabase className="mr-2 text-primary-600 dark:text-primary-400" />
                  Information We Collect
                </h2>

                <h3 className="font-bold mt-6 mb-2">Personal Data</h3>
                <p>
                  We may collect personally identifiable information, such as
                  your:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Date of birth</li>
                  <li>Gender</li>
                  <li>Height and weight</li>
                  <li>Phone number (optional)</li>
                  <li>Profile picture (optional)</li>
                </ul>

                <h3 className="font-bold mt-6 mb-2">Health and Fitness Data</h3>
                <p>
                  With your consent, we collect health and fitness information
                  such as:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Nutritional information (food intake, calories,
                    macronutrients)
                  </li>
                  <li>Activity data (steps, exercise, calories burned)</li>
                  <li>Water intake</li>
                  <li>Sleep patterns (if provided)</li>
                  <li>Weight changes over time</li>
                  <li>Fitness goals and preferences</li>
                </ul>

                <h3 className="font-bold mt-6 mb-2">Usage Data</h3>
                <p>
                  We may also collect information about how the application is
                  accessed and used. This usage data may include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Your device's Internet Protocol address (e.g., IP address)
                  </li>
                  <li>Browser type and version</li>
                  <li>Types of devices you use to access the app</li>
                  <li>Time and date of your visits</li>
                  <li>Features you use within the app</li>
                  <li>Other diagnostic data</li>
                </ul>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiShield className="mr-2 text-primary-600 dark:text-primary-400" />
                  How We Use Your Information
                </h2>

                <p>
                  We use the information we collect for various purposes,
                  including to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>
                    Personalize your experience with relevant health insights
                    and recommendations
                  </li>
                  <li>Process and track your progress toward health goals</li>
                  <li>
                    Communicate with you about account notifications, updates,
                    and promotional materials
                  </li>
                  <li>
                    Monitor the usage of our application for technical
                    administration
                  </li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>
                    Conduct research and analysis to improve health tracking
                    technology
                  </li>
                </ul>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiLock className="mr-2 text-primary-600 dark:text-primary-400" />
                  Data Security
                </h2>

                <p>
                  The security of your data is important to us. We use
                  commercially acceptable means to protect your personal
                  information, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Encryption of sensitive information both in transit and at
                    rest
                  </li>
                  <li>Regular security assessments of our systems</li>
                  <li>
                    Access controls to limit who can view your data within our
                    organization
                  </li>
                  <li>Regular security updates and patches for our systems</li>
                  <li>
                    Employee training on security and privacy best practices
                  </li>
                </ul>
                <p>
                  However, please be aware that no method of transmission over
                  the internet or method of electronic storage is 100% secure.
                  While we strive to use commercially acceptable means to
                  protect your personal information, we cannot guarantee its
                  absolute security.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiDatabase className="mr-2 text-primary-600 dark:text-primary-400" />
                  Data Sharing and Disclosure
                </h2>

                <p>
                  We may disclose your information in the following situations:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Service Providers:</strong> We may share your
                    information with third-party vendors, service providers, and
                    other third parties who perform services on our behalf.
                  </li>
                  <li>
                    <strong>Analytics:</strong> We may use third-party service
                    providers to monitor and analyze the use of our Service.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> If we are involved in a
                    merger, acquisition, or sale of all or a portion of our
                    assets, your information may be transferred as part of that
                    transaction.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may disclose your
                    personal information for any other purpose with your
                    consent.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your
                    information where required to do so by law or in response to
                    valid requests by public authorities.
                  </li>
                </ul>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiAlertCircle className="mr-2 text-primary-600 dark:text-primary-400" />
                  Your Data Rights
                </h2>

                <p>
                  You have certain rights regarding your personal data,
                  including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Access:</strong> You have the right to access the
                    personal information we hold about you.
                  </li>
                  <li>
                    <strong>Correction:</strong> You have the right to request
                    that we correct inaccurate or incomplete information about
                    you.
                  </li>
                  <li>
                    <strong>Deletion:</strong> You have the right to request
                    that we delete your personal information under certain
                    conditions.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> You have the right to
                    receive a copy of your data in a structured,
                    machine-readable format.
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> You can withdraw your
                    consent at any time where we relied on your consent to
                    process your information.
                  </li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  Children's Privacy
                </h2>
                <p>
                  Our service is not directed to anyone under the age of 13. We
                  do not knowingly collect personally identifiable information
                  from children under 13. If you are a parent or guardian and
                  you are aware that your child has provided us with personal
                  data, please contact us. If we become aware that we have
                  collected personal data from children without verification of
                  parental consent, we take steps to remove that information
                  from our servers.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date. You are
                  advised to review this Privacy Policy periodically for any
                  changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us:
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
