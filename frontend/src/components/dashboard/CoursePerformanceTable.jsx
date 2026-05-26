import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CoursePerformanceTable = () => {
  const { stats } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();

  const enrollmentByCourse = stats?.enrollmentByCourse || [];

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="bg-white rounded-[28px] shadow-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Course Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Overview of all your courses</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Course Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Students</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Revenue</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {enrollmentByCourse.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                enrollmentByCourse.map((item, index) => (
                  <motion.tr
                    key={item.courseId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>

                    {/* Course Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold">
                            {item.courseTitle?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-gray-800 text-sm">
                          {item.courseTitle}
                        </span>
                      </div>
                    </td>

                    {/* Students */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.enrollmentCount}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        ₹{((item.price || 0) * item.enrollmentCount).toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.isPublished ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ✅ Live
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                          📝 Draft
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/edit-course/${item.courseId}`)}
                        className="text-sm text-black font-semibold hover:underline"
                      >
                        Manage →
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoursePerformanceTable;