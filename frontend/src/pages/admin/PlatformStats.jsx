import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchPlatformStats,
  fetchAllUsers,
  fetchCourses,
} from "../../redux/slices/adminSlice";

import AdminStats from "../../components/admin/AdminStats";

import RevenueChart from "../../components/admin/RevenueChart";

import UserTable from "../../components/admin/UserTable";

import {
  Activity,
  ShieldCheck,
  Users,
  BookOpen,
  Ban,
} from "lucide-react";

const PlatformStats = () => {
  const dispatch = useDispatch();

  const {
    stats,
    users,
    courses,
    loading,
  } = useSelector((state) => state.admin);

  // ============================================
  // FETCH DATA
  // ============================================

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
    .slice(0, 6);

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h1 className="mt-5 text-2xl font-bold text-gray-700">
            Loading Platform Stats...
          </h1>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Platform Statistics
          </h1>

          <p className="text-gray-500 mt-2">
            Complete overview of your learning platform
          </p>

        </div>

        <div className="bg-white px-5 py-3 rounded-2xl shadow-md flex items-center gap-3">

          <div className="bg-indigo-100 p-3 rounded-xl">

            <Activity className="text-indigo-600" />

          </div>

          <div>

            <p className="text-sm text-gray-500">
              System Status
            </p>

            <h2 className="font-bold text-green-600">
              Running Smoothly
            </h2>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* ADMIN STATS COMPONENT */}
      {/* ========================================= */}

      <AdminStats stats={stats} />

      {/* ========================================= */}
      {/* EXTRA INFO CARDS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {/* USERS */}

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Total Users
              </p>

              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                {stats.totalUsers || 0}
              </h2>

            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">

              <Users className="text-blue-600" />

            </div>

          </div>

        </div>

        {/* COURSES */}

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Total Courses
              </p>

              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                {stats.totalCourses || 0}
              </h2>

            </div>

            <div className="bg-purple-100 p-4 rounded-2xl">

              <BookOpen className="text-purple-600" />

            </div>

          </div>

        </div>

        {/* PUBLISHED */}

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Published Courses
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {stats.publishedCourses || 0}
              </h2>

            </div>

            <div className="bg-green-100 p-4 rounded-2xl">

              <ShieldCheck className="text-green-600" />

            </div>

          </div>

        </div>

        {/* BANNED */}

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Banned Users
              </p>

              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {stats.bannedUsers || 0}
              </h2>

            </div>

            <div className="bg-red-100 p-4 rounded-2xl">

              <Ban className="text-red-600" />

            </div>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* REVENUE CHART */}
      {/* ========================================= */}

      <div className="mt-8">

        <RevenueChart
          users={users}
          courses={courses}
          stats={stats}
        />

      </div>

      {/* ========================================= */}
      {/* RECENT USERS TABLE */}
      {/* ========================================= */}

      <div className="mt-8">

        <div className="mb-5">

          <h2 className="text-3xl font-bold text-gray-800">
            Recent Users
          </h2>

          <p className="text-gray-500 mt-2">
            Latest joined users on the platform
          </p>

        </div>

        <UserTable
          users={recentUsers}
          hideActions={true}
        />

      </div>

    </div>
  );
};

export default PlatformStats;