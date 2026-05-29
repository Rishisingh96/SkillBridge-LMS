import React, { useState } from "react";

import {
  FaPlayCircle,
} from "react-icons/fa";

import {
  MdOutlineLock,
} from "react-icons/md";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useTheme } from "../../context/ThemeContext";

const ModuleList = ({
  moduleData,
  selectedLecture,
  onSelectLecture,
  mode = "watch",
}) => {

  const [openModule, setOpenModule] =
    useState(0);

  const { isDark } = useTheme();

  const totalLectures =
    moduleData?.reduce(
      (total, module) =>
        total +
        module.lectures.length,
      0
    ) || 0;

  return (

    <div
      className={`
        rounded-[2rem]
        border
        backdrop-blur-2xl
        p-5
        sm:p-6
        ${isDark ? 'border-white/10 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.35)]' : 'border-gray-200/70 bg-white/70 shadow-[0_10px_50px_rgba(0,0,0,0.08)]'}
      `}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2
            className={`
              text-2xl
              font-black
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            Course Content
          </h2>

          <p
            className={`
              text-sm
              mt-1
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}
          >
            {totalLectures} Lectures
          </p>

        </div>

        <div
          className="
            px-4
            py-2
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-indigo-500
            text-white
            text-xs
            font-semibold
            shadow-lg
          "
        >
          Premium
        </div>

      </div>

      {/* MODULES */}
      <div className="space-y-4">

        {moduleData?.map(
          (module, moduleIndex) => {

            const isOpen =
              openModule === moduleIndex;

            return (

              <motion.div

                key={module._id}

                layout

                className={`
                  rounded-3xl
                  border
                  backdrop-blur-xl
                  overflow-hidden
                  ${isDark ? 'border-white/10 bg-[#0F172A]/80' : 'border-gray-200/70 bg-white/80'}
                `}
              >

                {/* MODULE HEADER */}
                <button
                  onClick={() =>
                    setOpenModule(
                      isOpen
                        ? null
                        : moduleIndex
                    )
                  }
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-5
                    text-left
                  "
                >

                  <div>

                    <h3
                      className={`
                        text-lg
                        font-bold
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}
                    >
                      Module {moduleIndex + 1}
                    </h3>

                    <p
                      className={`
                        text-sm
                        mt-1
                        ${isDark ? 'text-gray-400' : 'text-gray-500'}
                      `}
                    >
                      {module.title}
                    </p>

                  </div>

                  <motion.div
                    animate={{
                      rotate: isOpen
                        ? 180
                        : 0,
                    }}
                    className={`
                      w-10
                      h-10
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-lg
                      font-bold
                      ${isDark ? 'bg-white/10' : 'bg-gray-100'}
                    `}
                  >
                    +
                  </motion.div>

                </button>

                {/* LECTURES */}
                <AnimatePresence>

                  {isOpen && (

                    <motion.div

                      initial={{
                        opacity: 0,
                        height: 0,
                      }}

                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}

                      exit={{
                        opacity: 0,
                        height: 0,
                      }}

                      className="
                        px-5
                        pb-5
                        space-y-3
                      "
                    >

                      {module.lectures?.map(
                        (
                          lecture,
                          lectureIndex
                        ) => {

                          const isActive =
                            selectedLecture?._id ===
                            lecture?._id;

                          const isLocked =
                            mode ===
                              "preview" &&
                            !lecture.isPreviewFree;

                          return (

                            <motion.button

                              whileHover={{
                                y: -2,
                              }}

                              whileTap={{
                                scale: 0.98,
                              }}

                              key={lecture._id}

                              disabled={isLocked}

                              onClick={() =>
                                !isLocked &&
                                onSelectLecture(
                                  lecture
                                )
                              }

                              className={`
                                w-full
                                flex
                                items-center
                                justify-between
                                gap-4
                                rounded-2xl
                                p-4
                                border
                                transition-all
                                duration-300
                                ${
                                  isActive
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white border-transparent shadow-xl"
                                    : `${isDark ? 'bg-white/5 border-white/10 hover:border-violet-500' : 'bg-white border-gray-200 hover:border-violet-400'}`
                                }
                                ${
                                  isLocked
                                    ? "opacity-60 cursor-not-allowed"
                                    : ""
                                }
                              `}
                            >

                              {/* LEFT */}
                              <div className="flex items-center gap-4 min-w-0">

                                {/* ICON */}
                                <div
                                  className={`
                                    w-12
                                    h-12
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                    ${
                                      isActive
                                        ? "bg-white/20"
                                        : `${isDark ? 'bg-white/10' : 'bg-gray-100'}`
                                    }
                                  `}
                                >

                                  {isLocked ? (

                                    <MdOutlineLock className="text-xl text-gray-400" />

                                  ) : (

                                    <FaPlayCircle
                                      className={`
                                        text-xl
                                        ${
                                          isActive
                                            ? "text-white"
                                            : "text-violet-600"
                                        }
                                      `}
                                    />
                                  )}

                                </div>

                                {/* TEXT */}
                                <div className="min-w-0 text-left">

                                  <h4
                                    className={`
                                      text-sm
                                      sm:text-base
                                      font-semibold
                                      truncate
                                      ${
                                        isActive
                                          ? "text-white"
                                          : `${isDark ? 'text-white' : 'text-gray-900'}`
                                      }
                                    `}
                                  >
                                    {
                                      lecture.lectureTitle
                                    }
                                  </h4>

                                  <p
                                    className={`
                                      text-xs
                                      mt-1
                                      ${
                                        isActive
                                          ? "text-gray-200"
                                          : `${isDark ? 'text-gray-400' : 'text-gray-500'}`
                                      }
                                    `}
                                  >
                                    Lecture{" "}
                                    {lectureIndex + 1}
                                  </p>

                                </div>

                              </div>

                              {/* BADGE */}
                              <div
                                className={`
                                  px-3
                                  py-1.5
                                  rounded-full
                                  text-xs
                                  font-semibold
                                  shrink-0
                                  ${
                                    isLocked
                                      ? "bg-gray-200 text-gray-600"
                                      : isActive
                                      ? "bg-white text-black"
                                      : "bg-green-100 text-green-700"
                                  }
                                `}
                              >

                                {isLocked
                                  ? "Locked"
                                  : "Watch"}

                              </div>

                            </motion.button>
                          );
                        }
                      )}

                    </motion.div>
                  )}

                </AnimatePresence>

              </motion.div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default ModuleList;