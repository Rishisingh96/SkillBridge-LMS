import { FaArrowLeft } from "react-icons/fa6";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCreatorBlogCategories } from "../../redux/slices/blogSlice";
import { useTheme } from "../../context/ThemeContext";

const MyBlogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCategories, loading } = useSelector(state => state.blog);
  const { userData } = useSelector(state => state.user);
  const { isDark } = useTheme();

  useEffect(() => {
    if (userData) {
      dispatch(fetchCreatorBlogCategories());
    }
  }, [dispatch, userData]);

  return (
    <>
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f6fa]'} px-3 md:px-8 py-4 md:py-6`}>

      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6 md:mb-8">

        {/* Left */}
        <div className="flex items-start gap-4">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className={`min-w-[42px] h-[42px] rounded-full shadow flex items-center justify-center transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
          >
            <FaArrowLeft className="text-[17px]" />
          </button>

          <div>
            <h1 className={`text-[22px] md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              My Blog Categories
            </h1>

            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and edit your created blog categories
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={() => navigate("/admin/create-blog")}
          className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md w-full md:w-auto"
        >
          Create Blog Category
        </button>
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block max-w-7xl mx-auto ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border overflow-hidden`}>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">

            {/* Header */}
            <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </th>

                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Slug
                </th>

                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Courses
                </th>

                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>

                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Action
                </th>
                
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {creatorCategories?.length > 0 ? (
                creatorCategories?.map((category, index) => (

                <tr key={index} className={`border-t ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition`}>

                  {/* Category */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className={`w-12 h-12 rounded-xl border overflow-hidden flex items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                        {category.icon ? (
                          <span className="text-2xl">{category.icon}</span>
                        ) : (
                          <span className="text-2xl">📝</span>
                        )}
                      </div>

                      <div>
                        <h2 className={`font-semibold text-[16px] ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {category.name}
                        </h2>

                        {category.description && (
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className={`px-6 py-5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.slug}
                  </td>

                  {/* Courses Count */}
                  <td className={`px-6 py-5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.blogCourses?.length || 0}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                      category.isPublished 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {category.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => navigate(`/blogs/${category.slug}`)}
                      className={`w-10 h-10 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-black hover:text-white text-gray-700'}`}
                    >
                      <FaEye className="text-[15px]" />
                    </button>
                  </td>

                  
                  
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {loading ? 'Loading...' : 'No blog categories found. Create your first blog category!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`text-center py-6 border-t ${isDark ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            A list of your created blog categories.
          </p>
        </div>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="md:hidden space-y-4">
        {creatorCategories?.map((category, index) => (
          <div key={index} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-4`}>
            {/* Top */}
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                {category.icon ? (
                  <span className="text-3xl">{category.icon}</span>
                ) : (
                  <span className="text-3xl">📝</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className={`font-bold text-[16px] line-clamp-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {category.name}
                </h2>

                {category.description && (
                  <p className={`text-sm line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  {/* Courses Count */}
                  <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.blogCourses?.length || 0} Courses
                  </h3>

                  {/* Status */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    category.isPublished 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-pink-100 text-pink-700'
                  }`}>
                    {category.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className={`flex items-center justify-between mt-5 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Created
                </p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button 
                onClick={() => navigate(`/blogs/${category.slug}`)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition"
              >
                <FaEye />
                View
              </button>
            </div>
          </div>
        ))}

        {/* Empty Footer */}
        {!creatorCategories?.length && !loading && (
          <div className="text-center py-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your blog categories will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MyBlogs;
