/* eslint-disable no-unused-vars */
// src/pages/TermsPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiFileText,
  FiCheckSquare,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

const TermsPage = () => {
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
              Terms of{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              Last Updated: March 15, 2025
            </p>
            <div className="flex justify-center">
              <FiFileText
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
                  Please read these Terms of Service ("Terms", "Terms of
                  Service") carefully before using the Viva Health application
                  and related services operated by Viva Health Inc. Your access
                  to and use of the Service is conditioned on your acceptance of
                  and compliance with these Terms. These Terms apply to all
                  visitors, users, and others who access or use the Service.
                </p>

                <p>
                  By accessing or using the Service, you agree to be bound by
                  these Terms. If you disagree with any part of the terms, then
                  you may not access the Service.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiInfo className="mr-2 text-primary-600 dark:text-primary-400" />
                  1. Accounts
                </h2>

                <p>
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. Failure to do so constitutes a breach of the Terms,
                  which may result in immediate termination of your account on
                  our Service.
                </p>

                <p>
                  You are responsible for safeguarding the password that you use
                  to access the Service and for any activities or actions under
                  your password, whether your password is with our Service or a
                  third-party service.
                </p>

                <p>
                  You agree not to disclose your password to any third party.
                  You must notify us immediately upon becoming aware of any
                  breach of security or unauthorized use of your account.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiCheckSquare className="mr-2 text-primary-600 dark:text-primary-400" />
                  2. Content and Intellectual Property Rights
                </h2>

                <p>
                  Our Service allows you to enter, upload, submit, store, and
                  share content, including personal health information,
                  nutrition data, exercise records, and other information. You
                  retain any and all rights to the content you submit, and you
                  are responsible for the content you post.
                </p>

                <p>
                  By submitting content to the Service, you grant us a
                  worldwide, non-exclusive, royalty-free license to use,
                  reproduce, modify, adapt, publish, create derivative works
                  from, distribute, and display such content in connection with
                  providing the Service to you and for improving our services.
                </p>

                <p>
                  You represent and warrant that: (i) the content is yours (you
                  own it) or you have the right to use it and grant us the
                  rights and license as provided in these Terms, and (ii) the
                  posting of your content on or through the Service does not
                  violate the privacy rights, publicity rights, copyrights,
                  contract rights, or any other rights of any person.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiAlertTriangle className="mr-2 text-primary-600 dark:text-primary-400" />
                  3. Acceptable Use
                </h2>

                <p>You agree not to use the Service:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    In any way that violates any applicable federal, state,
                    local, or international law or regulation.
                  </li>
                  <li>
                    To impersonate or attempt to impersonate the Company, a
                    Company employee, another user, or any other person or
                    entity.
                  </li>
                  <li>
                    To engage in any other conduct that restricts or inhibits
                    anyone's use or enjoyment of the Service, or which may harm
                    the Company or users of the Service.
                  </li>
                  <li>
                    To upload or transmit viruses, malware, or other types of
                    malicious software, or any content designed to interfere
                    with or disrupt the functionality of the Service.
                  </li>
                  <li>
                    To collect or track the personal information of others or to
                    spam, phish, or otherwise manipulate identifiers to disguise
                    the origin of content.
                  </li>
                </ul>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiInfo className="mr-2 text-primary-600 dark:text-primary-400" />
                  4. Service Modifications and Termination
                </h2>

                <p>
                  We reserve the right to modify, suspend, or discontinue,
                  temporarily or permanently, the Service (or any part thereof)
                  with or without notice. We shall not be liable to you or to
                  any third party for any modification, suspension, or
                  discontinuance of the Service.
                </p>

                <p>
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms. Upon
                  termination, your right to use the Service will immediately
                  cease.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiFileText className="mr-2 text-primary-600 dark:text-primary-400" />
                  5. Disclaimer of Health Advice
                </h2>

                <p>
                  The Viva Health service is designed to help you track your
                  health metrics and provide general health information. It is
                  not intended to provide medical advice, diagnosis, or
                  treatment. Always seek the advice of your physician or other
                  qualified health provider with any questions you may have
                  regarding a medical condition.
                </p>

                <p>
                  The information provided by our Service is for informational
                  and educational purposes only and is not a substitute for
                  professional medical advice, diagnosis, or treatment. Never
                  disregard professional medical advice or delay in seeking it
                  because of something you have read on or accessed through our
                  Service.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiAlertTriangle className="mr-2 text-primary-600 dark:text-primary-400" />
                  6. Limitation of Liability
                </h2>

                <p>
                  In no event shall Viva Health Inc., nor its directors,
                  employees, partners, agents, suppliers, or affiliates, be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, including without limitation, loss of
                  profits, data, use, goodwill, or other intangible losses,
                  resulting from (i) your access to or use of or inability to
                  access or use the Service; (ii) any conduct or content of any
                  third party on the Service; (iii) any content obtained from
                  the Service; and (iv) unauthorized access, use, or alteration
                  of your transmissions or content, whether based on warranty,
                  contract, tort (including negligence), or any other legal
                  theory, whether or not we have been informed of the
                  possibility of such damage.
                </p>

                <h2 className="flex items-center text-xl font-bold mt-8 mb-4">
                  <FiInfo className="mr-2 text-primary-600 dark:text-primary-400" />
                  7. Governing Law
                </h2>

                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of [Your Country/State], without regard to its
                  conflict of law provisions.
                </p>

                <p>
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights. If any
                  provision of these Terms is held to be invalid or
                  unenforceable by a court, the remaining provisions of these
                  Terms will remain in effect.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">
                  8. Changes to Terms
                </h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will try to provide at least 30 days' notice prior to any new
                  terms taking effect. What constitutes a material change will
                  be determined at our sole discretion.
                </p>

                <p>
                  By continuing to access or use our Service after those
                  revisions become effective, you agree to be bound by the
                  revised terms. If you do not agree to the new terms, please
                  stop using the Service.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact
                  us:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>By email: terms@Viva Health.com</li>
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

export default TermsPage;
