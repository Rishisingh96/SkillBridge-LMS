import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  Users,
  Video,
} from "lucide-react";

import empty from "../../../assets/Empty.png";

const LiveClassCard = React.memo(({
  thumbnail,
  title,
  instructor,
  date,
  time,
  students,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
      group
      overflow-hidden
      rounded-[30px]
      bg-white
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      "
    >
      {/* Thumbnail */}

      <div className="relative overflow-hidden">

        <img
          src={thumbnail || empty}
          alt={title}
          loading="lazy"
          className="
          w-full
          h-[230px]
          object-cover
          transition-all
          duration-700
          group-hover:scale-110
          "
        />

        <div
          className="
          absolute
          top-4
          left-4
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-red-500
          text-white
          text-sm
          font-semibold
          "
        >
          <Video size={16} />
          Live
        </div>

      </div>

      {/* Content */}

      <div className="p-6">

        <h3
          className="
          text-2xl
          font-bold
          text-slate-900
          line-clamp-2
          "
        >
          {title}
        </h3>

        <p
          className="
          mt-2
          text-slate-500
          "
        >
          By {instructor}
        </p>

        {/* Info */}

        <div className="space-y-3 mt-6">

          <div className="flex items-center gap-3 text-slate-600">
            <Calendar size={18} />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Clock3 size={18} />
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Users size={18} />
            <span>{students} Students Joined</span>
          </div>

        </div>

        {/* Button */}

        <button
          className="
          mt-6
          w-full
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          font-semibold
          hover:opacity-90
          transition-all
          "
        >
          Join Live Class
        </button>

      </div>
    </motion.div>
  );
});

export default LiveClassCard;