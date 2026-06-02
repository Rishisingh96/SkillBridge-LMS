import React from "react";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatDuration } from "../../utils/formateDuration";

const LectureItem = ({
  lecture,
  selectedLecture,
  onSelectLecture,
  isEnrolled,
  lectureProgress,
}) => {
  const { isDark } = useTheme();

  const isSelected = selectedLecture?._id === lecture._id;
  const isCompleted = lectureProgress?.[lecture._id]?.completed;
  const isCurrent = lectureProgress?.[lecture._id]?.watched && !isCompleted;
  const isLocked = !isEnrolled;

  const getStatusIcon = () => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (isSelected) {
      return <PlayCircle className="w-4 h-4 text-blue-500" />;
    }
    return <PlayCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <button
      onClick={() => !isLocked && onSelectLecture(lecture)}
      disabled={isLocked}
      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? isDark
            ? "bg-blue-600/20 border border-blue-500/30"
            : "bg-blue-50 border border-blue-200"
          : isDark
          ? "hover:bg-white/5"
          : "hover:bg-gray-50"
      } ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">{getStatusIcon()}</div>

        {/* Lecture Info */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isSelected
                ? isDark
                  ? "text-blue-400"
                  : "text-blue-600"
                : isDark
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            {lecture.lectureTitle}
          </p>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {lecture.video?.duration
              ? formatDuration(lecture.video.duration)
              : "No duration"}
          </p>
        </div>

        {/* Completed Badge */}
        {isCompleted && (
          <span className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Done
          </span>
        )}
      </div>
    </button>
  );
};

export default LectureItem;