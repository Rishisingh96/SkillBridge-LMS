import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ProfileCard = ({ userData }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-4xl shadow-xl border border-gray-200 p-6 md:p-8 relative overflow-hidden"
    >
      {/* GLOW */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* PROFILE IMAGE */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          {userData?.photoUrl ? (
            <img
              src={userData?.photoUrl}
              alt="Educator"
              className="w-36 h-36 rounded-full object-cover border-4 border-black shadow-2xl"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold shadow-2xl">
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}
        </motion.div>

        {/* PROFILE INFO */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-black">
              {userData?.name || "Educator"}
            </span>
          </h1>

          <p className="text-gray-500 mt-3 text-[15px]">
            {userData?.email || "Email not available"}
          </p>

          <p className="text-gray-600 mt-5 leading-relaxed max-w-3xl text-[15px]">
            {userData?.bio ||
              "Passionate educator creating modern online learning experiences for students worldwide."}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/courses")}
              className="bg-black text-white px-6 py-3 rounded-2xl shadow-lg"
            >
              Manage Courses
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-gray-300 px-6 py-3 rounded-2xl shadow-sm"
            >
              Edit Profile
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileCard
