import React from "react";
import { useSelector } from "react-redux";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";



import { motion } from "framer-motion";

const GraphSection = ({ enrollmentByCourse, creatorCourseData }) => {
  const { creatorCourseData: reduxCourseData } = useSelector((state) => state.course);

  // Use props if available, otherwise fallback to Redux
  const courseData = creatorCourseData || reduxCourseData;

  // Course Lecture Data
  const CourseProgressData =
    courseData?.map((course) => ({
      name:
        course.title?.length > 12
          ? course.title.slice(0, 12) + "..."
          : course.title,

      lectures: course.modules?.reduce((total, module) => total + (module.lectures?.length || 0), 0) || 0,
    })) || [];

  // Enrollment Data - Use enrollmentByCourse from API if available
  const EnrollData =
    enrollmentByCourse?.map((item) => ({
      name:
        item.courseTitle?.length > 12
          ? item.courseTitle.slice(0, 12) + "..."
          : item.courseTitle,

      enrolled: item.enrollmentCount || 0,
    })) ||
    courseData?.map((course) => ({
      name:
        course.title?.length > 12
          ? course.title.slice(0, 12) + "..."
          : course.title,

      enrolled: course.enrolledStudents?.length || 0,
    })) || [];

  const COLORS = [
    "#111111",
    "#4F46E5",
    "#9333EA",
    "#0EA5E9",
    "#F59E0B",
    "#10B981",
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-semibold">{label}</p>

          <p className="text-sm mt-1">
            {payload[0].dataKey}: {payload[0].value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

      {/* Course Progress */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[30px] p-7 shadow-lg hover:shadow-2xl transition duration-500"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gray-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Course Progress
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Lectures available in every course
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl shadow-lg">
              📚
            </div>
          </div>

          {CourseProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={CourseProgressData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="lectures"
                  radius={[12, 12, 0, 0]}
                  animationDuration={2000}
                >
                  {CourseProgressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[322px] flex items-center justify-center text-gray-400">
              No Course Data Available
            </div>
          )}
        </div>
      </motion.div>

      {/* Student Enrollment */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[30px] p-7 shadow-lg hover:shadow-2xl transition duration-500"
      >
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Student Enrollment
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Students enrolled in each course
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg">
              👨‍🎓
            </div>
          </div>

          {EnrollData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={EnrollData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="enrolled"
                  radius={[12, 12, 0, 0]}
                  animationDuration={2500}
                >
                  {EnrollData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[(index + 2) % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              No Enrollment Data Available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GraphSection;