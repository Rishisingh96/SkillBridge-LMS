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

const ViewLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

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
      <Nav />
      <div className={`min-h-screen p-4 md:p-7 pt-[90px] ${isDark ? 'bg-gray-950' : 'bg-[#f4f4f5]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`
              w-11 h-11 rounded-xl border
              flex items-center justify-center
              shadow-sm hover:shadow-md
              hover:-translate-x-1 transition-all duration-300
              ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}
            `}
          >
            <FaArrowLeft className="text-[18px]" />
          </button>

          <div>
            <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {selectedCourse?.title}
            </h1>

            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Category :
                <span className={`font-medium ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedCourse?.category}
                </span>
              </p>

              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Level :
                <span className={`font-medium ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedCourse?.level}
                </span>
              </p>
            </div>
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
            </div>

          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ViewLecture;