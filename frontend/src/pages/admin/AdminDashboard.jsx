import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchPlatformStats,
  fetchAllUsers,
  fetchCourses,
} from "../../redux/slices/adminSlice";

import {
  Users,
  GraduationCap,
  BookOpen,
  Ban,
  ShieldCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
      <div>
        <h3 className="text-gray-500 text-sm mb-2">
          {title}
        </h3>

        <p className="text-3xl font-bold text-gray-800">
          {value}
        </p>
      </div>

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    stats,
    users,
    courses,
    loading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPlatformStats());
    dispatch(fetchAllUsers());
    dispatch(fetchCourses());
  }, [dispatch]);

  // ============================================
  // RECENT USERS
  // ============================================

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // ============================================
  // CHART DATA
  // ============================================

  const chartData = [
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
      name: "Banned",
      value: stats.bannedUsers || 0,
    },
  ];

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={<Users className="text-white" />}
          color="bg-blue-500"
        />

        <StatCard
          title="Students"
          value={stats.totalStudents || 0}
          icon={<GraduationCap className="text-white" />}
          color="bg-green-500"
        />

        <StatCard
          title="Courses"
          value={stats.totalCourses || 0}
          icon={<BookOpen className="text-white" />}
          color="bg-purple-500"
        />

        <StatCard
          title="Banned Users"
          value={stats.bannedUsers || 0}
          icon={<Ban className="text-white" />}
          color="bg-red-500"
        />

      </div>

      {/* ========================================= */}
      {/* CHART + ADMIN INFO */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* ========================================= */}
        {/* CHART */}
        {/* ========================================= */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Platform Analytics
              </h2>

              <p className="text-gray-500 text-sm">
                Overview of your platform data
              </p>
            </div>

          </div>

          <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={undefined}>
            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]} />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* ========================================= */}
        {/* PLATFORM INFO */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-indigo-100 p-3 rounded-xl">
              <ShieldCheck className="text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Platform Status
              </h2>

              <p className="text-sm text-gray-500">
                System overview
              </p>
            </div>

          </div>

          <div className="space-y-5">

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Published Courses
              </span>

              <span className="font-bold text-green-600">
                {stats.publishedCourses || 0}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Total Educators
              </span>

              <span className="font-bold text-blue-600">
                {stats.totalEducators || 0}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">
                Active Students
              </span>

              <span className="font-bold text-purple-600">
                {stats.totalStudents || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                Banned Accounts
              </span>

              <span className="font-bold text-red-600">
                {stats.bannedUsers || 0}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* RECENT USERS */}
      {/* ========================================= */}

      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Users
          </h2>

          <p className="text-gray-500 text-sm">
            Latest registered users
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-gray-500">

                <th className="pb-4">User</th>

                <th className="pb-4">Email</th>

                <th className="pb-4">Role</th>

                <th className="pb-4">Status</th>

              </tr>

            </thead>

            <tbody>

              {recentUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-all"
                >

                  <td className="py-4 flex items-center gap-3">

                    <img
                      src={user.photoUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <span className="font-medium text-gray-700">
                      {user.name}
                    </span>

                  </td>

                  <td className="text-gray-600">
                    {user.email}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        user.role === "educator"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    {user.isBanned ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Banned
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
    </>
  );
};

export default AdminDashboard;