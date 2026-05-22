import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { fetchModules } from ".././redux/moduleSlice"

import axios from "axios";

import img from "../assets/Empty.png";
import LectureResources from "../component/Lecture/LectureResources";
import QuizResult from "../component/Lecture/QuizResult";

import { serverUrl } from "../App";

const ViewLecture = () => {
  const { couseId } = useParams();

  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const { selectedCourse } = useSelector((state) => state.course);
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

    if (moduleData?.length > 0 && !selectedLecture) {

      for (const module of moduleData) {

        const freeLecture = module.lectures?.find(
          (lecture) => lecture.isPreviewFree
        );

        if (freeLecture) {

          setSelectedLecture(freeLecture);

          break;
        }

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
              {selectedLecture?.videoUrl ? (
                <video
                  key={selectedLecture?.videoUrl}
                  src={selectedLecture?.videoUrl}
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
            <LectureResources selectedLecture={selectedLecture} />
            <QuizResult selectedLecture={selectedLecture} />
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
              <div
                 className="flex items-center justify-between cursor-pointer"
                onClick={() =>
                      setOpenModule(
                        openModule === module._id ? null : module._id,
                      )
                    }
              >
                

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

export default ViewLecture;
// // <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
//                 {selectedCourse?.lectures?.length > 0 ? (
//                   selectedCourse?.lectures?.map((lecture, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSelectedLecture(lecture)}
//                       className={`
//         w-full flex items-center justify-between
//         px-3 py-3 rounded-[18px]
//         border text-left
//         transition-all duration-300

//         ${selectedLecture?._id === lecture?._id
//                           ? "bg-[#f1f1f1] border-gray-300 shadow-sm"
//                           : "bg-[#fafafa] border-gray-200 hover:bg-[#f5f5f5]"
//                         }
//       `}
//                     >
//                       {/* LEFT */}
//                       <div className="flex items-center gap-3 min-w-0">
//                         {/* ICON */}
//                         <div
//                           className={`
//             min-w-[42px] h-[42px]
//             rounded-xl flex items-center justify-center
//             transition-all duration-300

//             ${selectedLecture?._id === lecture?._id
//                               ? "bg-white shadow-sm"
//                               : "bg-[#f0f0f0]"
//                             }
//           `}
//                         >
//                           <FaPlayCircle
//                             className={`
//               text-[16px]

//               ${selectedLecture?._id === lecture?._id
//                                 ? "text-black"
//                                 : "text-gray-700"
//                               }
//             `}
//                           />
//                         </div>

//                         {/* TEXT */}
//                         <div className="min-w-0">
//                           <h3
//                             className={`
//               text-[14px] font-semibold truncate

//               ${selectedLecture?._id === lecture?._id
//                                 ? "text-black"
//                                 : "text-gray-800"
//                               }
//             `}
//                           >
//                             {lecture?.lectureTitle}
//                           </h3>

//                           <p className="text-[12px] text-gray-500 mt-[2px]">
//                             Lecture {index + 1}
//                           </p>
//                         </div>
//                       </div>

//                       {/* RIGHT */}
//                       <div>
//                         <span
//                           className={`
//             text-[11px] font-medium
//             px-3 py-1.5 rounded-full
//             transition-all duration-300

//             ${selectedLecture?._id === lecture?._id
//                               ? "bg-white text-black border border-gray-200"
//                               : "bg-gray-100 text-gray-600"
//                             }
//           `}
//                         >
//                           Watch
//                         </span>
//                       </div>
//                     </button>
//                   ))
//                 ) : (
//                   <div className="text-center py-10">
//                     <p className="text-gray-500 text-sm">
//                       No Lectures Available
//                     </p>
//                   </div>
//                 )}
//               </div>