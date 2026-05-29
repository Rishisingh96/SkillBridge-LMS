import React, { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { categories } from "./categories";

import CourseSidebar from "./CourseSidebar";

import CourseGrid from "./CourseGrid";

const CoursesMegaMenu = ({
  showCourses,
  setShowCourses,
}) => {

  const menuRef = useRef();

  const [selectedCategory, setSelectedCategory] =
    useState(categories[0]);

  // =========================================================
  // CLOSE ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowCourses(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [setShowCourses]);

  // =========================================================
  // RESET CATEGORY
  // =========================================================

  useEffect(() => {

    if (showCourses) {
      setSelectedCategory(categories[0]);
    }

  }, [showCourses]);

  return (
    <AnimatePresence>

      {showCourses && (

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            absolute
            left-1/2
            top-[78px]
            -translate-x-1/2
            z-50
            w-[95%]
            max-w-7xl
          "
        >

          <div
            ref={menuRef}
            className="
              overflow-hidden
              rounded-[32px]
              border
              border-gray-200
              dark:border-slate-700
              bg-white/90
              dark:bg-slate-900/90
              backdrop-blur-2xl
              shadow-[0_20px_80px_rgba(0,0,0,0.18)]
            "
          >

            {/* ========================================================= */}
            {/* TOP HEADER */}
            {/* ========================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-gray-200
                dark:border-slate-700
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Explore Courses
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mt-1
                  "
                >
                  Learn from premium industry-ready
                  programs.
                </p>

              </div>

              {/* CLOSE */}

              <button
                onClick={() =>
                  setShowCourses(false)
                }
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-gray-100
                  dark:bg-slate-800
                  hover:bg-gray-200
                  dark:hover:bg-slate-700
                  transition-all
                  duration-300
                  text-lg
                  text-gray-700
                  dark:text-gray-300
                "
              >
                ✕
              </button>

            </div>

            {/* ========================================================= */}
            {/* BODY */}
            {/* ========================================================= */}

            <div
              className="
                flex
                flex-col
                lg:flex-row
                h-[650px]
              "
            >

              {/* LEFT SIDEBAR */}

              <CourseSidebar
                categories={categories}
                selectedCategory={
                  selectedCategory
                }
                setSelectedCategory={
                  setSelectedCategory
                }
              />

              {/* RIGHT GRID */}

              <CourseGrid
                selectedCategory={
                  selectedCategory
                }
              />

            </div>

          </div>

        </motion.div>
      )}

    </AnimatePresence>
  );
};

export default CoursesMegaMenu;