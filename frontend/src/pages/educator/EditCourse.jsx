import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { LuImagePlus } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import empty from "../../assets/empty.png";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const fileInputRef = useRef(null);
  const { isDark } = useTheme();

  const [isPublished, setIsPublished] = useState(false);

  const [selectCourse, setSelectCourse] = useState(null);

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  // Thumbnail
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const [validityValue, setValidityValue] = useState(6);
  const [validityUnit, setValidityUnit] = useState("month");

  // Thumbnail Change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setThumbnailFile(file);

    const imageUrl = URL.createObjectURL(file);

    setThumbnail(imageUrl);
  };


  // Get Course By Id
  const getCourseById = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        {
          withCredentials: true,
        }
      );

      // console.log(result.data);

      // IMPORTANT
      const course = result.data.course || result.data;

      setTitle(course.title || "");
      setSubTitle(course.subTitle || "");
      setDescription(course.description || "");
      setCategory(course.category || "");
      setLevel(course.level || "");
      setPrice(course.price || "");
      setIsPublished(course.isPublished || false);
      setSelectCourse(result.data)
      setValidityValue(course.validity?.value || 6);
      setValidityUnit(course.validity?.unit || "month");

      console.log(result.data)

      if (course.thumbnail) {
        setThumbnail(course.thumbnail);
      }

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch course details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto Convert Validity
const getFormattedValidity = () => {

  let value = Number(validityValue);
  let unit = validityUnit;

  // 12+ months => convert to years
  if (unit === "month" && value >= 12) {

    value = value / 12;

    // only whole years
    if (Number.isInteger(value)) {
      unit = "year";
    } else {
      value = validityValue;
    }

  }

  return { value, unit };

};

  useEffect(() => {
    getCourseById();
  }, []);

  
  // Update Course
  const handleUpdateCourse = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);


    // Validity
    const formattedValidity = getFormattedValidity();

    formData.append(
      "validity.value",
      formattedValidity.value
    );

    formData.append(
      "validity.unit",
      formattedValidity.unit
    );

    formData.append(
      "isPublished",
      isPublished
    );

    // Thumbnail
    if (thumbnailFile) {

      formData.append(
        "thumbnail",
        thumbnailFile
      );

    }

    const result = await axios.put(
      `${serverUrl}/api/course/editcourse/${courseId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Course updated successfully");

    navigate("/educator/courses");

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update course"
    );

  } finally {

    setLoading(false);

  }

};

  // handle remove course
  const handleRemoveCourse = async () => {
    setLoading1(true);

    try {
      const result = await axios.delete(serverUrl + `/api/course/remove/${courseId}`, { withCredentials: true })
      console.log(result.data)
      setLoading1(false)
      toast.success("Course Removed")
      navigate("/courses")
    } catch (error) {
      console.log(error)
      setLoading1(false)
      toast.success(error.response.data.message)
    }
  }

  return (
    <div className={`min-h-screen py-10 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-sm border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeft
            className={`text-xl cursor-pointer transition-all ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
            onClick={() => navigate("/educator/courses")}
          />

          <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Add Detail Information regarding the Course
          </h2>

          <div className="space-x-2 space-y-2">
            <button className="bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-all"
              onClick={() => navigate(`/educator/create-module/${selectCourse._id}`)}
            >
              Go to Module Page
            </button>
          </div>

        </div>

        {/* Publish Section */}
        <div className={`flex justify-between items-center mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex gap-3">

            <button
              type="button"
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${isPublished
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-green-600 text-white hover:bg-green-700"
                }`}
              onClick={() => setIsPublished(!isPublished)}
            >
              {isPublished
                ? "Unpublish Course"
                : "Publish Course"}
            </button>

            <button
              type="button"
              className={`px-5 py-2 rounded-lg transition-all font-medium text-sm ${isDark ? 'bg-red-900/50 text-red-400 border-red-800 hover:bg-red-600 hover:text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'}`}
              onClick={handleRemoveCourse}
            >
              Remove Course
            </button>
          </div>

          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Status: {isPublished ? "🟢 Live" : "⚪ Draft"}
          </span>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={handleUpdateCourse}
        >

          {/* Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Course Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced MERN Stack"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Subtitle
            </label>

            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Brief course subtitle"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>

            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write course description..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none resize-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Category */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full border rounded-xl py-3 px-3 focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="">Select Category</option>

                <option value="web-development">
                  Web Development
                </option>

                <option value="mobile-development">
                  Mobile Development
                </option>

                <option value="data-science">
                  Data Science
                </option>

                <option value="machine-learning">
                  Machine Learning
                </option>

                <option value="ui-ux-design">
                  UI/UX Design
                </option>

                <option value="digital-marketing">
                  Digital-Marketing
                </option>

                <option value="ai-ml">
                  AI/ML
                </option>

                <option value="ethical-hacking">
                  Ethical Hacking
                </option>

                <option value="business">
                  Business
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Level
              </label>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`w-full border rounded-xl py-3 px-3 focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="">Select Level</option>

                <option value="beginner">
                  Beginner
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="advanced">
                  Advanced
                </option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Price
              </label>

              <div className="relative">
                <span className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ₹
                </span>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="499"
                  className={`w-full border rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </div>
          </div>

          {/* Validity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            {/* Validity Value */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Course Validity
              </label>

              <input
                type="number"
                value={validityValue}
                onChange={(e) => setValidityValue(e.target.value)}
                placeholder="6"
                className={`w-full border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
              />
            </div>

            {/* Validity Unit */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Validity Unit
              </label>

              <select
                value={validityUnit}
                onChange={(e) => setValidityUnit(e.target.value)}
                className={`w-full border rounded-xl py-3 px-3 focus:ring-2 focus:ring-black outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

          </div>

          {/* Thumbnail */}
          <div className="mt-8">
            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Course Thumbnail
            </label>

            <div
              className={`relative w-full md:w-72 h-44 border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all group ${isDark ? 'border-gray-700 hover:border-gray-500 bg-gray-800' : 'border-gray-300 hover:border-black bg-gray-50'}`}
              onClick={() => fileInputRef.current.click()}
            >

              {/* Thumbnail Image */}
              <img
                src={thumbnail || empty}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center">

                <LuImagePlus className="text-white text-3xl mb-2" />

                <p className="text-white text-sm font-medium">
                  Change Thumbnail
                </p>
              </div>

              {/* Small Icon */}
              <div className={`absolute top-3 right-3 p-2 rounded-full shadow-md ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                <LuImagePlus className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>

              {/* File Input */}
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className={`flex justify-end gap-4 pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-8 py-3 rounded-xl border font-semibold transition-all ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;