import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  MdOutlineSchool,
  MdCategory,
  MdAutoAwesome,
} from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


  const handleCreateCourse = async () =>{
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/course/create", 
        { title, category, description },
        { withCredentials: true }
      );
      console.log(result.data);
      setLoading(false);
      toast.success("Course created successfully");
      navigate("/courses");
    } catch (error) {
      toast.error("Failed to create course");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 md:py-12 flex items-center justify-center">
      
      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        
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
              <FaArrowLeftLong className="text-white text-[18px]" />
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
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <FaArrowLeftLong className="text-gray-700" />
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Create Course
            </h2>

            <p className="text-gray-500 mt-2">
              Fill the details below to create your new course.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title
              </label>

              <input
                type="text"
                id="title"
                placeholder="Enter your course title"
                className="w-full border border-gray-300 rounded-2xl py-3 px-5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Category
              </label>

              <select
                id="category"
                className="w-full border border-gray-300 rounded-2xl py-3 px-5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Description
              </label>  
              <textarea
                id="description"
                placeholder="Enter a brief description of your course"
                className="w-full border border-gray-300 rounded-2xl py-3 px-5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition resize-none h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>


            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-black text-white font-semibold hover:scale-[1.02] transition duration-200 shadow-lg disabled:opacity-70"
                disabled = {loading}
                onClick={handleCreateCourse}
              >
                {loading ? "Creating..." : "Create Course"}
              </button>

            </div>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-400 text-center mt-8">
            Your course can be edited anytime after creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;