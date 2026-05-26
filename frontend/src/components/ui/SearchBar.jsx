import React from "react";

import { Search, X } from "lucide-react";

import { motion } from "framer-motion";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) => {

  return (

    <motion.div

      initial={{ opacity: 0, y: 10 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.3 }}

      className={`
        relative
        w-full
        ${className}
      `}
    >

      {/* SEARCH ICON */}

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

        <Search size={20} />

      </div>

      {/* INPUT */}

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          h-[55px]
          pl-12
          pr-12
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-sm
          outline-none
          text-gray-700
          placeholder:text-gray-400
          focus:border-black
          focus:ring-4
          focus:ring-black/5
          transition-all duration-300
        "
      />

      {/* CLEAR BUTTON */}

      {value && (

        <button
          onClick={onClear}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-black
            transition
          "
        >

          <X size={18} />

        </button>

      )}

    </motion.div>
  );
};

export default SearchBar;