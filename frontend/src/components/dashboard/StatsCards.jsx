import React from 'react'
import { motion } from 'framer-motion'
import {
  MdOutlineSchool,
  MdOutlineCurrencyRupee,
  MdOutlineMenuBook,
  MdOutlineTrendingUp,
  MdOutlinePeople,
  MdOutlineDownload,
} from 'react-icons/md'

const StatsCards = ({ stats = {} }) => {
  const {
    totalCourses = 0,
    totalStudents = 0,
    totalEarnings = 0,
    averageProgress = 0,
    recentEnrollments = 0,
    totalDownloads = 0,
  } = stats

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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
              ₹{totalEarnings.toLocaleString()}
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

      {/* COURSE PROGRESS */}
      <motion.div
        whileHover={{
          y: -5,
          scale: 1.02,
        }}
        className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Avg. Course Progress
            </p>

            <h1 className="text-5xl font-bold mt-3 text-gray-800">
              {averageProgress}%
            </h1>

            <p className="text-sm text-gray-400 mt-3">
              Completion Rate
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-purple-600 text-white flex items-center justify-center shadow-xl">
            <MdOutlineTrendingUp className="text-3xl" />
          </div>
        </div>
      </motion.div>

      {/* RECENT ENROLLMENTS */}
      <motion.div
        whileHover={{
          y: -5,
          scale: 1.02,
        }}
        className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Recent Enrollments
            </p>

            <h1 className="text-5xl font-bold mt-3 text-gray-800">
              {recentEnrollments}
            </h1>

            <p className="text-sm text-gray-400 mt-3">
              Last 30 Days
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-orange-600 text-white flex items-center justify-center shadow-xl">
            <MdOutlinePeople className="text-3xl" />
          </div>
        </div>
      </motion.div>

      {/* TOTAL DOWNLOADS */}
      <motion.div
        whileHover={{
          y: -5,
          scale: 1.02,
        }}
        className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Total Downloads
            </p>

            <h1 className="text-5xl font-bold mt-3 text-gray-800">
              {totalDownloads.toLocaleString()}
            </h1>

            <p className="text-sm text-gray-400 mt-3">
              Resource Downloads
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl">
            <MdOutlineDownload className="text-3xl" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default StatsCards
