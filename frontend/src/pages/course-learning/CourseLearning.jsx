import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";

import { fetchModules } from "../../redux/slices/moduleSlice";
import { fetchCourseProgress } from "../../redux/slices/progressSlice";
import { fetchCourseById } from "../../redux/slices/courseSlice";

import CourseSidebar from "../../components/progress/CourseSidebar";
import VideoPlayer from "../../components/progress/VideoPlayer";
import CertificateCard from "../../components/progress/certificate/CertificateCard";
import ProgressCard from "../../components/progress/component/ProgressCard";

const CourseLearning = () => {
  const { courseId } = useParams();
  const { isDark } = useTheme();
  const dispatch = useDispatch();

  const { userData: user } = useSelector((state) => state.user) || {};
  const { moduleData, loading: modulesLoading } = useSelector((state) => state.module);
  const { selectedCourse, loading: courseLoading } = useSelector((state) => state.course);
  const { courseProgress, loading: progressLoading } = useSelector((state) => state.progress);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(true);

  const progressData = courseProgress?.[courseId];
  const completed = progressData?.completedLectures || 0;
  const total = progressData?.totalLectures || 0;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  // =========================
  // FETCH COURSE DATA
  // =========================
  useEffect(() => {
    if (!courseId) return;

    dispatch(fetchCourseById(courseId));
    dispatch(fetchModules(courseId));
    dispatch(fetchCourseProgress(courseId));
  }, [courseId, dispatch]);

  // =========================
  // SELECT FIRST LECTURE ON LOAD
  // =========================
  useEffect(() => {
    if (moduleData?.length > 0 && !selectedLecture) {
      const firstModule = moduleData[0];
      if (firstModule?.lectures?.length > 0) {
        setSelectedLecture(firstModule.lectures[0]);
      }
    }
  }, [moduleData, selectedLecture]);

  // =========================
  // HANDLE LECTURE SELECTION
  // =========================
  const handleSelectLecture = (lecture) => {
    setSelectedLecture(lecture);
  };

  // =========================
  // HANDLE LECTURE COMPLETE
  // =========================
  const handleLectureComplete = (lecture) => {
    // Move to next lecture if available
    const allLectures = moduleData?.flatMap((module) => module.lectures) || [];
    const currentIndex = allLectures.findIndex((lec) => lec._id === lecture._id);
    
    if (currentIndex < allLectures.length - 1) {
      setSelectedLecture(allLectures[currentIndex + 1]);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (modulesLoading || courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!moduleData?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            No Course Content
          </h2>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            This course doesn't have any modules yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {selectedCourse?.title || "Course Learning"}
          </h1>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {selectedCourse?.description || "Learn at your own pace"}
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIDEBAR */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <CourseSidebar
              course={{ modules: moduleData, _id: courseId }}
              selectedLecture={selectedLecture}
              onSelectLecture={handleSelectLecture}
              isEnrolled={isEnrolled}
              lectureProgress={progressData?.lectureProgress || {}}
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* VIDEO PLAYER */}
            <VideoPlayer
              lecture={selectedLecture}
              onLectureComplete={handleLectureComplete}
            />

            {/* PROGRESS CARD */}
            <ProgressCard courseId={courseId} />

            {/* CERTIFICATE SECTION */}
            <CertificateCard
              courseId={courseId}
              progressPercent={progressPercent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
