import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ProfileCard from '../../components/dashboard/ProfileCard'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import Nav from '../../components/navbar/Navbar'

const Profile = () => {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <>
      <Nav />
      <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen pt-[90px]`}>
      <ProfileCard userData={userData} />

      {/* Create Course Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/educator/create-course')}
        className="
          mt-6
          w-full
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-indigo-500
          text-white
          font-semibold
          shadow-xl
          shadow-violet-500/20
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <FiPlus className="text-xl" />
        Create New Course
      </motion.button>
    </div>
    </>
  )
}

export default Profile
