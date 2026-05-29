import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaStar,
  FaPlay,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { serverUrl } from "../../App";
import { setModuleData } from "../../redux/slices/moduleSlice";
import { setSelectedCourse } from "../../redux/slices/courseSlice";

import ModuleList from "../../components/lecture/ModuleList";


import img from "../../assets/Empty.png";
import CheckoutPage from "../student/CheckoutPage";
import Nav from "../../components/navbar/Navbar";
import LecturePlayer from "../../components/lecture/LecturePlayer";
import { useTheme } from "../../context/ThemeContext";

const CourseDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId } = useParams();

  const { userData } = useSelector((state) => state.user);
  const { moduleData } = useSelector((state) => state.module);
  const { courseData, selectedCourse } = useSelector(
    (state) => state.course
  );

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorCourse, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // ---------------- FETCH COURSE ----------------

  useEffect(() => {
    if (!courseData?.length) return;

    const course = courseData.find((c) => c._id === courseId);

    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [courseData, courseId]);

  // ---------------- FETCH MODULES ----------------

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

  // ---------------- CHECK ENROLLMENT ----------------

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/check-enrollment/${courseId}`,
        { withCredentials: true }
      );

      // Always set enrollmentData to preserve status info (including expired status)
      setEnrollmentData(response.data);

      // Set isEnrolled based on active status only
      if (response.data.isEnrolled && response.data.isActive) {
        setIsEnrolled(true);
      } else {
        setIsEnrolled(false);
      }
    } catch (error) {
      console.log(error);
      setIsEnrolled(false);
      setEnrollmentData(null);
    }
  };

  useEffect(() => {
    fetchModules();
    checkEnrollment();
  }, [courseId, userData]);

  // ---------------- OTHER COURSES ----------------

  useEffect(() => {
    if (courseData?.length > 0) {
      const otherCourses = courseData
        .filter((course) => course._id !== courseId)
        .slice(0, 4);

      setCreatorCourses(otherCourses);
    }
  }, [courseData, courseId]);

  // ---------------- AUTO SELECT PREVIEW ----------------

  useEffect(() => {
    if (moduleData?.length > 0 && !selectedLecture) {
      for (const module of moduleData) {
        const freeLecture = module.lectures?.find((l) => l.isPreviewFree);

        if (freeLecture) {
          setSelectedLecture(freeLecture);
          break;
        }
      }
    }
  }, [moduleData]);

  // ---------------- AVG RATING ----------------

  const avgRating = useMemo(() => {
    if (!selectedCourse?.reviews?.length) return 0;

    const total = selectedCourse.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / selectedCourse.reviews.length).toFixed(1);
  }, [selectedCourse]);

  // ---------------- FORMAT DESCRIPTION ----------------

  const formatDescription = (description) => {
    if (!description) return null;

    // Split by newlines
    const lines = description.split('\n');
    
    // Detect module pattern: "Module X:" or "Module X" followed by content
    const moduleRegex = /^(Module\s+\d+[:\s]|Module\s+\d+\.)/i;
    
    const formattedContent = [];
    let currentModule = null;
    let currentContent = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (moduleRegex.test(trimmedLine)) {
        // Save previous module if exists
        if (currentModule) {
          formattedContent.push({
            type: 'module',
            title: currentModule,
            content: currentContent
          });
        }
        
        // Start new module
        currentModule = trimmedLine;
        currentContent = [];
      } else if (currentModule) {
        // Add to current module content
        if (trimmedLine) {
          currentContent.push(trimmedLine);
        }
      } else {
        // Regular content before any module
        if (trimmedLine) {
          formattedContent.push({
            type: 'text',
            content: trimmedLine
          });
        }
      }
    });

    // Don't forget the last module
    if (currentModule) {
      formattedContent.push({
        type: 'module',
        title: currentModule,
        content: currentContent
      });
    }

    return formattedContent;
  };

  const formattedDescription = useMemo(() => {
    return formatDescription(selectedCourse?.description);
  }, [selectedCourse]);

  // ---------------- ENROLL ----------------

  const handleEnroll = async (courseId) => {
    try {
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.order.amount,
        currency: "INR",
        name: "LEARN SKILLS",
        description: "COURSE ENROLLMENT",
        order_id: orderData.data.order.id,

        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              { ...response, courseId },
              { withCredentials: true }
            );

            setIsEnrolled(true);

            toast.success(verifyPayment.data.message);
          } catch (error) {
            toast.error(error.response?.data?.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  // ---------------- FREE ENROLL ----------------

  const handleFreeEnroll = async (courseId) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/course/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsEnrolled(true);

        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  // ---------------- REVIEW ----------------

  const handleReview = async () => {
    setLoading(true);

    try {
      await axios.post(
        serverUrl + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true }
      );

      toast.success("Review submitted");

      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${isDark
          ? "bg-[#050816] text-white"
          : "bg-[#f5f7fb] text-black"
        }`}
    >
      {/* ===================================================== */}
      {/* NAVBAR */}
      {/* ===================================================== */}

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
              onClick={() => navigate("/allcourses")}
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
              src={userData?.photoUrl || img}
              alt=""
              className="w-11 h-11 rounded-2xl object-cover border border-white/20"
            />
          </div>
        </div>
      </header>

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px]" />

          <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border ${isDark
                    ? "bg-white/10 border-white/10"
                    : "bg-white border-black/10"
                  }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium">
                  Premium Course Experience
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                {selectedCourse?.title || "Modern React Masterclass"}
              </h1>

              <p
                className={`mt-6 text-[16px] leading-8 max-w-2xl ${isDark ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                {selectedCourse?.subTitle ||
                  "Build production-ready modern applications with clean architecture, animations, APIs, and scalable frontend systems."}
              </p>

              {/* STATS */}
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />

                  <span className="font-bold">{avgRating}</span>

                  <span
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    Reviews
                  </span>
                </div>

                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  12+ Hours Content
                </div>

                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {enrollmentData?.daysRemaining !== undefined
                    ? `${enrollmentData.daysRemaining} Days Remaining`
                    : selectedCourse?.validity
                      ? `${selectedCourse.validity.value} ${selectedCourse.validity.unit} Access`
                      : "Lifetime Access"}
                </div>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-4 mt-8">
                <h2 className="text-5xl font-black">
                  ₹{selectedCourse?.price || 199}
                </h2>

                <span className="line-through text-gray-400 text-xl">
                  ₹599
                </span>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-10">
                {!isEnrolled ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (selectedCourse?.price === 0) {
                        handleFreeEnroll(courseId);
                      } else {
                        navigate(`/checkout/${courseId}`);
                      }
                    }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-2xl"
                  >
                    {enrollmentData?.status === "expired"
                      ? "Re-enroll Now"
                      : selectedCourse?.price === 0
                        ? "Enroll For Free"
                        : "Enroll Now"}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-2xl flex items-center gap-2"
                  >
                    <FaPlay />
                    Watch Course
                  </motion.button>
                )}

                <button
                  className={`px-8 py-4 rounded-2xl font-semibold border ${isDark
                      ? "bg-white/10 border-white/10 hover:bg-white/20"
                      : "bg-white border-black/10 hover:bg-black/5"
                    }`}
                >
                  Preview Course
                </button>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div
                className={`absolute inset-0 blur-3xl rounded-full ${isDark ? "bg-violet-500/20" : "bg-blue-500/20"
                  }`}
              />

              <div
                className={`relative overflow-hidden rounded-[32px] border backdrop-blur-2xl ${isDark
                    ? "bg-white/10 border-white/10"
                    : "bg-white/70 border-white"
                  }`}
              >
                <img
                  src={selectedCourse?.thumbnail || img}
                  alt=""
                  className="w-full h-[260px] md:h-[500px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CURRICULUM */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
         
          {/* LEFT */}
            <ModuleList
              moduleData={moduleData}
              selectedLecture={selectedLecture}
              onSelectLecture={setSelectedLecture}
              mode="preview"
              isEnrolled={isEnrolled}
            />

          {/* RIGHT */}
         
             <LecturePlayer lecture={selectedLecture} />

        </div>
      </section>

      {/* ===================================================== */}
      {/* REVIEW */}
      {/* ===================================================== */}

      {isEnrolled && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
          <div
            className={`rounded-[30px] border p-6 md:p-8 backdrop-blur-2xl ${isDark
                ? "bg-white/10 border-white/10"
                : "bg-white/70 border-black/10"
              }`}
          >
            <h2 className="text-3xl font-black mb-6">
              Write A Review
            </h2>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl transition-all ${star <= rating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-400"
                    }`}
                />
              ))}
            </div>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your premium learning experience..."
              className={`w-full rounded-3xl border p-5 outline-none resize-none ${isDark
                  ? "bg-white/5 border-white/10 placeholder:text-gray-500"
                  : "bg-white border-black/10"
                }`}
            />

            <button
              onClick={handleReview}
              disabled={loading}
              className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-xl"
            >
              {loading ? (
                <ClipLoader size={22} color="#fff" />
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </section>
      )}


      {/* ===================================================== */}
      {/* DESCRIPTION */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
        <div
          className={`rounded-[30px] border p-6 md:p-8 backdrop-blur-2xl ${isDark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-black/10"
            }`}
        >
          <h2 className="text-3xl font-black mb-6">
            Course Description
          </h2>

          <div className={`space-y-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {formattedDescription?.slice(0, showFullDescription ? formattedDescription.length : 2).map((item, index) => {
              if (item.type === 'text') {
                return (
                  <p key={index} className="leading-8">
                    {item.content}
                  </p>
                );
              } else if (item.type === 'module') {
                return (
                  <div key={index} className={`rounded-2xl p-5 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                    <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">
                      {item.title}
                    </h3>
                    <ul className="space-y-2 ml-4">
                      {item.content.map((contentItem, contentIndex) => (
                        <li key={contentIndex} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span className="leading-7">{contentItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {formattedDescription?.length > 2 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className={`mt-4 px-6 py-3 rounded-2xl font-semibold transition-all ${isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-black/5 hover:bg-black/10 text-black"
                }`}
            >
              {showFullDescription ? "Show Less" : "View All"}
            </button>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* INSTRUCTOR */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
        <div
          className={`rounded-[30px] border p-6 md:p-8 backdrop-blur-2xl ${isDark
              ? "bg-white/10 border-white/10"
              : "bg-white/70 border-black/10"
            }`}
        >
          <h2 className="text-3xl font-black mb-8">
            Meet Your Instructor
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={selectedCourse?.creator?.photoUrl || img}
              alt=""
              className="w-28 h-28 rounded-3xl object-cover"
            />

            <div>
              <h3 className="text-3xl font-black">
                {selectedCourse?.creator?.name || "Unknown"}
              </h3>

              <p
                className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {selectedCourse?.creator?.email}
              </p>

              <p
                className={`mt-5 leading-8 max-w-3xl ${isDark ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                {selectedCourse?.creator?.description ||
                  "Experienced instructor passionate about creating world-class learning experiences for developers."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* OTHER COURSES */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black">
            Other Popular Courses
          </h2>

          <button
            onClick={() => navigate("/allcourses")}
            className={`px-5 py-3 rounded-2xl text-sm font-semibold ${isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-black/5 hover:bg-black/10"
              }`}
          >
            View All
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {creatorCourse?.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/course/${course._id}`)}
              className={`overflow-hidden rounded-[28px] border cursor-pointer group backdrop-blur-2xl ${isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white/70 border-black/10"
                }`}
            >
              <div className="overflow-hidden">
                <img
                  src={course.thumbnail || img}
                  alt=""
                  className="w-full h-[220px] object-cover group-hover:scale-110 transition-all duration-700"
                />
              </div>

              <div className="p-5">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4 ${isDark
                      ? "bg-white/10 text-gray-300"
                      : "bg-black/5 text-gray-700"
                    }`}
                >
                  {course.category}
                </span>

                <h3 className="text-xl font-black line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mt-6">
                  <h4 className="text-2xl font-black">
                    ₹{course.price}
                  </h4>

                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaStar />

                    <span className="text-sm font-semibold text-white">
                      4.9
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;