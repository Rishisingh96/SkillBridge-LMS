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
import { serverUrl } from "../../App";
import Nav from "../../components/navbar/Navbar";

const InfoCard = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        p-5
        transition-all
        hover:border-violet-500/30
        hover:bg-white/[0.06]
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-br
            from-violet-600/20
            to-cyan-500/20
            flex
            items-center
            justify-center
            text-violet-300
            text-lg
            border
            border-white/10
          "
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-1">
            {label}
          </p>

          <h3 className="text-white font-semibold break-words leading-7">
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
          `${serverUrl}/api/course/user-enrollments`,
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
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin mx-auto" />

          <p className="text-gray-400 mt-5 text-lg">
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
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/10
            backdrop-blur-xl
            p-8
            text-center
          "
        >
          <h2 className="text-3xl font-black text-white">
            User Not Found
          </h2>

          <p className="text-red-300 mt-3">
            {error || "Something went wrong"}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="
              mt-6
              px-6
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-cyan-500
              text-white
              font-semibold
              hover:scale-[1.02]
              transition-all
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
      <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden pt-[90px]">

      {/* ========================================================= */}
      {/* BACKGROUND GLOW */}
      {/* ========================================================= */}

      <div className="fixed top-[-120px] right-[-100px] w-[320px] h-[320px] bg-violet-600/20 blur-[120px]" />

      <div className="fixed bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-cyan-500/20 blur-[120px]" />

      {/* ========================================================= */}
      {/* PAGE */}
      {/* ========================================================= */}

      <div className="relative z-10 px-4 py-6 md:px-6 lg:px-8">

        {/* ========================================================= */}
        {/* TOP BAR */}
        {/* ========================================================= */}

        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="
              w-12
              h-12
              rounded-2xl
              bg-white/[0.05]
              border
              border-white/10
              backdrop-blur-xl
              flex
              items-center
              justify-center
              hover:bg-white/[0.08]
              transition-all
            "
          >
            <FaArrowLeft />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/editprofile")}
            className="
              px-5
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-cyan-500
              text-white
              font-semibold
              flex
              items-center
              gap-3
              shadow-xl
              shadow-violet-500/20
            "
          >
            <FiEdit />

            Edit Profile
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
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.05]
            backdrop-blur-2xl
            overflow-hidden
            shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          "
        >

          {/* ========================================================= */}
          {/* COVER */}
          {/* ========================================================= */}

          <div
            className="
              relative
              h-[240px]
              bg-gradient-to-br
              from-violet-700
              via-[#1E1B4B]
              to-cyan-600
            "
          >

            <div className="absolute inset-0 bg-black/20" />

            {/* PROFILE IMAGE */}

            <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">

              {userData?.photoUrl ? (

                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={userData.photoUrl}
                  alt="profile"
                  className="
                    w-36
                    h-36
                    rounded-[32px]
                    object-cover
                    border-4
                    border-[#0B1120]
                    shadow-2xl
                  "
                />

              ) : (

                <div
                  className="
                    w-36
                    h-36
                    rounded-[32px]
                    bg-gradient-to-br
                    from-violet-600
                    to-cyan-500
                    border-4
                    border-[#0B1120]
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-black
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

          <div className="px-5 md:px-10 pt-24 pb-10">

            {/* ========================================================= */}
            {/* USER INFO */}
            {/* ========================================================= */}

            <div className="text-center">

              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {userData?.name || "User"}
              </h1>

              <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-violet-500/15
                    border
                    border-violet-500/20
                    text-violet-300
                    text-sm
                    capitalize
                    font-medium
                  "
                >
                  {userData?.role || "student"}
                </span>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-white/5
                    border
                    border-white/10
                    text-gray-300
                    text-sm
                  "
                >
                  Joined{" "}
                  {new Date(
                    userData?.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

              {/* BIO */}

              <p className="max-w-3xl mx-auto text-gray-400 leading-8 mt-6 text-[15px] md:text-base">
                {userData?.bio ||
                  "No bio added yet."}
              </p>

            </div>

            {/* ========================================================= */}
            {/* INFO GRID */}
            {/* ========================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">

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
            {/* ENROLLED COURSES LIST */}
            {/* ========================================================= */}

            {userData?.role === "student" && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">
                  My Enrolled Courses
                </h2>

                {loadingEnrollments ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 mt-4">Loading courses...</p>
                  </div>
                ) : enrollments.length === 0 ? (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      backdrop-blur-2xl
                      p-10
                      text-center
                    "
                  >
                    <FiBookOpen className="text-4xl text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No enrolled courses yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {enrollments.map((enrollment) => (
                      <motion.div
                        key={enrollment._id}
                        whileHover={{ y: -4 }}
                        onClick={() =>
                          navigate(`/course/${enrollment.course._id}`)
                        }
                        className="
                          rounded-3xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          backdrop-blur-2xl
                          overflow-hidden
                          cursor-pointer
                          hover:border-violet-500/30
                          transition-all
                        "
                      >
                        <img
                          src={enrollment.course.thumbnail}
                          alt=""
                          className="w-full h-40 object-cover"
                        />

                        <div className="p-5">
                          <h3 className="font-bold text-white line-clamp-2">
                            {enrollment.course.title}
                          </h3>

                          <p className="text-sm text-gray-400 mt-2">
                            {enrollment.course.creator?.name}
                          </p>

                          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Enrolled:
                              </span>
                              <span className="text-white">
                                {new Date(
                                  enrollment.startDate
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Valid Till:
                              </span>
                              <span className="text-white">
                                {new Date(
                                  enrollment.endDate
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Status:
                              </span>
                              <span
                                className={`font-medium ${
                                  enrollment.status === "active"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {enrollment.status === "active"
                                  ? `${enrollment.daysRemaining} days left`
                                  : "Expired"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ROLE SECTION */}
            {/* ========================================================= */}

            <div className="mt-10">

              {userData?.role === "student" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-gradient-to-r
                    from-violet-500/10
                    to-cyan-500/10
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
                        rounded-2xl
                        bg-violet-500/20
                        flex
                        items-center
                        justify-center
                        text-violet-300
                        text-xl
                      "
                    >
                      <FiBookOpen />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        Enrolled Courses
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        Your active learning progress
                      </p>
                    </div>

                  </div>

                  <div className="text-4xl font-black text-violet-300">
                    {userData?.enrolledCourses
                      ?.length || 0}
                  </div>

                </motion.div>

              )}

              {userData?.role === "educator" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-gradient-to-r
                    from-blue-500/10
                    to-cyan-500/10
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
                        rounded-2xl
                        bg-blue-500/20
                        flex
                        items-center
                        justify-center
                        text-blue-300
                        text-xl
                      "
                    >
                      <FaUserGraduate />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        Created Courses
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        Courses published by you
                      </p>
                    </div>

                  </div>

                  <div className="text-4xl font-black text-blue-300">
                    {userData?.createdCourses
                      ?.length || 0}
                  </div>

                </motion.div>

              )}

              {userData?.role === "admin" && (

                <motion.div
                  whileHover={{ y: -3 }}
                  className="
                    rounded-3xl
                    border
                    border-red-500/20
                    bg-red-500/10
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
                        rounded-2xl
                        bg-red-500/20
                        flex
                        items-center
                        justify-center
                        text-red-300
                        text-xl
                      "
                    >
                      <FiShield />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        Admin Access
                      </h3>

                      <p className="text-gray-300 text-sm mt-1">
                        Full platform management access
                      </p>
                    </div>

                  </div>

                  <div className="text-red-300 font-bold text-lg">
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