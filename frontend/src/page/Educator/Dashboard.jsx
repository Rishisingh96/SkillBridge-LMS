import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { FaArrowLeftLong } from "react-icons/fa6";

import {
  MdOutlineSchool,
  MdOutlineCurrencyRupee,
  MdOutlineMenuBook,
} from "react-icons/md";

import { motion } from "framer-motion";

import GraphSection from "./GraphSection";

import { setCreatorCourseData } from "../../redux/courseSlice";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);

  const { creatorCourseData } = useSelector(
    (state) => state.course
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // FETCH CREATOR COURSES
  useEffect(() => {
    const fetchCreatorCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/course/getcreator",
          {
            withCredentials: true,
          }
        );

        dispatch(setCreatorCourseData(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCreatorCourses();
  }, [dispatch]);


  // TOTAL COURSES
  const totalCourses = creatorCourseData?.length || 0;


  // TOTAL STUDENTS
  const totalStudents =
    creatorCourseData?.reduce((total, course) => {
      return total + (course.enrolledStudents?.length || 0);
    }, 0) || 0;

  // ============================================
  // TOTAL EARNING
  // ============================================

  const totalEarning =
    creatorCourseData?.reduce((sum, course) => {
      const studentCount =
        course.enrolledStudents?.length || 0;

      const courseRevenue = course.price
        ? course.price * studentCount
        : 0;

      return sum + courseRevenue;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 md:px-8 py-6">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaArrowLeftLong className="text-[18px] text-gray-700" />
          </motion.button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Educator Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your courses, students and revenue
            </p>
          </div>
        </div>

        {/* RIGHT BUTTON */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/courses")}
          className="bg-black text-white px-6 py-3 rounded-2xl font-medium shadow-xl"
        >
          Create Course
        </motion.button>
      </div>

      {/* ========================================= */}
      {/* PROFILE SECTION */}
      {/* ========================================= */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-[32px] shadow-xl border border-gray-200 p-6 md:p-8 relative overflow-hidden"
      >
        {/* GLOW */}

        <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* PROFILE IMAGE */}

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt="Educator"
                className="w-36 h-36 rounded-full object-cover border-4 border-black shadow-2xl"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold shadow-2xl">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </motion.div>

          {/* PROFILE INFO */}

          <div className="flex-1 text-center md:text-left">

            <h1 className="text-4xl font-bold text-gray-800">
              Welcome,{" "}
              <span className="text-black">
                {userData?.name || "Educator"}
              </span>
            </h1>

            <p className="text-gray-500 mt-3 text-[15px]">
              {userData?.email ||
                "Email not available"}
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed max-w-3xl text-[15px]">
              {userData?.bio ||
                "Passionate educator creating modern online learning experiences for students worldwide."}
            </p>

            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/courses")}
                className="bg-black text-white px-6 py-3 rounded-2xl shadow-lg"
              >
                Manage Courses
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border border-gray-300 px-6 py-3 rounded-2xl shadow-sm"
              >
                Edit Profile
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================= */}
      {/* STATS CARDS */}
      {/* ========================================= */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        {/* COURSES */}

        <motion.div
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between">

            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Courses
              </p>

              <h1 className="text-5xl font-bold mt-3 text-gray-800">
                {totalCourses.toLocaleString()}
              </h1>

              <p className="text-sm text-gray-400 mt-3">
                Published Courses
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl">
              <MdOutlineMenuBook className="text-3xl" />
            </div>
          </div>
        </motion.div>

        {/* STUDENTS */}

        <motion.div
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between">

            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Students
              </p>

              <h1 className="text-5xl font-bold mt-3 text-gray-800">
                {totalStudents.toLocaleString()}
              </h1>

              <p className="text-sm text-gray-400 mt-3">
                Active Learners
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-xl">
              <MdOutlineSchool className="text-3xl" />
            </div>
          </div>
        </motion.div>

        {/* EARNING */}

        <motion.div
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between">

            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Earnings
              </p>

              <h1 className="text-5xl font-bold mt-3 text-gray-800">
                ₹{totalEarning.toLocaleString()}
              </h1>

              <p className="text-sm text-gray-400 mt-3">
                Revenue Generated
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-green-600 text-white flex items-center justify-center shadow-xl">
              <MdOutlineCurrencyRupee className="text-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
      <GraphSection />
    </div>
  );
};

export default Dashboard;