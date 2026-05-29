import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { createCourse } from "../../redux/actions/courseAction";
import {
  MdOutlineSchool,
  MdCategory,
  MdAutoAwesome,
} from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import Nav from "../../components/navbar/Navbar";

const CreateCourse = () => {
  const navigate = useNavigate();
   const dispatch = useDispatch();
  const { isDark } = useTheme();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  // const [loading, setLoading] = useState(false);

  // ✅ loading ab Redux se aa raha hai, local state hataya
  const { loading } = useSelector((state) => state.course);

  const handleCreateCourse = () => {
    dispatch(createCourse({ title, category, description }, navigate));
  };


  return (
    <>
      <Nav />
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f7fb]'} px-4 py-8 md:py-12 pt-[90px] flex items-center justify-center`}>

      {/* Main Container */}
      <div className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-3xl shadow-xl overflow-hidden border`}>

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-between bg-black text-white p-10 relative overflow-hidden">

          {/* Glow */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 blur-3xl"></div>
          <div className="absolute w-72 h-72 bg-white/10 rounded-full bottom-0 right-0 blur-3xl"></div>

          {/* Top */}
          <div className="relative z-10">

            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <FaArrowLeft className="text-white text-[18px]" />
            </button>

            <div className="mt-12">

              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-lg">
                <MdOutlineSchool className="text-5xl" />
              </div>

              <h1 className="text-4xl font-bold mt-8 leading-tight">
                Create Your
                <br />
                New Course
              </h1>

              <p className="text-gray-300 mt-5 leading-relaxed max-w-md">
                Build engaging and professional courses for students around the
                world. Start your teaching journey today.
              </p>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="space-y-4 relative z-10">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <MdAutoAwesome className="text-2xl" />
              </div>

              <div>
                <h3 className="font-semibold">Professional LMS Design</h3>
                <p className="text-sm text-gray-300">
                  Modern and clean educator experience
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <MdCategory className="text-2xl" />
              </div>

              <div>
                <h3 className="font-semibold">Multiple Categories</h3>
                <p className="text-sm text-gray-300">
                  Organize your courses professionally
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-6 md:p-10 flex flex-col justify-center">

          {/* Mobile Back */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaArrowLeft />
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Create Course
            </h2>

            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Fill the details below to create your new course.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Course Title
              </label>

              <input
                type="text"
                id="title"
                placeholder="Enter your course title"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Course Category
              </label>

              <select
                id="category"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>

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

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Course Description
              </label>
              <textarea
                id="description"
                placeholder="Enter a brief description of your course"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition resize-none h-32 ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>


            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`w-full py-3 rounded-2xl border font-medium transition ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-black text-white font-semibold hover:scale-[1.02] transition duration-200 shadow-lg disabled:opacity-70"
                disabled={loading}
                onClick={handleCreateCourse}
              >
                {loading ? "Creating..." : "Create Course"}
              </button>

            </div>
          </form>

          {/* Footer */}
          <p className={`text-sm text-center mt-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Your course can be edited anytime after creation.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateCourse;