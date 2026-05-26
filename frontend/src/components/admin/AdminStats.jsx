import React from "react";

import {
  Users,
  GraduationCap,
  BookOpen,
  Ban,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2 text-gray-800">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${bgColor}`}
        >
          <div className={textColor}>
            {icon}
          </div>
        </div>

      </div>

    </div>
  );
};

const AdminStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Total Users"
        value={stats.totalUsers || 0}
        icon={<Users size={30} />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />

      <StatCard
        title="Students"
        value={stats.totalStudents || 0}
        icon={<GraduationCap size={30} />}
        bgColor="bg-green-100"
        textColor="text-green-600"
      />

      <StatCard
        title="Courses"
        value={stats.totalCourses || 0}
        icon={<BookOpen size={30} />}
        bgColor="bg-purple-100"
        textColor="text-purple-600"
      />

      <StatCard
        title="Banned Users"
        value={stats.bannedUsers || 0}
        icon={<Ban size={30} />}
        bgColor="bg-red-100"
        textColor="text-red-600"
      />

    </div>
  );
};

export default AdminStats;