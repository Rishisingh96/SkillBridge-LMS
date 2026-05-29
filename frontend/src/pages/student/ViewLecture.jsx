import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../../redux/slices/courseSlice";
import { setModuleData } from "../../redux/slices/moduleSlice";
import img from "../../assets/Empty.png";
import { serverUrl } from "../../App";
import LecturePlayer from "../../components/lecture/LecturePlayer";
import ModuleList from "../../components/lecture/ModuleList";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import Nav from "../../components/navbar/Navbar";
import { getCourseProgress, resumeLecture } from "../../services/progressService";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

const ViewLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  // Format seconds to "Xh Ym Zs"
  const formatTime = (seconds) => {
    if (!seconds) return "0h 0m 0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const { selectedCourse, courseData } = useSelector((state) => state.course);
  const { moduleData } = useSelector((state) => state.module);
  const { userData: user } = useSelector((state) => state.user);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseProgress, setCourseProgress] = useState({
    totalLectures: 0,
    completedLectures: 0,
    progressPercent: 70, // Temporarily set to 70% for testing
    totalWatchTime: 0,
    totalCourseDuration: 0,
    lectureProgress: {},
  });

  // Fetch Selected Course Data
  const fetchCourseData = () => {
    courseData.map((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));
      }
      return null;
    });
  };

  // Fetch Modules
  const fetchModules = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/course-modules/${courseId}`,
        { withCredentials: true }
      );
      dispatch(setModuleData(response.data.modules));
    } catch (error) {
      console.log(error);
    }
  };

  // Check Enrollment
  const checkEnrollment = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/check-enrollment/${courseId}`,
        { withCredentials: true }
      );
      if (response.data.isEnrolled && response.data.isActive) {
        setIsEnrolled(true);
      } else {
        setIsEnrolled(false);
        toast.error("Please enroll in this course to access lectures");
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      console.log(error);
      setIsEnrolled(false);
      toast.error("Please enroll in this course to access lectures");
      navigate(`/course/${courseId}`);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchModules();
    checkEnrollment();
  }, [courseData, courseId]);

  // Auto-select first lecture
  useEffect(() => {
    if (moduleData?.length > 0 && !selectedLecture) {
      const firstLecture = moduleData[0]?.lectures?.[0];
      if (firstLecture) {
        setSelectedLecture(firstLecture);
      }
    }
  }, [moduleData]);

  // Fetch Creator Data
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/creator`,
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  // Fetch Course Progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (user?._id && courseId && isEnrolled) {
        try {
          const progress = await getCourseProgress(courseId, user._id);
          setCourseProgress(progress);
        } catch (error) {
          console.log("Error fetching progress:", error);
        }
      }
    };
    fetchProgress();
  }, [user, courseId, isEnrolled]);

  // Refetch progress every 30 seconds while watching
  useEffect(() => {
    if (!isEnrolled) return;

    const interval = setInterval(async () => {
      if (user?._id && courseId) {
        try {
          const progress = await getCourseProgress(courseId, user._id);
          setCourseProgress(progress);
        } catch (error) {
          console.log("Error fetching progress:", error);
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user, courseId, isEnrolled]);

  // Auto-select first free lecture
  useEffect(() => {
    if (moduleData?.length > 0 && !selectedLecture) {
      // Sabse pehli free lecture dhundo
      for (const module of moduleData) {
        const freeLecture = module.lectures?.find((l) => l.isPreviewFree);
        if (freeLecture) {
          setSelectedLecture(freeLecture);
          break;
        }
      }
    }
  }, [moduleData]);

  return (
    <>
       <header
        className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${isDark
            ? "bg-white/5 border-white/10"
            : "bg-white/70 border-black/10"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[75px] flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer ${isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black/5 hover:bg-black/10"
                }`}
            >
              <FaArrowLeft />
            </motion.div>

            <div>
              <h1 className="font-black text-[22px] tracking-tight">
                SkillBridge
              </h1>

              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Premium Learning Platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black/5 hover:bg-black/10"
                }`}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            <img
              src={user?.photoUrl || img}
              alt=""
              className="w-11 h-11 rounded-2xl object-cover border border-white/20"
            />
          </div>
        </div>
      </header>
      <div className={`min-h-screen p-4 md:p-7 pt-[90px] ${isDark ? 'bg-gray-950' : 'bg-[#f4f4f5]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* PROGRESS HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 md:p-6 text-white shadow-2xl mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* LEFT - Course Name & Watched Time */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {selectedCourse?.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <p className="text-sm text-white/80">
                  {formatTime(courseProgress.totalWatchTime)} WATCHED
                </p>
                <span className="text-white/50">|</span>
                <p className="text-sm text-white/80">
                  Total: {formatTime(courseProgress.totalCourseDuration)}
                </p>
              </div>
            </div>

            {/* RIGHT - Progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/80">Course Progress</p>
                <p className="text-2xl font-bold">{courseProgress.progressPercent}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div 
                  className="w-full h-full rounded-full border-4 border-white transition-all duration-300"
                  style={{
                    borderLeftColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: `rotate(${(courseProgress.progressPercent / 100) * 360}deg)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${courseProgress.progressPercent}%` }}
            />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-6">

          {/* LEFT — Video Player */}
          <LecturePlayer lecture={selectedLecture} />

          {/* RIGHT — Sidebar */}
          <div className="space-y-5">

            {/* MODULE LIST */}
            <ModuleList
              moduleData={moduleData}
              selectedLecture={selectedLecture}
              onSelectLecture={setSelectedLecture}
              mode="watch"
              isEnrolled={isEnrolled}
              lectureProgress={courseProgress.lectureProgress}
            />

            {/* INSTRUCTOR */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-[24px] border shadow-lg p-5`}>
              <h2 className={`text-xl font-bold mb-5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Instructor
              </h2>

              <div className="flex items-start gap-4">
                <img
                  src={selectedCourse?.creator?.photoUrl || img}
                  alt=""
                  className={`w-16 h-16 rounded-2xl object-cover border shadow-sm ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                />

                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedCourse?.creator?.name || "Unknown Creator"}
                  </h3>

                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedCourse?.creator?.email || "No Email"}
                  </p>

                  <p className={`text-sm leading-6 mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Passionate instructor helping students learn modern
                    development skills through practical projects.
                  </p>
                </div>
              </div>
            </div>

            {/* COURSE PROGRESS */}
            <div className="bg-gradient-to-r from-black to-gray-900 rounded-[24px] p-5 text-white shadow-xl">
              <p className="text-sm text-gray-300 mb-2">Course Progress</p>

              <h2 className="text-3xl font-bold">
                {courseProgress.progressPercent}%
              </h2>

              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${courseProgress.progressPercent}%` }}
                />
              </div>

              <p className="text-sm text-gray-400 mt-3">
                {courseProgress.completedLectures} / {courseProgress.totalLectures} lectures completed
              </p>

              {/* CERTIFICATE BUTTON - Shows when 100% complete */}
              {courseProgress.progressPercent === 100 && (
                <button
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>🎓</span>
                  <span>Download Certificate</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ViewLecture;