import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProgress } from "../../redux/slices/progressSlice";
import { throttle } from "../../utils/throttle";
import { useTheme } from "../../context/ThemeContext";

const VideoPlayer = ({ lecture, onLectureComplete }) => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { userData: user } = useSelector((state) => state.user) || {};
  const [currentTime, setCurrentTime] = useState(0);

  // Load video when lecture changes
  useEffect(() => {
    if (lecture?.video?.fileUrl && videoRef.current) {
      videoRef.current.src = lecture.video.fileUrl;
      videoRef.current.currentTime = lecture.resumePosition || 0;
    }
  }, [lecture]);

  // Throttled progress update (every 10 seconds)
  const throttledUpdate = throttle(
    (lectureId, position) => {
      dispatch(updateProgress({ lectureId, currentPosition: position }));
    },
    10000
  );

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      throttledUpdate(lecture?._id, time);
    }
  };

  // Handle video end
  const handleEnded = () => {
    if (onLectureComplete) {
      onLectureComplete(lecture);
    }
  };

  // Disable right click and keyboard shortcuts
  const handleContextMenu = (e) => e.preventDefault();
  const handleKeyDown = (e) => {
    if (e.key === "F12" || (e.ctrlKey && (e.key === "s" || e.key === "u"))) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="relative bg-black" onContextMenu={handleContextMenu}>
        {lecture?.video?.fileUrl ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onKeyDown={handleKeyDown}
            className="w-full h-[250px] md:h-[500px] object-contain"
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-black">
            <p className="text-white text-sm">Select a lecture to start watching</p>
          </div>
        )}
      </div>

      {/* Lecture Info */}
      <div className="p-5 md:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            Lecture
          </span>
          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {lecture?.lectureTitle || "No title"}
          </span>
        </div>

        <h1
          className={`text-2xl md:text-3xl font-bold leading-tight ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {lecture?.lectureTitle || "Lecture Title"}
        </h1>

        <p
          className={`leading-7 mt-4 text-[15px] ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {lecture?.description || "No description available for this lecture."}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;