import React, { useEffect, useRef } from "react";

import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";
import Comment from "../../pages/student/Comment";

const LecturePreview = ({ lecture }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!lecture?.video?.fileUrl) return;

    const video = videoRef.current;

    // Direct MP4 playback
    video.src = lecture.video.fileUrl;

  }, [lecture]);

  return (
    <div className="bg-white w-full h-full p-5 rounded-[22px] shadow-lg border border-gray-200">

      {/* VIDEO */}
      <div className="w-full h-[420px] rounded-[18px] overflow-hidden bg-black flex items-center justify-center">

        {lecture?.video?.fileUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            playsInline
          />
        ) : (
          <span className="text-white text-sm">
            Select a preview lecture to watch
          </span>
        )}

      </div>

      {/* INFO */}
      {lecture ? (
        <div className="mt-5">

          <h2 className="text-2xl font-bold text-black">
            {lecture?.lectureTitle}
          </h2>

          <p className="text-gray-600 mt-3 leading-7">
            {lecture?.description || "No description available."}
          </p>

          {/* RESOURCES */}
          <div className="mt-8">
            <LectureResources lecture={lecture} />
          </div>

          {/* QUIZ */}
          <div className="mt-8">
            <QuizResult lectureId={lecture?._id} />
          </div>

          {/* COMMENTS */}
          <div className="mt-8">
            <Comment lectureId={lecture?._id} />
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