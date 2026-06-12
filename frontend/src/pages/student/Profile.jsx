import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaUserGraduate,
} from "react-icons/fa6";

import {
  FiEdit,
  FiUser,
  FiShield,
  FiBookOpen,
} from "react-icons/fi";

import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import Nav from "../../components/navbar/Navbar";

const InfoCard = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gray-800
        p-3
        md:p-5
        transition-all
        hover:border-violet-500
        hover:shadow-md
      "
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div
          className="
            w-10
            h-10
            md:w-12
            md:h-12
            rounded-xl
            bg-gradient-to-br
            from-violet-500
            to-cyan-500
            flex
            items-center
            justify-center
            text-white
            text-base
            md:text-lg
            shadow-md
            flex-shrink-0
          "
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>

          <h3 className="text-sm md:text-base text-gray-900 dark:text-white font-semibold break-words leading-5 md:leading-7">
            {value || "Not Added"}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const Profile = () => {
  const navigate = useNavigate();

  const { userData, loading, error } = useSelector(
    (state) => state.user
  );

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!userData) return;

      setLoadingEnrollments(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/course/user-enrollments`,
          { withCredentials: true }
        );
        setEnrollments(response.data.enrollments || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingEnrollments(false);
      }
    };

    fetchEnrollments();
  }, [userData]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 pt-[90px]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-200 dark:border-gray-700 border-t-violet-500 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 dark:text-gray-400 mt-5 text-lg">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO USER
  // =========================================================

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 pt-[90px]">
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-red-200
            dark:border-red-800
            bg-white
            dark:bg-gray-800
            p-8
            text-center
            shadow-lg
          "
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Not Found
          </h2>

          <p className="text-red-600 dark:text-red-400 mt-3">
            {error || "Something went wrong"}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-cyan-500
              text-white
              font-semibold
              hover:scale-[1.02]
              transition-all
              shadow-md
            "
          >
            Go To Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative pt-[90px]">

      {/* ========================================================= */}
      {/* PAGE */}
      {/* ========================================================= */}

      <div className="relative z-10 px-4 py-6 md:px-6 lg:px-8">

        {/* ========================================================= */}
        {/* TOP BAR */}
        {/* ========================================================= */}

        <div className="max-w-6xl mx-auto mb-4 md:mb-6 flex items-center justify-between gap-3">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="
              w-10
              h-10
              md:w-12
              md:h-12
              rounded-xl
              bg-white
              dark:bg-gray-800
              border
              border-gray-200
              dark:border-gray-700
              flex
              items-center
              justify-center
              hover:bg-gray-50
              dark:hover:bg-gray-700
              transition-all
              shadow-sm
              flex-shrink-0
            "
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300 text-sm md:text-base" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/editprofile")}
            className="
              px-3
              md:px-5
              h-10
              md:h-12
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-cyan-500
              text-white
              font-semibold
              flex
              items-center
              gap-2
              md:gap-3
              shadow-md
              hover:shadow-lg
              transition-all
              text-xs
              md:text-sm
              flex-shrink-0
            "
          >
            <FiEdit className="text-sm md:text-base" />

            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </motion.button>

        </div>

        {/* ========================================================= */}
        {/* MAIN CARD */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            max-w-6xl
            mx-auto
            rounded-2xl
            border
            border-gray-200
            dark:border-gray-700
            bg-white
            dark:bg-gray-800
            overflow-hidden
            shadow-lg
          "
        >

          {/* ========================================================= */}
          {/* COVER */}
          {/* ========================================================= */}

          <div
            className="
              relative
              h-[180px]
              md:h-[240px]
              bg-gradient-to-br
              from-violet-600
              via-indigo-600
              to-cyan-500
            "
          >

            <div className="absolute inset-0 bg-black/10" />

            {/* PROFILE IMAGE */}

            <div className="absolute left-1/2 -bottom-12 md:-bottom-16 -translate-x-1/2">

              {userData?.photoUrl ? (

                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={userData.photoUrl}
                  alt="profile"
                  className="
                    w-28
                    h-28
                    md:w-36
                    md:h-36
                    rounded-2xl
                    object-cover
                    border-4
                    border-white
                    dark:border-gray-800
                    shadow-2xl
                  "
                />

              ) : (

                <div
                  className="
                    w-28
                    h-28
                    md:w-36
                    md:h-36
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-600
                    to-cyan-500
                    border-4
                    border-white
                    dark:border-gray-800
                    flex
                    items-center
                    justify-center
                    text-4xl
                    md:text-5xl
                    font-black
                    text-white
                    shadow-2xl
                  "
                >
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

              )}

            </div>

          </div>

          {/* ========================================================= */}
          {/* CONTENT */}
          {/* ========================================================= */}

          <div className="px-4 md:px-5 lg:px-10 pt-16 md:pt-20 lg:pt-24 pb-6 md:pb-10">

            {/* ========================================================= */}
            {/* USER INFO */}
            {/* ========================================================= */}

            <div className="text-center">

              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                {userData?.name || "User"}
              </h1>

              <div className="flex items-center justify-center gap-2 md:gap-3 mt-3 md:mt-4 flex-wrap">

                <span
                  className="
                    px-3
                    py-1.5
                    md:px-4
                    md:py-2
                    rounded-full
                    bg-violet-100
                    dark:bg-violet-500/20
                    border
                    border-violet-200
                    dark:border-violet-500/30
                    text-violet-700
                    dark:text-violet-300
                    text-xs
                    md:text-sm
                    capitalize
                    font-medium
                  "
                >
                  {userData?.role || "student"}
                </span>

                <span
                  className="
                    px-3
                    py-1.5
                    md:px-4
                    md:py-2
                    rounded-full
                    bg-gray-100
                    dark:bg-gray-700
                    border
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                    text-xs
                    md:text-sm
                  "
                >
                  Joined{" "}
                  {new Date(
                    userData?.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

              {/* BIO */}

              <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 leading-6 md:leading-8 mt-4 md:mt-6 text-[13px] md:text-[15px] lg:text-base">
                {userData?.bio ||
                  "No bio added yet."}
              </p>

            </div>

            {/* ========================================================= */}
            {/* INFO GRID */}
            {/* ========================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-8 md:mt-12">

              <InfoCard
                icon={<FaEnvelope />}
                label="Email Address"
                value={userData?.email}
              />

              <InfoCard
                icon={<FaPhone />}
                label="Phone Number"
                value={userData?.phone}
              />

              <InfoCard
                icon={<FiUser />}
                label="Gender"
                value={userData?.gender}
              />

              <InfoCard
                icon={<FaCalendar />}
                label="Date Of Birth"
                value={
                  userData?.dateOfBirth
                    ? new Date(
                        userData.dateOfBirth
                      ).toLocaleDateString()
                    : "Not Added"
                }
              />

            </div>


            {/* ========================================================= */}
            {/* ROLE SECTION */}
            {/* ========================================================= */}

            <div className="mt-6 md:mt-10">

              {userData?.role === "student" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-xl
                    border
                    border-violet-200
                    dark:border-violet-500/30
                    bg-gradient-to-r
                    from-violet-50
                    to-cyan-50
                    dark:from-violet-500/10
                    dark:to-cyan-500/10
                    p-4
                    md:p-6
                    flex
                    items-center
                    justify-between
                    gap-3
                    md:gap-5
                    flex-wrap
                  "
                >

                  <div className="flex items-center gap-3 md:gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        md:w-14
                        md:h-14
                        rounded-xl
                        bg-gradient-to-br
                        from-violet-500
                        to-cyan-500
                        flex
                        items-center
                        justify-center
                        text-white
                        text-lg
                        md:text-xl
                        shadow-md
                        flex-shrink-0
                      "
                    >
                      <FiBookOpen className="text-lg md:text-xl" />
                    </div>

                    <div>
                      <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                        Enrolled Courses
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1">
                        Your active learning progress
                      </p>
                    </div>

                  </div>

                  <div className="text-2xl md:text-4xl font-black text-violet-600 dark:text-violet-300">
                    {userData?.enrolledCourses
                      ?.length || 0}
                  </div>

                </motion.div>

              )}

              {userData?.role === "educator" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-xl
                    border
                    border-blue-200
                    dark:border-blue-500/30
                    bg-gradient-to-r
                    from-blue-50
                    to-cyan-50
                    dark:from-blue-500/10
                    dark:to-cyan-500/10
                    p-6
                    flex
                    items-center
                    justify-between
                    gap-5
                    flex-wrap
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-14
                        h-14
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-500
                        to-cyan-500
                        flex
                        items-center
                        justify-center
                        text-white
                        text-xl
                        shadow-md
                      "
                    >
                      <FaUserGraduate />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Created Courses
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Courses published by you
                      </p>
                    </div>

                  </div>

                  <div className="text-4xl font-black text-blue-600 dark:text-blue-300">
                    {userData?.createdCourses
                      ?.length || 0}
                  </div>

                </motion.div>

              )}

              {userData?.role === "admin" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-xl
                    border
                    border-red-200
                    dark:border-red-500/30
                    bg-red-50
                    dark:bg-red-500/10
                    p-6
                    flex
                    items-center
                    justify-between
                    gap-5
                    flex-wrap
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-14
                        h-14
                        rounded-xl
                        bg-gradient-to-br
                        from-red-500
                        to-orange-500
                        flex
                        items-center
                        justify-center
                        text-white
                        text-xl
                        shadow-md
                      "
                    >
                      <FiShield />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Admin Access
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Full platform management access
                      </p>
                    </div>

                  </div>

                  <div className="text-red-600 dark:text-red-300 font-bold text-lg">
                    Full Control
                  </div>

                </motion.div>

              )}

            </div>

          </div>

        </motion.div>

      </div>

    </div>
    </>
  );
};

export default Profile;