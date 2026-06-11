import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CategoryCard = React.memo(({
  title,
  icon,
  courses = 0,
  color = "from-blue-500 to-cyan-500",
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
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-slate-200
      bg-white
      p-6
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      cursor-pointer
      "
    >
      {/* Gradient Background */}

      <div
        className={`
        absolute
        inset-0
        opacity-0
        group-hover:opacity-100
        transition-all
        duration-500
        bg-gradient-to-br
        ${color}
        `}
      />

      {/* Content */}

      <div className="relative z-10">

        {/* Icon */}

        <div
          className="
          w-16
          h-16
          rounded-2xl
          bg-slate-100
          flex
          items-center
          justify-center
          text-3xl
          group-hover:bg-white/20
          group-hover:text-white
          transition-all
          duration-500
          "
        >
          {icon}
        </div>

        {/* Title */}

        <h3
          className="
          mt-6
          text-2xl
          font-bold
          text-slate-900
          group-hover:text-white
          transition-all
          duration-500
          "
        >
          {title}
        </h3>

        {/* Courses */}

        <p
          className="
          mt-2
          text-slate-500
          group-hover:text-white/80
          transition-all
          duration-500
          "
        >
          {courses}+ Courses Available
        </p>

        {/* Arrow */}

        <div
          className="
          mt-6
          flex
          items-center
          gap-2
          text-slate-700
          group-hover:text-white
          transition-all
          duration-500
          "
        >
          <span className="font-medium">
            Explore Category
          </span>

          <ArrowRight
            size={18}
            className="
            group-hover:translate-x-2
            transition-all
            duration-300
            "
          />
        </div>

      </div>

      {/* Glow */}

      <div
        className="
        absolute
        -bottom-10
        -right-10
        w-32
        h-32
        rounded-full
        bg-white/10
        blur-2xl
        opacity-0
        group-hover:opacity-100
        transition-all
        duration-500
        "
      />
    </motion.div>
  );
});

CategoryCard.displayName = "CategoryCard";
export default CategoryCard;