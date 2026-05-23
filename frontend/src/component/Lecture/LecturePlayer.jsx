// src/component/Lecture/LecturePlayer.jsx
import React from "react";
import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";

/**
 * Props:
 *  - lecture : selected lecture object
 */

const LecturePlayer = ({ lecture }) => {
  return (
    <div className="bg-white rounded-[24px] shadow-lg border border-gray-200 overflow-hidden">
      {/* Video */}
      <div className="w-full bg-black">
        {lecture?.video?.fileUrl ? (
          <video
            key={lecture.video.fileUrl}
            src={lecture.video.fileUrl}
            controls
            className="w-full h-[250px] md:h-[500px] object-cover"
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-white text-sm">
              Select a lecture to start watching
            </p>
          </div>
        )}
      </div>

      {/* Lecture info */}
      <div className="p-5 md:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            Lecture
          </span>
          <span className="text-sm text-gray-500">{lecture?.lectureTitle}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {lecture?.lectureTitle || "Lecture Title"}
        </h1>

        <p className="text-gray-600 leading-7 mt-4 text-[15px]">
          {lecture?.description || "No description available for this lecture."}
        </p>
      </div>

      {/* Resources + Quiz */}
      <LectureResources lecture={lecture} />
      <QuizResult lectureId={lecture} />
    </div>
  );
};

export default LecturePlayer;