import React, { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const DarkModeButton = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize state based on localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    console.log("🌙 Dark Mode Initialization:");
    console.log("  - Saved theme from localStorage:", savedTheme);
    console.log("  - System prefers dark:", systemPrefersDark);

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      console.log("  → Setting dark mode: ON");
      return true;
    } else {
      document.documentElement.classList.remove("dark");
      console.log("  → Setting dark mode: OFF");
      return false;
    }
  });

  // Toggle theme
  const toggleTheme = () => {
    console.log("🔄 Toggle Theme Clicked - Current state:", isDark ? "DARK" : "LIGHT");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
      console.log("  → Switching to LIGHT mode");
      console.log("  - HTML class 'dark' removed");
      console.log("  - localStorage set to 'light'");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
      console.log("  → Switching to DARK mode");
      console.log("  - HTML class 'dark' added");
      console.log("  - localStorage set to 'dark'");
    }

    console.log("  - Current HTML classes:", document.documentElement.classList.toString());
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="relative w-[62px] h-[32px] flex items-center rounded-full
                 bg-gray-200 dark:bg-slate-700
                 border border-gray-300 dark:border-slate-600
                 transition-all duration-300
                 hover:scale-105 active:scale-95 cursor-pointer z-10"
    >
      {/* Icons */}
      <span className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <HiOutlineSun className="w-4 h-4 text-yellow-500" />
        <HiOutlineMoon className="w-4 h-4 text-slate-300" />
      </span>

      {/* Thumb */}
      <span
        className={`
          absolute top-[3px] w-[26px] h-[26px] rounded-full shadow-md
          flex items-center justify-center transition-all duration-300
          ${isDark ? "translate-x-[30px] bg-slate-900" : "translate-x-0 bg-white"}
        `}
      >
        {isDark ? (
          <HiOutlineMoon className="w-3.5 h-3.5 text-white" />
        ) : (
          <HiOutlineSun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default DarkModeButton;