import React from "react";

import { motion } from "framer-motion";

const Badge = ({
  text,
  variant = "default",
  size = "md",
  rounded = true,
  icon,
  className = "",
}) => {

  // =========================================
  // VARIANTS
  // =========================================

  const variants = {

    default:
      "bg-gray-100 text-gray-700 border border-gray-200",

    success:
      "bg-green-100 text-green-700 border border-green-200",

    danger:
      "bg-red-100 text-red-700 border border-red-200",

    warning:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",

    info:
      "bg-blue-100 text-blue-700 border border-blue-200",

    purple:
      "bg-purple-100 text-purple-700 border border-purple-200",

    dark:
      "bg-black text-white border border-black",

    published:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",

    draft:
      "bg-orange-100 text-orange-700 border border-orange-200",

    banned:
      "bg-red-100 text-red-700 border border-red-200",

    admin:
      "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none",

    educator:
      "bg-blue-100 text-blue-700 border border-blue-200",

    student:
      "bg-pink-100 text-pink-700 border border-pink-200",
  };

  // =========================================
  // SIZES
  // =========================================

  const sizes = {

    sm: "px-2 py-1 text-xs",

    md: "px-3 py-1.5 text-sm",

    lg: "px-4 py-2 text-[15px]",
  };

  return (

    <motion.div

      initial={{ opacity: 0, scale: 0.9 }}

      animate={{ opacity: 1, scale: 1 }}

      transition={{ duration: 0.2 }}

      className={`
        inline-flex
        items-center
        gap-2
        font-semibold
        shadow-sm
        ${rounded ? "rounded-full" : "rounded-xl"}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >

      {/* ICON */}

      {icon && (

        <span className="flex items-center">

          {icon}

        </span>

      )}

      {/* TEXT */}

      <span>

        {text}

      </span>

    </motion.div>
  );
};

export default Badge;