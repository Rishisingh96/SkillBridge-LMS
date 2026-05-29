import React from "react";
import {
  FaCode,
  FaPalette,
  FaMobileAlt,
  FaHackerrank,
  FaRobot,
  FaChartLine,
  FaDatabase,
  FaTools,
} from "react-icons/fa";

import { motion } from "framer-motion";
import { SiViaplay } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const courses = [
  { id: 1, title: "Web Dev", icon: <FaCode />, color: "from-pink-500 to-rose-400" },
  { id: 2, title: "UI/UX", icon: <FaPalette />, color: "from-green-500 to-emerald-400" },
  { id: 3, title: "App Dev", icon: <FaMobileAlt />, color: "from-purple-500 to-indigo-400" },
  { id: 4, title: "Ethical Hacking", icon: <FaHackerrank />, color: "from-red-500 to-orange-400" },
  { id: 5, title: "AI/ML", icon: <FaRobot />, color: "from-blue-500 to-cyan-400" },
  { id: 6, title: "Data Science", icon: <FaChartLine />, color: "from-yellow-500 to-amber-400" },
  { id: 7, title: "Data Analytics", icon: <FaDatabase />, color: "from-teal-500 to-cyan-400" },
  { id: 8, title: "AI Tools", icon: <FaTools />, color: "from-indigo-500 to-purple-400" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const ExploreCourses = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-all">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

        {/* LEFT SIDE */}
        <div className="lg:w-[35%] w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Explore <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Powerful Courses
            </span>
          </h2>

          <p className="mt-5 text-slate-500 dark:text-slate-400 leading-7">
            Upgrade your skills with industry-ready courses. Learn by building real-world projects, not just theory.
          </p>

          {/* CTA BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/allcourses")}
            className="mt-8 px-6 py-3 rounded-xl font-medium flex items-center gap-3
            bg-gradient-to-r from-black to-gray-800 text-white
            dark:from-white dark:to-gray-200 dark:text-black
            shadow-lg hover:shadow-2xl transition-all"
          >
            View All Courses
            <SiViaplay className="text-xl" />
          </motion.button>
        </div>

        {/* RIGHT SIDE GRID */}
        <div className="lg:w-[65%] w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.08, rotate: 1 }}
              onClick={() => navigate("/allcourses")}
              className="relative group cursor-pointer"
            >

              {/* Glow Ring */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-300 bg-gradient-to-r ${course.color}`} />

              {/* CARD */}
              <div className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
              bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl
              border border-slate-200 dark:border-slate-700
              shadow-md hover:shadow-2xl transition-all">

                {/* ICON */}
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-white text-2xl
                bg-gradient-to-r ${course.color} shadow-lg group-hover:scale-110 transition`}>
                  {course.icon}
                </div>

                {/* TITLE */}
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">
                  {course.title}
                </h3>

                {/* underline animation */}
                <div className="w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ExploreCourses;