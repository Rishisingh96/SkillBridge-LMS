import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ stats }) => {

  const data = [
    {
      name: "Students",
      value: stats.totalStudents || 0,
    },
    {
      name: "Educators",
      value: stats.totalEducators || 0,
    },
    {
      name: "Courses",
      value: stats.totalCourses || 0,
    },
    {
      name: "Published",
      value: stats.publishedCourses || 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Platform Analytics
        </h2>

        <p className="text-gray-500 mt-1">
          Overview of your platform growth
        </p>

      </div>

      <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={undefined}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;