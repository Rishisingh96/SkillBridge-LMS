import React, { useEffect, useState } from "react";

import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { setSelectedCourse } from "../../redux/courseSlice";

import img from "../../assets/Empty.png";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";

import axios from "axios";
import { serverUrl } from "../../App";
import Card from "../../component/Card";
import { toast } from "react-toastify";

const ViewCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Course Id from URL
  const { courseId } = useParams();

  const { userData } = useSelector((state) => state.user);

  // Redux Data
  const { courseData, selectedCourse } = useSelector((state) => state.course);

  // Selected Preview Lecture
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Creator Data
  const [creatorData, setCreatorData] = useState(null);

  const [creatorCourse, setCreatorCourses] = useState(null);

  const [isEnrolled, setIsEnrolled] = useState(false);

  // ======================================================
  // Fetch Selected Course Data
  // ======================================================
  const fetchCourseData = () => {
    console.log("All Courses => ", courseData);

    courseData.map((course) => {
      console.log("Checking Course => ", course._id);

      if (course._id === courseId) {
        console.log("Matched Course Found => ", course);

        dispatch(setSelectedCourse(course));

        console.log("Selected Course Set Successfully");
      }

      return null;
    });
  };

  // useEffect(() => {
  //   const handleCreator = async (userId) => {
  //   //  console.log("User Id: " + userId);
  //     if(selectedCourse?.creator){
  //       try{
  //        const result = await axios.post(
  //         serverUrl + "/api/course/creator",
  //         // { userId: selectedCourse?.creator },
  //         { userId: selectedCourse?.userId },
  //         { withCredentials: true },
  //       );
  //       console.log("Creator Data => ", result.data);
  //       setCreatorData(result.data);

  //       }catch(error){
  //         console.log("Error fetching creator data => ", error);
  //       }

  //     }

  //   };

  //   handleCreator();
  // }, [selectedCourse]);

  // ======================================================
  // Fetch Course on Page Load
  // ======================================================

  // check Enrollemnt true when enrollemnt success

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() === courseId?.toString(),
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, userData]);

  // ======================================================
  // Check Creator Data Updated
  // ======================================================
  useEffect(() => {
    console.log("Updated Creator Data => ", creatorData);
  }, [creatorData]);

  // ======================================================
  // Fetch Other Courses (excluding current course)
  // ======================================================
  useEffect(() => {
    console.log("Course Data:", courseData);
    console.log("Course ID:", courseId);

    if (courseData?.length > 0) {
      // Filter out current course and take top 5 latest
      const otherCourses = courseData
        .filter((course) => course._id !== courseId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      console.log("Other Courses:", otherCourses);
      console.log("Other Courses length:", otherCourses.length);

      setCreatorCourses(otherCourses);
    } else {
      console.log("Course Data is empty or null");
    }
  }, [courseData, courseId]);

  // handle Enrollment pyament service
  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(
        serverUrl + `/api/order/razorpay-order`,
        {
          userId,
          courseId,
        },
        { withCredentials: true },
      );
      console.log(orderData.data);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "LEARN SKILLS",
        description: "COURSE ENROLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          console.log("RazorePay Response", response);

          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              {
                ...response,
                courseId,
                userId,
              },
              { withCredentials: true },
            );
            setIsEnrolled(true);
            toast.success(verifyPayment.data.message);
          } catch (error) {
            toast.error(error.response.data.message);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while enrollment.. ");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] p-4 md:p-8">
      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-[22px] shadow-lg border border-gray-200 p-4 md:p-5">
        {/* Back Button */}
        <FaArrowLeftLong
          className="text-black text-[22px] cursor-pointer mb-5 hover:translate-x-[-4px] duration-300"
          onClick={() => navigate("/")}
        />

        {/* Course Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full lg:w-[52%]">
            <img
              src={selectedCourse?.thumbnail || img}
              alt=""
              className="w-full h-[240px] md:h-[320px] rounded-[18px] object-cover shadow-md"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center">
            <h1 className="text-2xl md:text-[38px] font-bold text-black leading-tight">
              {selectedCourse?.title || "Complete Html Course"}
            </h1>

            <p className="text-gray-500 text-[15px] mt-3 leading-7">
              {selectedCourse?.subTitle || "Best Course to start Development"}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-[2px] text-yellow-400 text-[14px]">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <span className="font-semibold text-gray-700 text-sm">5</span>

              <span className="text-gray-400 text-sm">(1,200 Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <h2 className="text-3xl font-bold text-black">
                ₹{selectedCourse?.price || 199}
              </h2>

              <span className="line-through text-gray-400 text-lg">₹599</span>
            </div>

            {/* Features */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm">✅</span>

                <p className="text-gray-600 text-sm">
                  10+ hours of video content
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm">✅</span>

                <p className="text-gray-600 text-sm">
                  Lifetime access to course materials
                </p>
              </div>
            </div>

            {/* Enroll / Watch Button */}
            {!isEnrolled ? (
              <button
                className="
      mt-7 group relative overflow-hidden
      bg-gradient-to-r from-black via-gray-900 to-black
      text-white px-8 py-4 rounded-2xl w-fit
      font-semibold text-[15px] tracking-wide
      shadow-[0_10px_30px_rgba(0,0,0,0.18)]
      border border-gray-800
      hover:scale-[1.03]
      hover:shadow-[0_15px_40px_rgba(0,0,0,0.28)]
      active:scale-[0.98]
      transition-all duration-300
    "
                onClick={() => handleEnroll(userData._id, courseId)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Enroll Now
                </span>

                {/* Shine Effect */}
                <div
                  className="
        absolute top-0 left-[-100%]
        h-full w-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        group-hover:left-[100%]
        transition-all duration-700
      "
                />
              </button>
            ) : (
              <button
                className="
      mt-7 group relative overflow-hidden
      bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
      text-white px-8 py-4 rounded-2xl w-fit
      font-semibold text-[15px] tracking-wide
      shadow-[0_10px_30px_rgba(34,197,94,0.35)]
      border border-green-400/40
      hover:scale-[1.03]
      hover:shadow-[0_15px_40px_rgba(34,197,94,0.45)]
      active:scale-[0.98]
      transition-all duration-300
    "
                onClick={() => navigate(`/viewlecture/${courseId}`)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  ▶ Watch Now
                </span>

                {/* Shine Effect */}
                <div
                  className="
        absolute top-0 left-[-100%]
        h-full w-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        group-hover:left-[100%]
        transition-all duration-700
      "
                />
              </button>
            )}
          </div>
        </div>

        {/* Curriculum + Preview */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 items-start">
          {/* LEFT */}
          <div className="bg-[#fafafa] border border-gray-200 rounded-[22px] p-5 shadow-sm h-fit">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Curriculum
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {selectedCourse?.lectures?.length || 0} Lectures
              </p>
            </div>

            {/* Lectures */}
            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-300 text-left

                  ${
                    lecture.isPreviewFree
                      ? "bg-white hover:shadow-md border-gray-300"
                      : "bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed"
                  }

                  ${
                    selectedLecture?.lectureTitle === lecture?.lectureTitle
                      ? "border-black shadow-md"
                      : ""
                  }
                  `}
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[18px]
                      ${lecture.isPreviewFree ? "text-black" : "text-gray-400"}
                      `}
                    >
                      {lecture.isPreviewFree ? (
                        <FaPlayCircle />
                      ) : (
                        <MdOutlineLock />
                      )}
                    </span>

                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-800 leading-6">
                        {lecture?.lectureTitle}
                      </h3>

                      <p className="text-xs text-gray-500 mt-[2px]">
                        Lecture {index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div>
                    {lecture.isPreviewFree ? (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Free
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white w-full h-full p-5 rounded-[22px] shadow-lg border border-gray-200">
            <div className="w-full h-[420px] rounded-[18px] overflow-hidden bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture?.videoUrl}
                  controls
                />
              ) : (
                <span className="text-white text-sm">
                  Select a preview lecture to watch
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Write a Review
          </h2>

          <div className="bg-[#fafafa] border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className="text-[24px] cursor-pointer text-gray-300 hover:text-yellow-400 transition-all duration-200"
                />
              ))}
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black resize-none text-sm"
              placeholder="Write your review here..."
              rows={5}
            />

            <button className="mt-4 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300">
              Submit Review
            </button>
          </div>
        </div>

        {/* Creator Information */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Course Instructor
          </h2>

          <div className="flex items-start gap-4 bg-[#fafafa] border border-gray-200 rounded-2xl p-5 shadow-sm">
            <img
              src={selectedCourse?.creator?.photoUrl || img}
              alt=""
              className="w-20 h-20 rounded-full object-cover border"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCourse?.creator?.name || "Unknown Creator"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {selectedCourse?.creator?.email || "No Email"}
              </p>

              <p className="text-sm text-gray-600 leading-6 mt-3">
                {selectedCourse?.creator?.description ||
                  "Experienced instructor passionate about teaching students."}
              </p>
            </div>
          </div>
        </div>

        <div className="py-6">
          <p className="text-xl font-semibold mb-2">Other Popular Courses</p>
        </div>

        <div className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 ">
          {creatorCourse && creatorCourse.length > 0 ? (
            creatorCourse.map((course) => {
              console.log("Rendering course:", course);
              return (
                <div key={course._id} className="w-[280px]">
                  <Card
                    thumbnail={course.thumbnail}
                    title={course.title}
                    category={course.category}
                    price={course.price}
                    id={course._id}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">
              No other courses found. creatorCourse:{" "}
              {JSON.stringify(creatorCourse)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
