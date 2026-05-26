import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../../redux/slices/courseSlice";
import { setModuleData } from "../../redux/slices/moduleSlice";
import img from "../../assets/Empty.png";
import { serverUrl } from "../../App";
import LecturePlayer from "../../components/lecture/LecturePlayer";
import ModuleList from "../../components/lecture/ModuleList";
import { toast } from "react-toastify";

const ViewLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCourse, courseData } = useSelector((state) => state.course);
  const { moduleData } = useSelector((state) => state.module);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

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
    <div className="min-h-screen bg-[#f4f4f5] p-4 md:p-7">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="
              w-11 h-11 rounded-xl bg-white border border-gray-200
              flex items-center justify-center
              shadow-sm hover:shadow-md
              hover:-translate-x-1 transition-all duration-300
            "
          >
            <FaArrowLeftLong className="text-[18px]" />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {selectedCourse?.title}
            </h1>

            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <p className="text-sm text-gray-500">
                Category :
                <span className="font-medium text-gray-700 ml-1">
                  {selectedCourse?.category}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Level :
                <span className="font-medium text-gray-700 ml-1">
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
            <div className="bg-white rounded-[24px] border border-gray-200 shadow-lg p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Instructor
              </h2>

              <div className="flex items-start gap-4">
                <img
                  src={selectedCourse?.creator?.photoUrl || img}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCourse?.creator?.name || "Unknown Creator"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCourse?.creator?.email || "No Email"}
                  </p>

                  <p className="text-sm text-gray-600 leading-6 mt-3">
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
                {moduleData?.reduce(
                  (total, module) => total + module.lectures.length, 0
                ) || 0}+
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Lectures available in this course
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLecture;