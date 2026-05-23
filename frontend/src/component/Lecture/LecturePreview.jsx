import React from "react";
import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";

const LecturePreview = ({ lecture }) => {
  return (
    <div className="bg-white w-full h-full p-5 rounded-[22px] shadow-lg border border-gray-200">

      {/* Video */}
      <div className="w-full h-[420px] rounded-[18px] overflow-hidden bg-black flex items-center justify-center">
        {lecture?.video?.fileUrl ? (
          <video
            key={lecture.video.fileUrl}
            className="w-full h-full object-cover"
            src={lecture.video.fileUrl}
            controls
            autoPlay
            muted
            playsInline
          />
        ) : (
          <span className="text-white text-sm">
            Select a preview lecture to watch
          </span>
        )}
      </div>

      {/* Lecture Info — hamesha dikhao agar lecture select hai */}
      {lecture ? (
        <div className="mt-5">
          <h2 className="text-2xl font-bold text-black">
            {lecture?.lectureTitle}
          </h2>

          <p className="text-gray-600 mt-3 leading-7">
            {lecture?.description || "No description available."}
          </p>

          {/* Resources — hamesha dikhao */}
          <div className="mt-8">
            <LectureResources lecture={lecture} />
          </div>

          {/* Quiz — hamesha dikhao */}
          <div className="mt-8">
            <QuizResult lectureId={lecture?._id} />
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-gray-400 text-sm text-center">
            Select a free lecture to preview
          </p>
        </div>
      )}

    </div>
  );
};

export default LecturePreview;