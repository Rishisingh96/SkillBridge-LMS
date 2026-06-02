import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";

import img from "../../assets/Empty.png";
import Nav from "../../components/navbar/Navbar";
import axios from "axios";
import { serverUrl } from "../../App";

const MyEnrolledCourses = () => {
  const { userData } = useSelector((state) => state.user);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Fetch enrollments with dates
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!userData) return;

      setLoadingEnrollments(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/course/user-enrollments`,
          { withCredentials: true }
        );
        setEnrollments(response.data.enrollments || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingEnrollments(false);
      }
    };

    fetchEnrollments();
  }, [userData]);

  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f5f5f7] px-4 md:px-8 py-7 pt-[90px]">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="
          w-11 h-11 rounded-xl bg-white border border-gray-200
          flex items-center justify-center
          shadow-sm hover:shadow-md
          hover:-translate-x-1 transition-all duration-300
        "
        >
          <FaArrowLeft className="text-[18px]" />
        </button>

        <div className="mt-5">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Learning
          </h1>

          <p className="text-gray-500 mt-2 text-[15px]">
            Continue learning from your enrolled courses.
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {loadingEnrollments ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading courses...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div
          className="
          max-w-3xl mx-auto bg-white border border-gray-200
          rounded-[28px] p-10 text-center shadow-sm
        "
        >
          <div
            className="
            w-20 h-20 rounded-full bg-gray-100
            flex items-center justify-center mx-auto
          "
          >
            <MdOutlineOndemandVideo className="text-[40px] text-gray-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-6">
            No Courses Yet
          </h2>

          <p className="text-gray-500 mt-3 leading-7">
            You haven’t enrolled in any course yet.
            Start learning by exploring our premium courses.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
            mt-7 bg-black text-white px-7 py-3 rounded-2xl
            font-semibold hover:bg-gray-800
            transition-all duration-300
          "
          >
            Explore Courses
          </button>
        </div>
      ) : (
        
        /* COURSE GRID */
        <div
          className="
          max-w-7xl mx-auto
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
          gap-6
        "
        >
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="
              bg-white rounded-[28px]
              border border-gray-200
              overflow-hidden
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
            >
              
              {/* THUMBNAIL */}
              <div className="relative">
                <img
                  src={enrollment.course?.thumbnail || img}
                  alt=""
                  className="
                  w-full h-[220px]
                  object-cover
                "
                />

                {/* Overlay */}
                <div
                  className="
                  absolute inset-0
                  bg-gradient-to-t from-black/40 to-transparent
                "
                />

                {/* LEVEL */}
                <div
                  className="
                  absolute top-4 left-4
                  bg-white/90 backdrop-blur-md
                  px-4 py-2 rounded-full
                  text-xs font-semibold text-black
                  shadow-sm
                "
                >
                  {enrollment.course?.level || "Beginner"}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                
                {/* CATEGORY */}
                <p className="text-sm text-gray-500 font-medium">
                  {enrollment.course?.category || "Development"}
                </p>

                {/* TITLE */}
                <h2
                  className="
                  text-[22px] font-bold text-gray-900
                  mt-2 leading-snug line-clamp-2
                "
                >
                  {enrollment.course?.title}
                </h2>

                {/* DESCRIPTION */}
                <p
                  className="
                  text-gray-500 text-sm leading-6
                  mt-3 line-clamp-2
                "
                >
                  {enrollment.course?.subTitle ||
                    "Continue mastering new skills with this professional course."}
                </p>

                {/* STATS */}
                <div className="flex items-center gap-4 mt-5">
                  
                  <div
                    className="
                    flex items-center gap-2
                    bg-gray-100 px-3 py-2 rounded-xl
                  "
                  >
                    <FaPlayCircle className="text-[14px]" />

                    <span className="text-sm font-medium text-gray-700">
                      {enrollment.course?.lectures?.length || 0} Lectures
                    </span>
                  </div>

                  <div
                    className="
                    bg-green-100 text-green-700
                    text-xs font-semibold
                    px-3 py-2 rounded-xl
                  "
                  >
                      <span
                      className={`font-medium ${
                        enrollment.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {enrollment.status === "active"
                        ? `${enrollment.daysRemaining} days left`
                        : "Expired"}
                    </span>
                  </div>
                </div>

                {/* ENROLLMENT DETAILS */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Enrolled:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {new Date(enrollment.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Valid Till:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {new Date(enrollment.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`font-medium ${
                        enrollment.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {enrollment.status === "active"
                        ? `${enrollment.daysRemaining} days left`
                        : "Expired"}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(`/viewlecture/${enrollment.course?._id}`)
                  }
                  className="
                  mt-6 w-full
                  bg-black text-white
                  py-3.5 rounded-2xl
                  font-semibold text-[15px]
                  hover:bg-gray-800
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
                >
                  <FaPlayCircle />

                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MyEnrolledCourses;