import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { createBlogCategory } from "../../redux/slices/blogSlice";
import {
  MdOutlineArticle,
  MdCategory,
  MdAutoAwesome,
} from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { loading, error } = useSelector((state) => state.blog);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [name]);

  const handleCreateBlog = (e) => {
    e.preventDefault();
    
    if (!name || !slug) {
      toast.error("Name and slug are required");
      return;
    }

    dispatch(
      createBlogCategory({
        name,
        slug,
        description,
        icon,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Blog category created successfully!");
        navigate("/educator/blogs");
      } else {
        toast.error(result.payload || "Failed to create blog category");
      }
    });
  };

  return (
    <>
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f7fb]'} px-4 py-8 md:py-12 flex items-center justify-center`}>

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
                <MdOutlineArticle className="text-5xl" />
              </div>

              <h1 className="text-4xl font-bold mt-8 leading-tight">
                Create Your
                <br />
                New Blog
              </h1>

              <p className="text-gray-300 mt-5 leading-relaxed max-w-md">
                Share your knowledge and expertise with students around the world. 
                Start your blogging journey today.
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
                <h3 className="font-semibold">Professional Blog Design</h3>
                <p className="text-sm text-gray-300">
                  Modern and clean reading experience
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
                  Organize your blogs professionally
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
              Create Blog Category
            </h2>

            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Fill the details below to create your new blog category.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleCreateBlog}>

            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Category Name
              </label>

              <input
                type="text"
                id="name"
                placeholder="Enter category name (e.g., Web Development)"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Slug
              </label>

              <input
                type="text"
                id="slug"
                placeholder="URL-friendly slug (auto-generated)"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {/* Icon */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Icon (Optional)
              </label>

              <input
                type="text"
                id="icon"
                placeholder="Enter icon name or emoji (e.g., 💻 or code)"
                className={`w-full border rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-black transition ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter a brief description of this blog category"
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
              >
                {loading ? "Creating..." : "Create Blog Category"}
              </button>

            </div>
          </form>

          {/* Footer */}
          <p className={`text-sm text-center mt-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Your blog category can be edited anytime after creation.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateBlog;
