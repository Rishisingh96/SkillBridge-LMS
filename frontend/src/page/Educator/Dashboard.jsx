import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  MdOutlineSchool,
  MdOutlineCurrencyRupee,
  MdOutlineMenuBook,
} from "react-icons/md";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 md:px-8 py-6">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaArrowLeftLong className="text-[18px] text-gray-700" />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Educator Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your courses and earnings
            </p>
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={() => navigate("/courses")}
          className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md"
        >
          Create Course
        </button>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8">
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Profile Image */}
          <div className="relative">
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt="Educator"
                className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold shadow-md">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"}
            </h1>

            <p className="text-gray-500 mt-2 text-[15px]">
              {userData?.email || "Email not available"}
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">
              {userData?.bio ||
                "Passionate educator creating modern online learning experiences for students worldwide."}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
              
              <button
                onClick={() => navigate("/courses")}
                className="bg-black text-white px-5 py-3 rounded-xl hover:scale-105 transition"
              >
                Manage Courses
              </button>

              <button className="border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* Total Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>

              <h1 className="text-3xl font-bold mt-2 text-gray-800">
                0
              </h1>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <MdOutlineMenuBook className="text-3xl text-black" />
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>

              <h1 className="text-3xl font-bold mt-2 text-gray-800">
                0
              </h1>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <MdOutlineSchool className="text-3xl text-black" />
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>

              <h1 className="text-3xl font-bold mt-2 text-gray-800">
                ₹0
              </h1>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <MdOutlineCurrencyRupee className="text-3xl text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activity
          </h2>

          <div className="space-y-4">
            
            <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-700">
                No recent activity
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your latest educator activity will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Performance Overview
          </h2>

          <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400">
              Analytics Graph Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;