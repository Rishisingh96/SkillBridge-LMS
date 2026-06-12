import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../../redux/slices/courseSlice";
import { setModuleData } from "../../redux/slices/moduleSlice";
import img from "../../assets/Empty.png";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import LecturePlayer from "../../components/lecture/LecturePlayer";
import ModuleList from "../../components/lecture/ModuleList";
import ResumeLearningButton from "../../components/progress/ResumeLearningButton";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import Nav from "../../components/navbar/Navbar";

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
    progressPercent: 0,
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
        `${BASE_URL}/api/course/course-modules/${courseId}`,
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
        `${BASE_URL}/api/course/check-enrollment/${courseId}`,
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

  // Auto-switch to next lecture when current lecture completes
  const handleLectureComplete = async () => {
    if (!moduleData || !selectedLecture) return;

    // Refetch modules to get updated isLectureCompleted and isQuizCompleted status
    await fetchModules();

    // Refetch course progress to update progress stats
    await fetchCourseProgress();

    // Find current lecture position
    let currentModuleIndex = -1;
    let currentLectureIndex = -1;

    for (let i = 0; i < moduleData.length; i++) {
      const lectureIndex = moduleData[i].lectures?.findIndex(
        (l) => l._id === selectedLecture._id
      );
      if (lectureIndex !== -1) {
        currentModuleIndex = i;
        currentLectureIndex = lectureIndex;
        break;
      }
    }

    // Check if current lecture is fully completed (both lecture AND quiz)
    const currentLecture = moduleData[currentModuleIndex]?.lectures?.[currentLectureIndex];
    const isFullyCompleted = currentLecture && currentLecture.isLectureCompleted === true && 
                           (currentLecture.quizQuestions?.length === 0 || currentLecture.isQuizCompleted === true);

    // Only jump to next lecture if current lecture is fully completed
    if (!isFullyCompleted) {
      console.log("Current lecture not fully completed (lecture + quiz), not jumping to next");
      return;
    }

    // Try to get next lecture in same module
    if (currentModuleIndex !== -1 && currentLectureIndex !== -1) {
      const nextLectureInModule = moduleData[currentModuleIndex].lectures?.[currentLectureIndex + 1];
      if (nextLectureInModule) {
        setSelectedLecture(nextLectureInModule);
        return;
      }

      // Try to get first lecture of next module
      const nextModule = moduleData[currentModuleIndex + 1];
      if (nextModule && nextModule.lectures?.[0]) {
        setSelectedLecture(nextModule.lectures[0]);
      }
    }
  };

  // Handle quiz completion - refresh modules and try to jump to next lecture
  const handleQuizComplete = async () => {
    // Refetch modules to get updated isQuizCompleted status
    await fetchModules();

    // Refetch course progress to update progress stats
    await fetchCourseProgress();

    // Find current lecture position
    let currentModuleIndex = -1;
    let currentLectureIndex = -1;

    for (let i = 0; i < moduleData.length; i++) {
      const lectureIndex = moduleData[i].lectures?.findIndex(
        (l) => l._id === selectedLecture._id
      );
      if (lectureIndex !== -1) {
        currentModuleIndex = i;
        currentLectureIndex = lectureIndex;
        break;
      }
    }

    // Check if current lecture is fully completed (both lecture AND quiz)
    const currentLecture = moduleData[currentModuleIndex]?.lectures?.[currentLectureIndex];
    const isFullyCompleted = currentLecture && currentLecture.isLectureCompleted === true && 
                           (currentLecture.quizQuestions?.length === 0 || currentLecture.isQuizCompleted === true);

    // Only jump to next lecture if current lecture is fully completed
    if (!isFullyCompleted) {
      console.log("Current lecture not fully completed (lecture + quiz), not jumping to next");
      return;
    }

    // Try to get next lecture in same module
    if (currentModuleIndex !== -1 && currentLectureIndex !== -1) {
      const nextLectureInModule = moduleData[currentModuleIndex].lectures?.[currentLectureIndex + 1];
      if (nextLectureInModule) {
        setSelectedLecture(nextLectureInModule);
        return;
      }

      // Try to get first lecture of next module
      const nextModule = moduleData[currentModuleIndex + 1];
      if (nextModule && nextModule.lectures?.[0]) {
        setSelectedLecture(nextModule.lectures[0]);
      }
    }
  };

  // Fetch Creator Data
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            `${BASE_URL}/api/course/creator`,
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
  const fetchCourseProgress = async () => {
    if (user?._id && courseId && isEnrolled) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/course/progress/course/${courseId}`,
          { withCredentials: true }
        );
        setCourseProgress(response.data);
      } catch (error) {
        console.log("Error fetching progress:", error);
      }
    }
  };

  useEffect(() => {
    fetchCourseProgress();
  }, [user, courseId, isEnrolled]);

  // Refetch progress every 30 seconds while watching
  useEffect(() => {
    if (!isEnrolled) return;

    const interval = setInterval(() => {
      fetchCourseProgress();
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

     {/* <header
        className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${isDark
            ? "bg-white/5 border-white/10"
            : "bg-white/70 border-black/10"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[75px] flex items-center justify-between">
         <Nav />
        </div>
      </header> */}


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

      

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-6">

          {/* LEFT — Video Player */}
          <LecturePlayer lecture={selectedLecture} onLectureComplete={handleLectureComplete} onQuizComplete={handleQuizComplete} />

          {/* RIGHT — Sidebar */}
          <div className="space-y-5">

            {/* RESUME LEARNING BUTTON */}
            {/* <ResumeLearningButton
              courseId={courseId}
              onSelectLecture={setSelectedLecture}
            /> */}

            {/* MODULE LIST */}
            <ModuleList
              moduleData={moduleData}
              selectedLecture={selectedLecture}
              onSelectLecture={setSelectedLecture}
              mode="watch"
              isEnrolled={isEnrolled}
              lectureProgress={courseProgress.lectureProgress}
              progressPercent={courseProgress.progressPercent}
              courseId={courseId}
              totalCourseDuration={courseProgress.totalCourseDuration}
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
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ViewLecture;