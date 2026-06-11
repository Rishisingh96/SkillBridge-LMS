import { FaArrowLeft } from "react-icons/fa6";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import empty from "../../assets/Empty.png";
import { fetchCreatorCourses } from "../../redux/slices/courseSlice";
import { useTheme } from "../../context/ThemeContext";


const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const [visibleDescriptions, setVisibleDescriptions] = useState({});
  const { isDark } = useTheme();

  useEffect(() => {
    if (userData) {
      dispatch(fetchCreatorCourses());
    }
  }, [dispatch, userData]);

  const toggleDescription = (courseId) => {
    setVisibleDescriptions(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  return (
    <>
      <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-[#f5f6fa]'} px-3 md:px-8 py-4 md:py-6`}>

      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6 md:mb-8">

        {/* Left */}
        <div className="flex items-start gap-4">

          <button
            onClick={() => navigate("/")}
            className={`min-w-[42px] h-[42px] rounded-full shadow flex items-center justify-center transition ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
          >
            <FaArrowLeft className="text-[17px]" />
          </button>

          <div>
            <h1 className={`text-[22px] md:text-3xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              All Created Courses
            </h1>

            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and edit your created courses
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={() => navigate("/educator/create-course")}
          className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md w-full md:w-auto"
        >
          Create Course
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
                  Courses
                </th>

                <th className={`text-left font-semibold px-6 py-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Price
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
              {creatorCourseData?.length > 0 ? (
                creatorCourseData?.map((course, index) => (

                <tr key={index} className={`border-t ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition`}>

                  {/* Course */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className={`w-16 h-16 rounded-xl border overflow-hidden ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                           {course?.thumbnail ? <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover" /> : <img src={empty} alt="Course Thumbnail" className="w-full h-full object-cover" />}
                      </div>

                      <div>
                        <h2 className={`font-semibold text-[16px] ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {course.title}
                        </h2>

                      
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className={`px-6 py-5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {course?.price ? `₹${course.price}` : '₹ NA'}
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
                    <button 
                      onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                      className={`w-10 h-10 rounded-lg transition flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-black hover:text-white text-gray-700'}`}
                    >
                      <FaEdit className="text-[15px]" />
                    </button>
                  </td>

                  
                  
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`text-center py-6 border-t ${isDark ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            A list of your recent created courses.
          </p>
        </div>
      </div>

      {/* Mobile Responsive LMS Cards */}
      <div className="md:hidden space-y-4">
        {creatorCourseData?.map((course, index) => (
          <div key={index} className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-sm border p-4`}>
            {/* Top */}
            <div className="flex gap-4">
              {/* Image */}
              <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                {course?.thumbnail ? (
                  <img src={course.thumbnail} alt="Course" className="w-full h-full object-cover" />
                ) : (
                  <img src={empty} alt="Course" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className={`font-bold text-[16px] line-clamp-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {course.title}
                </h2>

               

                <div className="flex items-center justify-between mt-4">
                  {/* Price */}
                  <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {course?.price ? `₹${course.price}` : '₹ NA'}
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
                  Last Updated
                </p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <button 
                onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition"
              >
                <FaEdit />
                Edit Course
              </button>
            </div>
          </div>
        ))}

        {/* Empty Footer */}
        {!creatorCourseData?.length && (
          <div className="text-center py-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your created courses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Courses;