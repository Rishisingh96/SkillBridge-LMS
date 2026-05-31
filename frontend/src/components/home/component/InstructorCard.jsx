import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBookOpen,
  FaStar,
} from "react-icons/fa";

import empty from "../../../assets/Empty.png";

const InstructorCard = React.memo(({
  image,
  name,
  expertise,
  students = 0,
  courses = 0,
  rating = 5,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
      group
      relative
      overflow-hidden
      rounded-[32px]
      bg-white
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      "
    >
      {/* Top Gradient */}

      <div
        className="
        h-28
        bg-gradient-to-r
        from-blue-600
        via-purple-600
        to-pink-600
        "
      />

      {/* Avatar */}

      <div className="relative px-6">

        <img
          src={image || empty}
          alt={name}
          loading="lazy"
          className="
          w-28
          h-28
          rounded-full
          object-cover
          border-4
          border-white
          shadow-xl
          -mt-14
          mx-auto
          "
        />

      </div>

      {/* Content */}

      <div className="p-6 text-center">

        <h3
          className="
          text-2xl
          font-bold
          text-slate-900
          "
        >
          {name}
        </h3>

        <p
          className="
          mt-2
          text-blue-600
          font-medium
          "
        >
          {expertise}
        </p>

        {/* Rating */}

        <div
          className="
          flex
          items-center
          justify-center
          gap-2
          mt-4
          "
        >
          <FaStar className="text-yellow-400" />

          <span className="font-semibold">
            {rating}
          </span>
        </div>

        {/* Stats */}

        <div
          className="
          grid
          grid-cols-2
          gap-4
          mt-6
          "
        >
          <div
            className="
            rounded-2xl
            bg-slate-50
            p-4
            "
          >
            <FaUsers
              className="
              mx-auto
              text-blue-600
              mb-2
              "
            />

            <h4 className="font-bold">
              {students.toLocaleString()}
            </h4>

            <p className="text-sm text-slate-500">
              Students
            </p>
          </div>

          <div
            className="
            rounded-2xl
            bg-slate-50
            p-4
            "
          >
            <FaBookOpen
              className="
              mx-auto
              text-purple-600
              mb-2
              "
            />

            <h4 className="font-bold">
              {courses}
            </h4>

            <p className="text-sm text-slate-500">
              Courses
            </p>
          </div>
        </div>

        {/* Button */}

        <button
          className="
          mt-6
          w-full
          py-3
          rounded-2xl
          bg-slate-900
          text-white
          font-semibold
          hover:bg-blue-600
          transition-all
          "
        >
          View Profile
        </button>

      </div>

      {/* Hover Border */}

      <div
        className="
        absolute
        inset-0
        rounded-[32px]
        border-2
        border-transparent
        group-hover:border-blue-500/20
        transition-all
        duration-500
        pointer-events-none
        "
      />
    </motion.div>
  );
});

export default InstructorCard;