import { FaArrowLeft, FaEdit, FaEye, FaEyeSlash, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchBlogCoursesByCategory, createBlogCourse, togglePublishBlogCourse, deleteBlogCourse } from "../../redux/slices/blogSlice";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";

const BlogSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const { courses, loading } = useSelector(state => state.blog);
  const { isDark } = useTheme();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBlogCoursesByCategory(categoryId));
    }
  }, [dispatch, categoryId]);

  const handleTogglePublish = async (courseId) => {
    try {
      await dispatch(togglePublishBlogCourse(courseId)).unwrap();
      toast.success("Subject status updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update subject status");
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await dispatch(deleteBlogCourse(courseId)).unwrap();
        toast.success("Subject deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete subject");
      }
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBlogCourse({
        blogCategoryId: categoryId,
        courseData: formData,
      })).unwrap();
      toast.success("Subject created successfully");
      setShowCreateModal(false);
      setFormData({ name: "", slug: "", description: "" });
    } catch (error) {
      toast.error(error || "Failed to create subject");
    }
  };

  const handleEditSubject = (courseId) => {
    navigate(`/educator/blog-topics/${courseId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
                My Subjects
              </h1>

              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage and edit your created subjects
              </p>
            </div>
          </div>

          {/* Right */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md w-full md:w-auto"
          >
            Create Subject
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
                    Subject
                  </th>

                  <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Slug
                  </th>

                  <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Topics
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
                {courses?.length > 0 ? (
                  courses?.map((course, index) => (

                  <tr key={index} className={`border-t ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition`}>

                    {/* Subject */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">

                        <div className={`w-12 h-12 rounded-xl border overflow-hidden flex items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                          <span className="text-2xl">📚</span>
                        </div>

                        <div>
                          <h2 className={`font-semibold text-[16px] ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            {course.name}
                          </h2>

                          {course.description && (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className={`px-6 py-5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {course.slug}
                    </td>

                    {/* Topics Count */}
                    <td className={`px-6 py-5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {course.blogModels?.length || 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleTogglePublish(course._id)}
                          className={`w-10 h-10 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-black hover:text-white text-gray-700'}`}
                          title={course.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {course.isPublished ? <FaEyeSlash className="text-[15px]" /> : <FaEye className="text-[15px]" />}
                        </button>

                        <button 
                          onClick={() => handleEditSubject(course._id)}
                          className={`w-10 h-10 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-black hover:text-white text-gray-700'}`}
                          title="Edit Topics"
                        >
                          <FaEdit className="text-[15px]" />
                        </button>

                        <button 
                          onClick={() => handleDelete(course._id)}
                          className={`w-10 h-10 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                          title="Delete"
                        >
                          <FaTrash className="text-[15px]" />
                        </button>
                      </div>
                    </td>

                    
                    
                  </tr>
                ))
                ) : (
                  <tr>
                    <td colSpan="5" className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {loading ? 'Loading...' : 'No subjects found. Create your first subject!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className={`text-center py-6 border-t ${isDark ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              A list of your created subjects.
            </p>
          </div>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden space-y-4">
          {courses?.map((course, index) => (
            <div key={index} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-4`}>
              {/* Top */}
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                  <span className="text-3xl">📚</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className={`font-bold text-[16px] line-clamp-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {course.name}
                  </h2>

                  {course.description && (
                    <p className={`text-sm line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {course.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {/* Topics Count */}
                    <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {course.blogModels?.length || 0} Topics
                    </h3>

                    {/* Status */}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
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
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTogglePublish(course._id)}
                    className={`w-9 h-9 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    title={course.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {course.isPublished ? <FaEyeSlash className="text-[14px]" /> : <FaEye className="text-[14px]" />}
                  </button>

                  <button 
                    onClick={() => handleEditSubject(course._id)}
                    className={`w-9 h-9 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    title="Edit"
                  >
                    <FaEdit className="text-[14px]" />
                  </button>

                  <button 
                    onClick={() => handleDelete(course._id)}
                    className={`w-9 h-9 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                    title="Delete"
                  >
                    <FaTrash className="text-[14px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Footer */}
          {!courses?.length && !loading && (
            <div className="text-center py-4">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Your subjects will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 w-full max-w-md`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Create Subject
            </h2>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="e.g., Node.js"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="e.g., node-js"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder="Brief description of the subject"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-black text-white hover:scale-105 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogSubjects;
