// src/components/course-player/ProgressCard.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProgressBar from "./ProgressBar";
import { useTheme } from "../../context/ThemeContext";

import { fetchCourseProgress } from "../../redux/slices/progressSlice";

const ProgressCard = ({ courseId }) => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();

  const { userData: user } =
    useSelector((state) => state.user) || {};

  const { courseProgress, loading } = useSelector(
    (state) => state.progress
  );

  const progressData = courseProgress?.[courseId];

  // =========================
  // FETCH PROGRESS
  // =========================
  useEffect(() => {
    if (!courseId) return;

    dispatch(fetchCourseProgress(courseId));
  }, [courseId, dispatch]);

  // =========================
  // CALCULATIONS
  // =========================
  const completed = progressData?.completedLectures || 0;
  const total = progressData?.totalLectures || 0;
  const remaining = total - completed;
  const totalDuration = progressData?.totalDuration || 0;

  const percentage =
    total > 0 ? (completed / total) * 100 : 0;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-300 ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-sm font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Your Progress
        </h3>

        <span
          className={`text-xs font-semibold ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {loading ? "Loading..." : `${Math.round(percentage)}%`}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <ProgressBar value={percentage} />

      {/* STATS */}
      <div className="flex justify-between mt-3">
        <div className="text-center">
          <p
            className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Completed
          </p>
          <p
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {completed}
          </p>
        </div>

        <div className="text-center">
          <p
            className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Remaining
          </p>
          <p
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {remaining}
          </p>
        </div>

        <div className="text-center">
          <p
            className={`text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total
          </p>
          <p
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;