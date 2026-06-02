import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LectureItem from "./LectureItem";
import { useTheme } from "../../context/ThemeContext";
import { formatDuration } from "../../utils/formateDuration";

const ModuleAccordion = ({
  module,
  index,
  openModule,
  setOpenModule,
  selectedLecture,
  onSelectLecture,
  isEnrolled,
  lectureProgress,
}) => {
  const { isDark } = useTheme();

  const isOpen = openModule === index;

  // Calculate completed lectures count
  const completedCount =
    module?.lectures?.filter(
      (lec) => lectureProgress?.[lec._id]?.completed
    ).length || 0;

  // Calculate total module duration
  const totalDuration = module?.lectures?.reduce((acc, lec) => {
    return acc + (lec.video?.duration || 0);
  }, 0) || 0;

  return (
    <div
      className={`rounded-2xl border overflow-hidden mb-3 ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-gray-200"
      }`}
    >
      {/* MODULE HEADER */}
      <button
        onClick={() => setOpenModule(isOpen ? null : index)}
        className="w-full p-4 flex justify-between items-center hover:bg-opacity-50 transition-colors"
      >
        <div className="text-left flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Module {index + 1}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isDark
                  ? "bg-white/10 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {module?.lectures?.length || 0} lectures
            </span>
          </div>

          <p
            className={`text-sm font-medium mt-1 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {module?.title || "Module Title"}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <p
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {completedCount}/{module?.lectures?.length || 0} completed
            </p>
            <span
              className={`text-xs ${
                isDark ? "text-gray-600" : "text-gray-300"
              }`}
            >
              •
            </span>
            <p
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {formatDuration(totalDuration)}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`text-xl ml-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          ▼
        </motion.div>
      </button>

      {/* LECTURES */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            {module?.lectures?.map((lecture) => (
              <LectureItem
                key={lecture._id}
                lecture={lecture}
                selectedLecture={selectedLecture}
                onSelectLecture={onSelectLecture}
                isEnrolled={isEnrolled}
                lectureProgress={lectureProgress}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleAccordion;
