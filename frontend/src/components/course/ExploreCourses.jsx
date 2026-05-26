import React from "react";
import {
  FaArrowCircleRight,
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
  {
    id: 1,
    title: "Web Dev",
    icon: <FaCode className="text-[38px] text-gray-700" />,
    bg: "bg-pink-100",
  },
  {
    id: 2,
    title: "UI/UX Designing",
    icon: <FaPalette className="text-[38px] text-gray-700" />,
    bg: "bg-green-100",
  },
  {
    id: 3,
    title: "App Dev",
    icon: <FaMobileAlt className="text-[38px] text-gray-700" />,
    bg: "bg-pink-200",
  },
  {
    id: 4,
    title: "Ethical Hacking",
    icon: <FaHackerrank className="text-[38px] text-gray-700" />,
    bg: "bg-purple-100",
  },
  {
    id: 5,
    title: "AI/ML",
    icon: <FaRobot className="text-[38px] text-gray-700" />,
    bg: "bg-green-100",
  },
  {
    id: 6,
    title: "Data Science",
    icon: <FaChartLine className="text-[38px] text-gray-700" />,
    bg: "bg-pink-200",
  },
  {
    id: 7,
    title: "Data Analytics",
    icon: <FaDatabase className="text-[38px] text-gray-700" />,
    bg: "bg-purple-100",
  },
  {
    id: 8,
    title: "AI Tools",
    icon: <FaTools className="text-[38px] text-gray-700" />,
    bg: "bg-green-100",
  },
];

const ExploreCourses = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full min-h-screen bg-[#f7f7f7] flex items-center justify-center px-9 py-20 ">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-14">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-[35%]">
          <h3 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
            Explore <br />
            Our Courses
          </h3>

          <p className="text-gray-600 mt-5 leading-8 text-[16px] max-w-[420px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel
            iure explicabo laboriosam accusantium expedita laudantium facere
            magnam.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light flex items-center gap-2 cursor-pointer bg-black hover:bg-gray-900 transition-all"
            onClick={() => navigate("/allcourses")}
          >
            View All Courses
            <SiViaplay className="w-[28px] h-[28px] text-white" />
          </motion.button>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-[60%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col items-center justify-center gap-4"
            >
              {/* ICON BOX */}
              <div
                className={`w-[110px] h-[110px] rounded-2xl ${course.bg} flex items-center justify-center shadow-sm hover:scale-105 duration-300 cursor-pointer`}
                onClick={() => navigate("/allcourses")}
              >
                {course.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-[15px] font-medium text-gray-700 text-center">
                {course.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCourses;
