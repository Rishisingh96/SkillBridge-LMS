import React from "react";

import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  className = "",
}) => {

  // =========================================
  // VARIANTS
  // =========================================

  const variants = {

    primary:
      "bg-black text-white hover:bg-gray-900 shadow-lg",

    secondary:
      "bg-gray-200 text-black hover:bg-gray-300",

    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg",

    success:
      "bg-green-500 text-white hover:bg-green-600 shadow-lg",

    outline:
      "border border-gray-300 bg-white hover:bg-gray-100 text-black",

    purple:
      "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:opacity-90",
  };

  // =========================================
  // SIZES
  // =========================================

  const sizes = {

    sm: "h-[40px] px-4 text-sm",

    md: "h-[48px] px-6 text-[15px]",

    lg: "h-[56px] px-8 text-lg",
  };

  return (

    <motion.button

      whileHover={{ scale: 1.02 }}

      whileTap={{ scale: 0.96 }}

      disabled={disabled || loading}

      type={type}

      onClick={onClick}

      className={`
        rounded-2xl
        font-semibold
        transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >

      {/* LOADING */}

      {loading ? (

        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

      ) : (

        <>
          {icon && icon}

          {children}
        </>

      )}

    </motion.button>
  );
};

export default Button;