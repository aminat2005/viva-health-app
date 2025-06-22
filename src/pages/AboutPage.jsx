/* eslint-disable no-unused-vars */
// src/pages/AboutPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiTarget, FiUsers, FiAward } from "react-icons/fi";

const teamMembers = [
  {
    id: 1,
    name: "Dr Chris Omokanye",
    role: "Co-Founder & CEO",
    bio: "Lorem ipsum dolor facilisis volutpat. Praesent luctus pellentesque turpis eu placerat.sollicitudin ligula. Donec euismod urna sed.",
    image: "/team/sarah.jpg", // Replace with actual image path
  },
  {
    id: 2,
    name: "Dr Ridwan Oladipo",
    role: "AI/ML Engineer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius erat nisi, vitae dapibus nibh congue sed.",
    image: "/team/david.jpg", // Replace with actual image path
  },
  {
    id: 3,
    name: "Ahmad Suleiman",
    role: "Backend Developer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius erat nisi, vitae dapibus nibh congue sed.",
    image: "/team/maria.jpg", // Replace with actual image path
  },
  {
    id: 4,
    name: "Aminah Ibrahim",
    role: "Frontend/ Mobile app Developer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius erat nisi, vitae dapibus nibh congue sed.",
    image: "/team/james.jpg", // Replace with actual image path
  },
];

const AboutPage = () => {
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
              About{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Viva Health
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              We're on a mission to help people take control of their health and
              wellness through innovative tracking tools and personalized
              insights.
            </p>
          </div>
        </div>
      </header>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2 mb-8 md:mb-0 md:pr-12"
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Viva Health was founded in 2025 by Dr Chris Omokanye, who shared
                a vision of making health tracking more accessible, intuitive,
                and actionable for everyone.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                After struggling with their own health journeys and finding
                existing solutions too complicated or not comprehensive enough,
                they decided to build a platform that would provide a holistic
                view of one's health while remaining simple to use.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, Viva Health serves hundreds of thousands of users
                worldwide, helping them make informed decisions about their
                nutrition, physical activity, and overall wellness. Our team has
                grown to include experts in nutrition, fitness, and technology,
                all united by the mission to empower people to live healthier
                lives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <img
                  src="/about/our-story.jpg"
                  alt="Viva Health founding team"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" preserveAspectRatio="none"%3E%3Crect fill="%23CCCCCC" width="600" height="400" /%3E%3Ctext fill="%23666666" font-family="sans-serif" font-size="24" dy=".3em" text-anchor="middle" x="300" y="200"%3EOur Team%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-primary-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                To empower people to take control of their health through
                accessible tracking tools, personalized insights, and a
                supportive community.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                  <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FiTarget className="text-primary-600 dark:text-primary-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Simplify Health Tracking
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Make it easy for people to track nutrition, activity, and
                    wellness metrics in one intuitive platform.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                  <div className="bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FiAward className="text-secondary-600 dark:text-secondary-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Personalized Insights
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Deliver actionable recommendations tailored to each person's
                    unique health profile and goals.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Build Community</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Create a supportive environment where users can share
                    experiences, challenges, and victories.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Our Leadership Team</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Meet the passionate people behind Viva Health who are dedicated to
              improving the way you track and understand your health.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" preserveAspectRatio="none"%3E%3Crect fill="%23CCCCCC" width="300" height="300" /%3E%3Ctext fill="%23666666" font-family="sans-serif" font-size="18" dy=".3em" text-anchor="middle" x="150" y="150"%3E${member.name}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/careers"
              className="inline-flex items-center justify-center py-3 px-6 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
