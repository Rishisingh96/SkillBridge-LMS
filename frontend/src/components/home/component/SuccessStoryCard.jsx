import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const SuccessStoryCard = ({
  image,
  name,
  role,
  company,
  packageAmount,
  story,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="
      group
      bg-white
      rounded-[30px]
      overflow-hidden
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      "
    >
      <div className="relative">

        <img
          src={image}
          alt={name}
          loading="lazy"
          className="
          w-full
          h-[280px]
          object-cover
          "
        />

        <div
          className="
          absolute
          top-4
          right-4
          bg-green-500
          text-white
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          "
        >
          Hired
        </div>

      </div>

      <div className="p-6">

        <h3 className="text-2xl font-bold">
          {name}
        </h3>

        <p className="text-slate-500 mt-1">
          {role}
        </p>

        <div
          className="
          mt-5
          flex
          items-center
          justify-between
          "
        >
          <div>
            <p className="text-slate-500 text-sm">
              Company
            </p>

            <h4 className="font-semibold">
              {company}
            </h4>
          </div>

          <div className="text-right">
            <p className="text-slate-500 text-sm">
              Package
            </p>

            <h4 className="font-bold text-green-600">
              {packageAmount}
            </h4>
          </div>
        </div>

        <p
          className="
          mt-5
          text-slate-600
          line-clamp-3
          "
        >
          {story}
        </p>

        <button
          className="
          mt-6
          w-full
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          text-white
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          "
        >
          <TrendingUp size={18} />
          View Journey
        </button>

      </div>
    </motion.div>
  );
};

export default SuccessStoryCard;