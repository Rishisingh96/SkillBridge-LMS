import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineSchool, MdOutlineCurrencyRupee, MdOutlineTrendingUp } from "react-icons/md";

const TopPerformingCourse = () => {
  const { stats } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();

  const enrollmentByCourse = stats?.enrollmentByCourse || [];

  // Sabse zyada students wala course
  const topCourse = enrollmentByCourse.sort(
    (a, b) => b.enrollmentCount - a.enrollmentCount
  )[0];

  if (!topCourse) {
    return (
      <div className="bg-white rounded-[28px] shadow-lg border border-gray-200 p-6 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No course data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[28px] shadow-lg border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Top Performing Course</h2>
        <p className="text-sm text-gray-500 mt-1">Your best course this month</p>
      </div>

      {/* Content */}
      <div className="p-6">

        {/* Course Info */}
        <div className="flex items-center gap-4 mb-6">
          {topCourse.thumbnail ? (
            <img
              src={topCourse.thumbnail}
              className="w-16 h-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl">
              {topCourse.courseTitle?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {topCourse.courseTitle}
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              ✅ Top Course
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <MdOutlineSchool className="text-white text-lg" />
              </div>
              <span className="text-sm text-gray-600">Total Students</span>
            </div>
            <span className="font-bold text-gray-800">
              {topCourse.enrollmentCount}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <MdOutlineCurrencyRupee className="text-white text-lg" />
              </div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <span className="font-bold text-green-600">
              ₹{((topCourse.price || 0) * topCourse.enrollmentCount).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <MdOutlineTrendingUp className="text-white text-lg" />
              </div>
              <span className="text-sm text-gray-600">Status</span>
            </div>
            <span className={`text-sm font-bold ${topCourse.isPublished ? "text-green-600" : "text-gray-500"}`}>
              {topCourse.isPublished ? "✅ Live" : "📝 Draft"}
            </span>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/edit-course/${topCourse.courseId}`)}
          className="w-full mt-6 py-3 bg-black text-white rounded-2xl font-semibold text-sm shadow-lg"
        >
          View Course →
        </motion.button>
      </div>
    </div>
  );
};

export default TopPerformingCourse;