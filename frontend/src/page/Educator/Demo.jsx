import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { fetchModules } from "../redux/moduleSlice"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { setModuleData } from "../redux/moduleSlice";
import img from "../assets/Empty.png";
import LectureResources from "../component/Lecture/LectureResources";
import QuizResult from "../component/Lecture/QuizResult";
import { serverUrl } from "../App";

const Demo = () => {
  const { courseId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const { selectedCourse, courseData } = useSelector((state) => state.course);

  const { moduleData } = useSelector((state) => state.module);

  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openModule, setOpenModule] = useState(null);


  // Fetch Selected Course Data
  const fetchCourseData = () => {
    console.log("All Courses => ", courseData);

    courseData.map((course) => {
      // console.log("Checking Course => ", course._id);

      if (course._id === courseId) {
        // console.log("Matched Course Found => ", course);

        dispatch(setSelectedCourse(course));

        console.log("Selected Course Set Successfully");
      }

      return null;
    });
  };

  //FetchModule
  const fetchModules = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/course-modules/${courseId}`,
        {
          withCredentials: true,
        },
      );

      dispatch(setModuleData(response.data.modules));

      console.log("Modules:", response.data.modules);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchCourseData();
    fetchModules();

  }, [courseData, courseId]);


  useEffect(() => {

    if (moduleData?.length > 0 && !selectedLecture) {

      const firstLecture = moduleData[0]?.lectures?.[0];

      if (firstLecture) {

        setSelectedLecture(firstLecture);

      }

    }

  }, [moduleData]);

  useEffect(() => {
    if (moduleData) {
      console.log("Module Data fetch: ", moduleData);
    }
  }, [moduleData])

  // Fetch Creator Data
  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/creator`,
            { userId: selectedCourse?.creator },
            { withCredentials: true },
          );

          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    handleCreator();
  }, [selectedCourse]);


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

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-6">
          {/* LEFT SIDE */}
          <div className="bg-white rounded-[24px] shadow-lg border border-gray-200 overflow-hidden">
            {/* VIDEO */}
            <div className="w-full bg-black relative">
              {selectedLecture?.video?.fileUrl ? (
                <video
                  key={selectedLecture?.video?.fileUrl}
                  src={selectedLecture?.video?.fileUrl}
                  controls
                  className="w-full h-[250px] md:h-[500px] object-cover"
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-white text-sm">
                    Select Lecture to Start Watching
                  </p>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  Lecture
                </span>

                <span className="text-sm text-gray-500">
                  {selectedLecture?.lectureTitle}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {selectedLecture?.lectureTitle || "Lecture Title"}
              </h1>

              <p className="text-gray-600 leading-7 mt-4 text-[15px]">
                {selectedLecture?.description ||
                  "No description available for this lecture."}
              </p>
            </div>

            {/* Resoue Download  */}
            <LectureResources lecture={selectedLecture} />
            <QuizResult lectureId={selectedLecture} />
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            {/* LECTURE LIST */}
            <div className="bg-white rounded-[24px] border border-gray-200 shadow-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    All Lectures
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {/* {selectedCourse?.lectures?.length || 0} Lectures */}
                    {
                      moduleData?.reduce(
                        (total, module) => total + module.lectures.length,
                        0
                      ) || 0
                    } Lectures
                  </p>
                </div>

                <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl">
                  Course
                </div>
              </div>



              {/* LECTURES */}
              <div className="flex flex-col gap-5">

                {moduleData?.map((module, moduleIndex) => (

                  <div
                    key={module._id}
                    className="border rounded-2xl p-4 bg-[#fafafa]"
                  >

                    {/* MODULE HEADER */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setOpenModule(
                          openModule === module._id ? null : module._id
                        )
                      }
                    >

                      <div>
                        <h2 className="text-lg font-bold text-black">
                          Module {moduleIndex + 1}: {module.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {module.description}
                        </p>
                      </div>

                      <span className="text-2xl font-bold">
                        {openModule === module._id ? "-" : "+"}
                      </span>

                    </div>

                    {/* LECTURES */}
                    {openModule === module._id && (

                      <div className="flex flex-col gap-3 mt-4">

                        {module.lectures?.map((lecture, lectureIndex) => (

                          <button
                            key={lecture._id}
                            onClick={() => setSelectedLecture(lecture)}
                            className={`

                w-full flex items-center justify-between
                px-4 py-4 rounded-2xl
                border transition-all duration-300 text-left

                ${selectedLecture?._id === lecture?._id
                                ? "bg-black text-white border-black shadow-lg"
                                : "bg-white border-gray-200 hover:border-black"
                              }

              `}
                          >

                            {/* LEFT */}
                            <div className="flex items-center gap-3">

                              <div
                                className={`

                    w-11 h-11 rounded-xl
                    flex items-center justify-center

                    ${selectedLecture?._id === lecture?._id
                                    ? "bg-white/20"
                                    : "bg-gray-100"
                                  }

                  `}
                              >

                                <FaPlayCircle
                                  className={`

                      text-[18px]

                      ${selectedLecture?._id === lecture?._id
                                      ? "text-white"
                                      : "text-black"
                                    }

                    `}
                                />

                              </div>

                              <div>

                                <h3
                                  className={`

                      text-[15px] font-semibold

                      ${selectedLecture?._id === lecture?._id
                                      ? "text-white"
                                      : "text-gray-800"
                                    }

                    `}
                                >

                                  {lecture.lectureTitle}

                                </h3>

                                <p
                                  className={`

                      text-xs mt-1

                      ${selectedLecture?._id === lecture?._id
                                      ? "text-gray-300"
                                      : "text-gray-500"
                                    }

                    `}
                                >

                                  Lecture {lectureIndex + 1}

                                </p>

                              </div>

                            </div>

                            {/* RIGHT */}
                            <span
                              className={`

                  text-xs font-semibold
                  px-3 py-1 rounded-full

                  ${selectedLecture?._id === lecture?._id
                                  ? "bg-white text-black"
                                  : "bg-green-100 text-green-700"
                                }

                `}
                            >

                              Watch

                            </span>

                          </button>

                        ))}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            </div>

            {/* INSTRUCTOR */}
            <div className="bg-white rounded-[24px] border border-gray-200 shadow-lg p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Instructor
              </h2>

              <div className="flex items-start gap-4">
                <img
                  src={selectedCourse?.creator?.photoUrl || img}
                  alt=""
                  className="
                  w-16 h-16 rounded-2xl object-cover border border-gray-200
                  shadow-sm
                "
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
                {selectedCourse?.lectures?.length || 0}+
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

export default Demo;
