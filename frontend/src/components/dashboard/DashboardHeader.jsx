import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from 'react-icons/fa6'

const DashboardHeader = ({ title, subtitle, buttonText, buttonAction }) => {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
        >
          <FaArrowLeftLong className="text-[18px] text-gray-700" />
        </motion.button>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT BUTTON */}
      {buttonText && buttonAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={buttonAction}
          className="bg-black text-white px-6 py-3 rounded-2xl font-medium shadow-xl"
        >
          {buttonText}
        </motion.button>
      )}
    </div>
  )
}

export default DashboardHeader
