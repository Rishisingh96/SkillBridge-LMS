// src/component/Lecture/LecturePlayer.jsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";
import Comment from "../../pages/student/Comment";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import { updateLectureProgress, updateWatchTime } from "../../services/progressService";


const LecturePlayer = ({
  lecture,
}) => {

  const videoRef = useRef(null);
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("about");
  const { userData: user } = useSelector((state) => state.user) || {};

  useEffect(() => {

    if (
      !lecture?.video?.fileUrl
    ) return;

    const video =
      videoRef.current;

    // Direct MP4 playback
    video.src = lecture.video.fileUrl;

  }, [lecture]);

  // Progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lecture?._id || !user?._id) return;

    let watchTimeInterval;

    const handleTimeUpdate = () => {
      const watchedPercentage = (video.currentTime / video.duration) * 100;

      // Mark as watched if 10% or more
      if (watchedPercentage >= 10) {
        updateLectureProgress({
          userId: user._id,
          lectureId: lecture._id,
          watched: true,
          watchTime: 0,
          completed: false,
        });
      }

      // Mark as completed if 90% or more
      if (watchedPercentage >= 90) {
        updateLectureProgress({
          userId: user._id,
          lectureId: lecture._id,
          watched: true,
          watchTime: 0,
          completed: true,
        });
      }
    };

    const handlePlay = () => {
      // Start tracking watch time every 10 seconds
      watchTimeInterval = setInterval(() => {
        updateWatchTime({
          userId: user._id,
          lectureId: lecture._id,
          watchTime: 10,
        });
      }, 10000);
    };

    const handlePause = () => {
      clearInterval(watchTimeInterval);
    };

    const handleEnded = () => {
      clearInterval(watchTimeInterval);
      updateLectureProgress({
        userId: user._id,
        lectureId: lecture._id,
        watched: true,
        watchTime: 0,
        completed: true,
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      clearInterval(watchTimeInterval);
    };
  }, [lecture, user]);

  // =========================
  // DISABLE RIGHT CLICK
  // =========================

  const handleContextMenu = (
    e
  ) => {

    e.preventDefault();

  };

  // =========================
  // DISABLE SOME SHORTCUTS
  // =========================

  const handleKeyDown = (e) => {

    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
    }

    // CTRL + S
    if (
      e.ctrlKey &&
      e.key === "s"
    ) {
      e.preventDefault();
    }

    // CTRL + U
    if (
      e.ctrlKey &&
      e.key === "u"
    ) {
      e.preventDefault();
    }

  };

  return (

    <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-[24px] shadow-lg border overflow-hidden`}>

      {/* VIDEO */}
      <div
        className="w-full bg-black"
        onContextMenu={
          handleContextMenu
        }
      >

        {lecture?.video?.fileUrl ? (

          <video
            ref={videoRef}

            controls

            autoPlay={false}

            controlsList="
              nodownload
              noplaybackrate
              nofullscreen
            "

            disablePictureInPicture

            onKeyDown={
              handleKeyDown
            }

            className="
              w-full
              h-[250px]
              md:h-[500px]
              bg-black
            "
          />

        ) : (

          <div className="
            h-[400px]
            flex
            items-center
            justify-center
            bg-black
          ">

            <p className="
              text-white
              text-sm
            ">
              Select a lecture to start watching
            </p>

          </div>

        )}

      </div>

      {/* LECTURE INFO */}
      <div className="p-5 md:p-7">

        <div className="
          flex
          items-center
          gap-2
          mb-3
        ">

          <span className="
            bg-black
            text-white
            text-xs
            px-3
            py-1
            rounded-full
          ">
            Lecture
          </span>

          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {lecture?.lectureTitle}
          </span>

        </div>

        <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>

          {
            lecture?.lectureTitle ||
            "Lecture Title"
          }

        </h1>

        <p className={`leading-7 mt-4 text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>

          {
            lecture?.description ||
            "No description available for this lecture."
          }

        </p>

      </div>
      {/* TABS */}

      {/* TABS */}
      <div className={`px-5 md:px-7 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>

        <div className="flex items-center gap-6 overflow-x-auto">

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "about"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
          >
            About
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "resources"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
          >
            Resources
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "quiz"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
          >
            Quiz
          </button>

          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "discussion"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
          >
            Discussions
          </button>

        </div>
      </div>


      {/* TAB CONTENT */}
      <div className="p-5 md:p-7">

        {activeTab === "about" && (
          <div>

            <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-gray-100" : "text-gray-900"
              }`}>
              About Lecture
            </h2>

            <p className={`leading-7 text-[15px] ${isDark ? "text-gray-300" : "text-gray-600"
              }`}>
              {
                lecture?.description ||
                "No description available for this lecture."
              }
            </p>

          </div>
        )}

        {activeTab === "resources" && (
          <LectureResources lecture={lecture} />
        )}

        {activeTab === "quiz" && (
          <QuizResult lectureId={lecture} />
        )}

        {activeTab === "discussion" && (
          <Comment lectureId={lecture?._id} />
        )}

      </div>
    </div>

  );

};

export default LecturePlayer;