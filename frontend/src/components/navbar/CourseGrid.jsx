import React from "react";
import { motion } from "framer-motion";

const badgeColors = {
  Popular:
    "bg-violet-500/15 text-violet-600 dark:text-violet-300",

  Bestseller:
    "bg-orange-500/15 text-orange-600 dark:text-orange-300",

  Trending:
    "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",

  New:
    "bg-green-500/15 text-green-600 dark:text-green-300",

  Hot:
    "bg-red-500/15 text-red-600 dark:text-red-300",
};

const CourseGrid = ({ selectedCategory }) => {
  return (
    <div
      className="
        flex-1
        bg-gray-50
        dark:bg-slate-950
        p-5
        overflow-y-auto
      "
    >

      {/* HEADER */}

      <div className="mb-6">

        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          {selectedCategory?.title}
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            mt-1
          "
        >
          Explore premium courses and
          master new skills.
        </p>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-4
        "
      >

        {selectedCategory?.courses?.map(
          (course, index) => (

            <motion.div
              key={index}
              whileHover={{
                y: -5,
                scale: 1.01,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-gray-200
                dark:border-slate-700
                bg-white/80
                dark:bg-slate-900/80
                backdrop-blur-xl
                p-5
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                cursor-pointer
                group
              "
            >

              {/* GLOW EFFECT */}

              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  bg-gradient-to-br
                  from-violet-500/5
                  via-cyan-500/5
                  to-transparent
                  pointer-events-none
                "
              />

              {/* BADGE */}

              {course.badge && (

                <span
                  className={`
                    absolute
                    top-4
                    right-4
                    px-3
                    py-1
                    rounded-full
                    text-[11px]
                    font-semibold
                    backdrop-blur-md
                    border
                    border-white/10
                    ${
                      badgeColors[
                        course.badge
                      ]
                    }
                  `}
                >
                  {course.badge}
                </span>

              )}

              {/* CONTENT */}

              <div className="relative z-10">

                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                    leading-snug
                    pr-16
                  "
                >
                  {course.title}
                </h3>

                <p
                  className="
                    mt-4
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Duration: {course.duration}
                </p>

                {/* BUTTON */}

                <button
                  className="
                    mt-5
                    w-full
                    h-11
                    rounded-2xl
                    bg-gray-900
                    dark:bg-white
                    dark:text-black
                    text-white
                    font-semibold
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all
                    duration-300
                  "
                >
                  Explore Course
                </button>

              </div>

            </motion.div>
          )
        )}

      </div>

    </div>
  );
};

export default CourseGrid;