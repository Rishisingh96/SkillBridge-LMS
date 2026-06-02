// src/components/course-player/ResumeLearningButton.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResumeLecture } from "../../redux/slices/progressSlice";
import { useTheme } from "../../context/ThemeContext";

const ResumeLearningButton = ({
  courseId,
  onSelectLecture,
}) => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();

  const { userData: user } =
    useSelector((state) => state.user) || {};

  const { resumeLecture, loading } = useSelector(
    (state) => state.progress
  );

  useEffect(() => {
    if (!courseId) return;

    dispatch(fetchResumeLecture(courseId));
  }, [courseId, dispatch]);

  if (!resumeLecture) return null;

  return (
    <button
      onClick={() => onSelectLecture(resumeLecture)}
      disabled={loading}
      className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {loading ? "Loading..." : "▶ Resume Learning"}
    </button>
  );
};

export default ResumeLearningButton;