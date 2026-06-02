// src/components/course-player/ProgressBar.jsx

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ProgressBar = ({ value = 0, height = 8, showLabel = true }) => {
  const { isDark } = useTheme();

  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      {/* LABEL */}
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span
            className={`text-xs font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Progress
          </span>

          <span
            className={`text-xs font-semibold ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {safeValue.toFixed(0)}%
          </span>
        </div>
      )}

      {/* BAR BACKGROUND */}
      <div
        className={`w-full rounded-full overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        }`}
        style={{ height }}
      >
        {/* FILL */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-violet-600 to-indigo-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;