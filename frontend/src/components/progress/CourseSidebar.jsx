// src/components/course-player/CourseSidebar.jsx

import React, { useState } from "react";
import ModuleAccordion from "./ModuleAccordion";
import ResumeLearningButton from "./ResumeLearningButton";
import ProgressCard from "./component/ProgressCard";
import { useTheme } from "../../context/ThemeContext";

const CourseSidebar = ({
  course,
  selectedLecture,
  onSelectLecture,
  isEnrolled,
  lectureProgress,
}) => {
  const { isDark } = useTheme();
  const [openModule, setOpenModule] = useState(0);

  return (
    <div
      className={`h-full w-full flex flex-col rounded-2xl border overflow-hidden ${
        isDark
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="p-5 border-b">
        <h2
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Course Content
        </h2>

        <p
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {course?.modules?.length || 0} Modules
        </p>
      </div>

      {/* PROGRESS CARD */}
      <div className="p-5">
        <ProgressCard courseId={course?._id} />
      </div>

      {/* RESUME BUTTON */}
      <div className="px-5 pb-4">
        <ResumeLearningButton
          courseId={course?._id}
          onSelectLecture={onSelectLecture}
        />
      </div>

      {/* MODULE LIST */}
      <div className="flex-1 overflow-y-auto px-3 pb-5">
        {course?.modules?.map((module, index) => (
          <ModuleAccordion
            key={module._id}
            module={module}
            index={index}
            openModule={openModule}
            setOpenModule={setOpenModule}
            selectedLecture={selectedLecture}
            onSelectLecture={onSelectLecture}
            isEnrolled={isEnrolled}
            lectureProgress={lectureProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;