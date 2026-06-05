import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCreatorBlogCategories } from "../../redux/slices/blogSlice";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const EditBlogCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const { creatorCategories } = useSelector(state => state.blog);
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  const category = creatorCategories?.find(cat => cat._id === categoryId);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        icon: category.icon || "",
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/blog/category/${categoryId}`,
        formData,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success("Category updated successfully");
        dispatch(fetchCreatorBlogCategories());
        navigate("/educator/my-blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!category) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f6fa]'} flex items-center justify-center`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f6fa]'} px-3 md:px-8 py-4 md:py-6`}>

        {/* Top Header */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6 md:mb-8">

          {/* Left */}
          <div className="flex items-start gap-4">

            <button
              onClick={() => navigate("/educator/my-blogs")}
              className={`min-w-[42px] h-[42px] rounded-full shadow flex items-center justify-center transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
            >
              <FaArrowLeft className="text-[17px]" />
            </button>

            <div>
              <h1 className={`text-[22px] md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                Edit Blog Category
              </h1>

              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Update your blog category details
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-6 md:p-8`}>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="e.g., Web Development"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="e.g., web-development"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="e.g., 💻"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="Brief description of the category"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/educator/my-blogs")}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl font-medium bg-black text-white hover:scale-105 transition"
                >
                  Update Category
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default EditBlogCategory;
