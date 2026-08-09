// src/component/Lecture/LecturePlayer.jsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";
import Comment from "../../pages/student/Comment";
import AIChatbot from "./AIChatbot";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_SERVER_URL;


const LecturePlayer = ({
  lecture,
  onLectureComplete,
  onQuizComplete,
}) => {

  const videoRef = useRef(null);
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("about");
  const { userData: user } = useSelector((state) => state.user) || {};
  const { selectedCourse } = useSelector((state) => state.course) || {};

  console.log("===== LECTURE PLAYER DEBUG =====");
  console.log("Lecture data:", lecture);
  console.log("Lecture ID:", lecture?._id || lecture?.id);
  console.log("Lecture Title:", lecture?.title || lecture?.lectureTitle);
  console.log("Selected course:", selectedCourse);

  // Check if user is enrolled
  const isEnrolled = selectedCourse?.enrolledStudents?.some(
    enrollment => enrollment.toString() === user?._id?.toString()
  );

  console.log("Is enrolled:", isEnrolled);

  // Move early return after all hooks
  if (!lecture) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Lecture Selected</h3>
        <p className="text-sm opacity-70">Please select a lecture from the module list to start watching</p>
      </div>
    );
  }

  useEffect(() => {

    if (
      !lecture?.video?.fileUrl
    ) return;

    const video =
      videoRef.current;

    // Direct MP4 playback
    video.src = lecture.video.fileUrl;

    // Resume from saved position
    if (lecture.currentPosition > 0) {
      video.currentTime = lecture.currentPosition;
    }

  }, [lecture]);

  // Progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lecture?._id || !user?._id) return;

    let watchTimeInterval;
    let lastUpdateTime = 0;

    const updateProgress = async (currentPosition) => {
      try {
        await axios.post(
          `${BASE_URL}/api/course/progress/update`,
          { lectureId: lecture._id, currentPosition },
          { withCredentials: true }
        );
      } catch (error) {
        console.log("Error updating progress:", error);
      }
    };

    const handleTimeUpdate = () => {
      const watchedPercentage = (video.currentTime / video.duration) * 100;

      // Update progress every 5 seconds
      const now = Date.now();
      if (now - lastUpdateTime > 5000) {
        updateProgress(video.currentTime);
        lastUpdateTime = now;
      }

      // Mark as completed if 90% or more
      if (watchedPercentage >= 90) {
        updateProgress(video.currentTime);
      }
    };

    const handlePlay = () => {
      // Start tracking watch time every 10 seconds
      watchTimeInterval = setInterval(() => {
        updateProgress(video.currentTime);
      }, 10000);
    };

    const handlePause = () => {
      clearInterval(watchTimeInterval);
      updateProgress(video.currentTime);
    };

    const handleEnded = async () => {
      clearInterval(watchTimeInterval);
      updateProgress(video.currentTime);

      // Mark lecture as completed in backend
      try {
        await axios.put(
          `${BASE_URL}/api/course/mark-lecture-completed/${lecture._id}`,
          {},
          { withCredentials: true }
        );

        // Notify parent component to auto-switch to next lecture
        if (onLectureComplete) {
          onLectureComplete();
        }
      } catch (error) {
        console.log("Error marking lecture as completed:", error);
      }
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

        {lecture?.description && (
          <p className={`leading-7 mt-4 text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {lecture.description}
          </p>
        )}

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
            onClick={() => {
              if (!lecture) {
                toast.warning("Please select a lecture first to view resources");
                return;
              }
              setActiveTab("resources");
            }}
            disabled={!lecture}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "resources"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              } ${!lecture ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Resources
          </button>

          <button
            onClick={() => {
              if (!lecture) {
                toast.warning("Please select a lecture first to take quiz");
                return;
              }
              setActiveTab("quiz");
            }}
            disabled={!lecture}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "quiz"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              } ${!lecture ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Quiz
          </button>

          <button
            onClick={() => {
              if (!lecture) {
                toast.warning("Please select a lecture first to use AI Chatbot");
                return;
              }
              if (!isEnrolled) {
                toast.warning("Please enroll in this course to unlock AI Chatbot");
                return;
              }
              setActiveTab("chatbot");
            }}
            disabled={!lecture || !isEnrolled}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "chatbot"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              } ${(!lecture || !isEnrolled) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            AI Chatbot {!isEnrolled && <span className="ml-1 text-xs">🔒</span>}
          </button>

          <button
            onClick={() => {
              if (!lecture) {
                toast.warning("Please select a lecture first to view discussions");
                return;
              }
              setActiveTab("discussion");
            }}
            disabled={!lecture}
            className={`pb-4 pt-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === "discussion"
                ? "border-blue-500 text-blue-500"
                : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              } ${!lecture ? 'opacity-50 cursor-not-allowed' : ''}`}
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

            {lecture?.description ? (
              <p className={`leading-7 text-[15px] ${isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                {lecture.description}
              </p>
            ) : (
              <p className={`leading-7 text-[15px] ${isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                No description added for this lecture yet.
              </p>
            )}

          </div>
        )}

        {activeTab === "resources" && (
          <LectureResources lecture={lecture} />
        )}

        {activeTab === "quiz" && (
          <QuizResult lectureId={lecture} onQuizComplete={onQuizComplete} />
        )}

        {activeTab === "discussion" && (
          <Comment lectureId={lecture?._id} />
        )}

        {activeTab === "chatbot" && (
          <AIChatbot 
            lectureId={lecture?._id || lecture?.id} 
            lectureTitle={lecture?.title || lecture?.lectureTitle || "Lecture"} 
          />
        )}

      </div>
    </div>

  );

};

export default LecturePlayer;
