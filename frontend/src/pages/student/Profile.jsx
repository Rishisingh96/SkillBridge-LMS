import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

const Profile = () => {

  const navigate = useNavigate();

  // Redux State
  const { userData, loading, error } = useSelector((state) => state.user);

  // ─────────────────────────────────────────
  // Loading State
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-gray-600 text-lg font-semibold">
          Loading Profile...
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // No User Found
  // ─────────────────────────────────────────
  if (!userData) {
    console.log("No userData found, error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-col gap-4">
        <div className="text-gray-600 text-lg font-semibold">
          User Not Found
        </div>
        {error && (
          <div className="text-red-500 text-sm">
            Error: {error}
          </div>
        )}
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center px-4 py-10">

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">

        {/* ───────────────── HEADER ───────────────── */}
        <div className="h-[170px] bg-gradient-to-r from-black via-gray-800 to-gray-700 relative">

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-5 left-5 bg-white p-3 rounded-full shadow-md hover:scale-110 duration-300"
          >
            <FaArrowLeftLong className="text-black text-[20px]" />
          </button>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">

            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-5xl font-bold text-gray-700 shadow-xl">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

          </div>
        </div>

        {/* ───────────────── CONTENT ───────────────── */}
        <div className="pt-24 pb-10 px-6 sm:px-10">

          {/* Name */}
          <div className="text-center">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {userData?.name || "User"}
            </h2>

            <p className="text-gray-500 mt-2 capitalize">
              {userData?.role || "student"}
            </p>

          </div>

          {/* ───────────────── INFO SECTION ───────────────── */}
          <div className="mt-10 space-y-5">

            {/* Email */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Email
              </span>

              <span className="text-gray-600 break-all">
                {userData?.email || "Not Available"}
              </span>
            </div>

            {/* Bio */}
            <div className="bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700 block mb-2">
                Bio
              </span>

              <p className="text-gray-600 leading-relaxed">
                {userData?.bio || "No bio added yet."}
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Phone
              </span>

              <span className="text-gray-600">
                {userData?.phone || "Not Added"}
              </span>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Gender
              </span>

              <span className="text-gray-600 capitalize">
                {userData?.gender || "Not Added"}
              </span>
            </div>

            {/* DOB */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Date of Birth
              </span>

              <span className="text-gray-600">
                {userData?.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString()
                  : "Not Added"}
              </span>
            </div>

            {/* Enrolled Courses */}
            {/* <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Enrolled Courses
              </span>

              <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
                {userData?.enrolledCourses?.length || 0}
              </span>
            </div> */}

   
            {/* ROLE BASED INFO */}
      
            {/* STUDENT */}

            {userData?.role === "student" && (

              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">

                <span className="font-semibold text-gray-700">
                  Enrolled Courses
                </span>

                <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
                  {userData?.enrolledCourses?.length || 0}
                </span>

              </div>

            )}

            {/* EDUCATOR */}

            {userData?.role === "educator" && (

              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">

                <span className="font-semibold text-gray-700">
                  Created Courses
                </span>

                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  {userData?.createdCourses?.length || 0}
                </span>

              </div>

            )}

            {/* ADMIN */}

            {userData?.role === "admin" && (

              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">

                <span className="font-semibold text-gray-700">
                  Platform Access
                </span>

                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm">
                  Full Control
                </span>

              </div>

            )}

            {/* Joined */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
              <span className="font-semibold text-gray-700">
                Joined
              </span>

              <span className="text-gray-600">
                {new Date(userData.createdAt).toLocaleDateString()}
              </span>
            </div>

          </div>

          {/* ───────────────── BUTTONS ───────────────── */}
          <div className="mt-10 flex justify-center">

            <button
              onClick={() => navigate("/editprofile")}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 duration-300 shadow-lg"
            >

              <FiEdit className="text-[18px]" />

              Edit Profile

            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;