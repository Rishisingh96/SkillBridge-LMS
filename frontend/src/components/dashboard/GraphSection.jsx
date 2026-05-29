import React, { useMemo } from "react";
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

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const GlassCard = ({ children, glow, delay = 0 }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_60px_rgba(0,0,0,0.4)]"
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 opacity-30 blur-3xl ${glow}`}
      ></div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.03]"></div>

      <div className="relative z-10 p-5 sm:p-7 lg:p-8">{children}</div>
    </motion.div>
  );
};

const Header = ({ title, subtitle, icon, iconBg }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.08, rotate: 4 }}
        whileTap={{ scale: 0.95 }}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} text-white shadow-xl`}
      >
        <span className="text-2xl">{icon}</span>
      </motion.div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-sm font-semibold text-white">{label}</p>

        <div className="mt-2 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-400"></div>

          <p className="text-sm text-gray-200">
            {payload[0].dataKey}:{" "}
            <span className="font-bold text-white">
              {payload[0].value}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const EmptyState = ({ text }) => {
  return (
    <div className="flex h-[340px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10">
        📊
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        No Data Found
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {text}
      </p>
    </div>
  );
};

const GraphSection = ({ enrollmentByCourse, creatorCourseData }) => {
  const { creatorCourseData: reduxCourseData } = useSelector(
    (state) => state.course
  );

  const courseData = creatorCourseData || reduxCourseData;

  const CourseProgressData = useMemo(() => {
    return (
      courseData?.map((course) => ({
        name:
          course.title?.length > 14
            ? course.title.slice(0, 14) + "..."
            : course.title,

        lectures:
          course.modules?.reduce(
            (total, module) =>
              total + (module.lectures?.length || 0),
            0
          ) || 0,
      })) || []
    );
  }, [courseData]);

  const EnrollData = useMemo(() => {
    return (
      enrollmentByCourse?.map((item) => ({
        name:
          item.courseTitle?.length > 14
            ? item.courseTitle.slice(0, 14) + "..."
            : item.courseTitle,

        enrolled: item.enrollmentCount || 0,
      })) ||
      courseData?.map((course) => ({
        name:
          course.title?.length > 14
            ? course.title.slice(0, 14) + "..."
            : course.title,

        enrolled: course.enrolledStudents?.length || 0,
      })) ||
      []
    );
  }, [enrollmentByCourse, courseData]);

  return (
    <section className="relative w-full py-6">
      {/* Background Blur */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Course Progress */}
        <GlassCard
          glow="bg-indigo-500/20"
          delay={0.1}
        >
          <Header
            title="Course Progress"
            subtitle="Lectures available inside each course"
            icon="📚"
            iconBg="bg-gradient-to-br from-indigo-500 to-violet-600"
          />

          {CourseProgressData.length > 0 ? (
            <motion.div
              variants={chartVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="h-[340px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CourseProgressData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB20"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="lectures"
                    radius={[14, 14, 0, 0]}
                    animationDuration={2000}
                  >
                    {CourseProgressData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <EmptyState text="No course progress data available." />
          )}
        </GlassCard>

        {/* Enrollment */}
        <GlassCard
          glow="bg-cyan-500/20"
          delay={0.2}
        >
          <Header
            title="Student Enrollment"
            subtitle="Track how many students joined your courses"
            icon="👨‍🎓"
            iconBg="bg-gradient-to-br from-cyan-500 to-blue-600"
          />

          {EnrollData.length > 0 ? (
            <motion.div
              variants={chartVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="h-[340px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={EnrollData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB20"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="enrolled"
                    radius={[14, 14, 0, 0]}
                    animationDuration={2500}
                  >
                    {EnrollData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[(index + 2) % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <EmptyState text="No enrollment analytics available." />
          )}
        </GlassCard>
      </div>
    </section>
  );
};

export default GraphSection;