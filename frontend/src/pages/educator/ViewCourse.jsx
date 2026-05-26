import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setModuleData } from "../../redux/slices/moduleSlice";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../../redux/slices/courseSlice";
import img from "../../assets/Empty.png";
import axios from "axios";
import { serverUrl } from "../../App";
import Card from "../../components/course/Card";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import ModuleList from "../../components/lecture/ModuleList";
import LecturePreview from "../../components/lecture/LecturePreview";

const ViewCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId } = useParams();

  const { userData } = useSelector((state) => state.user);
  const { moduleData } = useSelector((state) => state.module);
  const { courseData, selectedCourse } = useSelector((state) => state.course);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorCourse, setCreatorCourses] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

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
      }
    } catch (error) {
      console.log(error);
      setIsEnrolled(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchModules();
    checkEnrollment();
  }, [courseData, courseId, userData]);

  // Fetch Other Courses
  useEffect(() => {
    if (courseData?.length > 0) {
      const otherCourses = courseData
        .filter((course) => course._id !== courseId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setCreatorCourses(otherCourses);
    }
  }, [courseData, courseId]);

  // Handle Enrollment Payment
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
        description: "COURSE ENROLMENT PAYMENT",
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
            toast.error(error.response.data.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  // Handle Review
  const handleReview = async () => {
    setLoading(true);
    try {
      await axios.post(
        serverUrl + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true }
      );
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Avg Rating
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(selectedCourse?.reviews);


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
    <div className="min-h-screen bg-[#f4f4f5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-[22px] shadow-lg border border-gray-200 p-4 md:p-5">

        {/* Back Button */}
        <FaArrowLeftLong
          className="text-black text-[22px] cursor-pointer mb-5 hover:translate-x-[-4px] duration-300"
          onClick={() => navigate("/")}
        />

        {/* Course Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Thumbnail */}
          <div className="w-full lg:w-[52%]">
            <img
              src={selectedCourse?.thumbnail || img}
              alt=""
              className="w-full h-[240px] md:h-[320px] rounded-[18px] object-cover shadow-md"
            />
          </div>

          {/* Course Info */}
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
              </div>
              <span className="font-semibold text-gray-700 text-sm">
                {avgRating}
              </span>
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
                <p className="text-sm text-gray-700 font-medium">
                  {selectedCourse?.validity?.value}{" "}
                  {selectedCourse?.validity?.unit === "month"
                    ? selectedCourse?.validity?.value > 1
                      ? "Months Access"
                      : "Month Access"
                    : selectedCourse?.validity?.unit === "year"
                      ? selectedCourse?.validity?.value > 1
                        ? "Years Access"
                        : "Year Access"
                      : "Lifetime Access"}
                </p>
              </div>
            </div>

            {/* Enroll / Watch Button */}
            {!isEnrolled ? (
              <button
                onClick={() => handleEnroll(courseId)}
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
              >
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Enroll Now
                </span>
                <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
              </button>
            ) : (
              <button
                onClick={() => navigate(`/viewlecture/${courseId}`)}
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
              >
                <span className="relative z-10 flex items-center gap-2">
                  ▶ Watch Now
                </span>
                <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
              </button>
            )}
          </div>
        </div>

        {/* Curriculum + Preview */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 items-start">

          {/* LEFT — Module List */}
          <div className="bg-[#fafafa] border border-gray-200 rounded-[22px] p-5 shadow-sm h-fit">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Curriculum
              </h2>

            </div>

            <ModuleList
              moduleData={moduleData}
              selectedLecture={selectedLecture}
              onSelectLecture={setSelectedLecture}
              mode="preview"
            />
          </div>

          {/* RIGHT — Lecture Preview */}
          <LecturePreview lecture={selectedLecture} />

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
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${star <= rating ? "fill-amber-300" : "fill-gray-300"
                    }`}
                />
              ))}
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black resize-none text-sm"
              placeholder="Write your review here..."
              rows={5}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />

            <button
              className="mt-4 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
              onClick={handleReview}
              disabled={loading}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Submit Review"}
            </button>
          </div>
        </div>

        {/* Course Instructor */}
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

        {/* Other Popular Courses */}
        <div className="py-6">
          <p className="text-xl font-semibold mb-2">Other Popular Courses</p>
        </div>

        <div className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6">
          {creatorCourse && creatorCourse.length > 0 ? (
            creatorCourse.map((course) => (
              <div key={course._id} className="w-[280px]">
                <Card
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No other courses found.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewCourse;