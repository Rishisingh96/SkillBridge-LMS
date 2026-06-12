import React, { useState } from "react";

import {
  FaPlayCircle,
  FaCheck,
  FaDownload,
} from "react-icons/fa";

import {
  MdOutlineLock,
} from "react-icons/md";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import { toast } from "react-toastify";

const ModuleList = ({
  moduleData,
  selectedLecture,
  onSelectLecture,
  isEnrolled,
  lectureProgress = {},
  progressPercent = 0,
  courseId,
  totalCourseDuration = 0,
}) => {

  const [openModule, setOpenModule] =
    useState(0);

  const [isGenerating, setIsGenerating] = useState(false);

  const { isDark } = useTheme();

  const handleDownloadCertificate = async () => {
    if (!courseId) return;

    setIsGenerating(true);

    try {

      await axios.post(
        `${BASE_URL}/api/course/certificate/generate/${courseId}`,
        {},
        { withCredentials: true }
      );

      const response = await axios.get(
        `${BASE_URL}/api/course/certificate/download/${courseId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "certificate.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Certificate downloaded successfully!"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to download certificate"
      );

    } finally {

      setIsGenerating(false);

    }
  };

  const totalLectures =
    moduleData?.reduce(
      (total, module) =>
        total + (module.lectures?.length || 0),
      0
    ) || 0;

  // Calculate completed lectures from lectureProgress and isLectureCompleted
  const completedLectures = moduleData?.reduce(
    (total, module) =>
      total + (module.lectures?.filter(
        lecture => lecture && lecture._id && (lectureProgress[lecture._id]?.completed || lecture.isLectureCompleted === true)
      ).length || 0),
    0
  ) || 0;

  // Calculate progress percentage locally
  const calculatedProgressPercent = totalLectures > 0
    ? Math.round((completedLectures / totalLectures) * 100)
    : 0;

  // Format seconds to "Xh Ym" or "Xm Ys"
  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Calculate module duration and completion
  const getModuleStats = (module) => {
    const totalDuration = module.lectures?.reduce(
      (total, lecture) => total + (lecture.video?.duration || 0),
      0
    ) || 0;

    const completedCount = module.lectures?.filter(
      lecture => lecture && lecture._id && (lectureProgress[lecture._id]?.completed || lecture.isLectureCompleted === true)
    ).length || 0;

    return {
      duration: formatDuration(totalDuration),
      completed: completedCount,
      total: module.lectures?.length || 0,
    };
  };

  return (

    <div
      className={`
        rounded-[2rem]
        border
        backdrop-blur-2xl
        p-5
        sm:p-6
        ${isDark
          ? "border-white/10 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
          : "border-gray-200/70 bg-white/70 shadow-[0_10px_50px_rgba(0,0,0,0.08)]"
        }
      `}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2
            className={`
              text-2xl
              font-black
              ${isDark
                ? "text-white"
                : "text-gray-900"
              }
            `}
          >
            Course Content
          </h2>
           <p
            className={`
              ${isDark
                ? "text-white"
                : "text-gray-900"
              }
            `}
          >
            Complete the quiz after watching the video to unlock the next lesson.
          </p>

          <p
            className={`
              text-sm
              mt-1
              ${isDark
                ? "text-gray-400"
                : "text-gray-500"
              }
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
                  ${isDark
                    ? "border-white/10 bg-[#0F172A]/80"
                    : "border-gray-200/70 bg-white/80"
                  }
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
                        ${isDark
                          ? "text-white"
                          : "text-gray-900"
                        }
                      `}
                    >
                      Module {moduleIndex + 1}
                    </h3>

                    <p
                      className={`
                        text-sm
                        mt-1
                        ${isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                        }
                      `}
                    >
                      {module.title}
                    </p>

                    <p
                      className={`
                        text-xs
                        mt-2
                        ${isDark
                          ? "text-gray-500"
                          : "text-gray-400"
                        }
                      `}
                    >
                      {getModuleStats(module).duration} | {getModuleStats(module).completed}/{getModuleStats(module).total} lectures
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
                      ${isDark
                        ? "bg-white/10"
                        : "bg-gray-100"
                      }
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

                          // Check if previous lecture is fully completed (both lecture AND quiz)
                          const previousLecture = lectureIndex > 0
                            ? module.lectures[lectureIndex - 1]
                            : null;

                          const isPreviousFullyCompleted = previousLecture
                            ? (previousLecture.isLectureCompleted === true &&
                              (previousLecture.quizQuestions?.length === 0 || previousLecture.isQuizCompleted === true))
                            : true; // First lecture is always unlocked if enrolled

                          const isLocked =
                            (!isEnrolled && !lecture.isPreviewFree) ||
                            (isEnrolled && lectureIndex > 0 && !isPreviousFullyCompleted);

                          const isCompleted =
                            lectureProgress[lecture._id]?.completed || (lecture?.isLectureCompleted === true);

                          const isQuizCompleted = lecture?.isQuizCompleted === true;

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
                                ${isActive
                                  ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white border-transparent shadow-xl"
                                  : `${isDark
                                    ? "bg-white/5 border-white/10 hover:border-violet-500"
                                    : "bg-white border-gray-200 hover:border-violet-400"
                                  }`
                                }
                                ${isLocked
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
                                    ${isActive
                                      ? "bg-white/20"
                                      : `${isDark
                                        ? "bg-white/10"
                                        : "bg-gray-100"
                                      }`
                                    }
                                  `}
                                >

                                  {isCompleted ? (

                                    <FaCheck
                                      className={`
                                        text-xl
                                        ${isActive
                                          ? "text-white"
                                          : "text-green-500"
                                        }
                                      `}
                                    />

                                  ) : isLocked ? (

                                    <MdOutlineLock className="text-xl text-gray-400" />

                                  ) : (

                                    <FaPlayCircle
                                      className={`
                                        text-xl
                                        ${isActive
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
                                      ${isActive
                                        ? "text-white"
                                        : `${isDark
                                          ? "text-white"
                                          : "text-gray-900"
                                        }`
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
                                      ${isActive
                                        ? "text-gray-200"
                                        : `${isDark
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                        }`
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
                                  ${isLocked
                                    ? "bg-gray-200 text-gray-600"
                                    : isCompleted && isQuizCompleted
                                      ? "bg-green-100 text-green-700"
                                      : isCompleted
                                        ? "bg-blue-100 text-blue-700"
                                        : isActive
                                          ? "bg-white text-black"
                                          : "bg-violet-100 text-violet-700"
                                  }
                                `}
                              >

                                {isLocked
                                  ? "Locked"
                                  : isCompleted && isQuizCompleted
                                    ? "Done"
                                    : isCompleted
                                      ? "Video Done"
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


      {/* COURSE PROGRESS */}
      <div
        className={`
          rounded-[2rem]
          border
          backdrop-blur-2xl
          p-5
          mt-6
          ${isDark
            ? "border-white/10 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
            : "border-gray-200/70 bg-white/70 shadow-[0_10px_50px_rgba(0,0,0,0.08)]"
          }
        `}
      >
        <p
          className={`
            text-sm
            mb-2
            ${isDark
              ? "text-gray-400"
              : "text-gray-500"
            }
          `}
        >
          Course Progress
        </p>

        <h2
          className={`
            text-3xl
            font-bold
            ${isDark
              ? "text-white"
              : "text-gray-900"
            }
          `}
        >
          {calculatedProgressPercent}%
        </h2>

        <div
          className={`
            w-full
            rounded-full
            h-2
            mt-3
            ${isDark
              ? "bg-gray-700"
              : "bg-gray-200"
            }
          `}
        >
          <div
            className={`
              h-2
              rounded-full
              transition-all
              duration-300
              bg-gradient-to-r
              from-violet-600
              to-indigo-500
            `}
            style={{ width: `${calculatedProgressPercent}%` }}
          />
        </div>

        <p
          className={`
            text-sm
            mt-3
            ${isDark
              ? "text-gray-400"
              : "text-gray-500"
            }
          `}
        >
          {completedLectures} / {totalLectures} lectures completed
        </p>
      </div>

      {/* CERTIFICATE DOWNLOAD BUTTON - Shows when 70% complete */}
      {calculatedProgressPercent >= 70 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="text-xl">⏳</span>
            ) : (
              <FaDownload className="text-xl" />
            )}
            <span>{isGenerating ? "Generating..." : "Download Certificate"}</span>
          </button>
          <p className={`text-xs text-center mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Congratulations! You've completed {calculatedProgressPercent}% of the course
          </p>
        </motion.div>
      )}

      {/* TOTAL COURSE DURATION */}
      <div
        className={`
          rounded-[2rem]
          border
          backdrop-blur-2xl
          p-5
          mt-6
          ${isDark
            ? "border-white/10 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
            : "border-gray-200/70 bg-white/70 shadow-[0_10px_50px_rgba(0,0,0,0.08)]"
          }
        `}
      >
        <p
          className={`
            text-sm
            mb-2
            ${isDark
              ? "text-gray-400"
              : "text-gray-500"
            }
          `}
        >
          Total Course Duration
        </p>

        <h2
          className={`
            text-3xl
            font-bold
            ${isDark
              ? "text-white"
              : "text-gray-900"
            }
          `}
        >
          {formatDuration(totalCourseDuration)}
        </h2>

        <p
          className={`
            text-sm
            mt-3
            ${isDark
              ? "text-gray-400"
              : "text-gray-500"
            }
          `}
        >
          {completedLectures} / {totalLectures} lectures completed
        </p>
      </div>

    </div>
  );
};

export default ModuleList;