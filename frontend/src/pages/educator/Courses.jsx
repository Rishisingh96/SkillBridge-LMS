import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import empty from "../../assets/empty.png";
import { fetchCreatorCourses } from "../../redux/slices/courseSlice";


const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector(state => state.course);
  const [visibleDescriptions, setVisibleDescriptions] = useState({});

  useEffect(() => {
    // dispatch(getCreatorCourses());
    // ✅ Ye karo
     dispatch(fetchCreatorCourses());
  }, [dispatch]);

  const toggleDescription = (courseId) => {
    setVisibleDescriptions(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-3 md:px-8 py-4 md:py-6">

      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6 md:mb-8">

        {/* Left */}
        <div className="flex items-start gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="min-w-[42px] h-[42px] rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaArrowLeftLong className="text-[17px] text-gray-700" />
          </button>

          <div>
            <h1 className="text-[22px] md:text-3xl font-bold text-gray-800 leading-tight">
              All Created Courses
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and edit your created courses
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={() => navigate("/create-course")}
          className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:scale-105 transition duration-200 shadow-md w-full md:w-auto"
        >
          Create Course
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">

            {/* Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-700 font-semibold px-6 py-5">
                  Courses
                </th>

                <th className="text-left text-gray-700 font-semibold px-6 py-5">
                  Price
                </th>

                <th className="text-left text-gray-700 font-semibold px-6 py-5">
                  Status
                </th>

                <th className="text-left text-gray-700 font-semibold px-6 py-5">
                  Action
                </th>
                
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {creatorCourseData?.length > 0 ? (
                creatorCourseData?.map((course, index) => (

                <tr key={index} className="border-t hover:bg-gray-50 transition">

                  {/* Course */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
                           {course?.thumbnail ? <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover" /> : <img src={empty} alt="Course Thumbnail" className="w-full h-full object-cover" />}
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-800 text-[16px]">
                          {course.title}
                        </h2>

                      
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-5 font-medium text-gray-700">
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
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-black hover:text-white transition flex items-center justify-center"
                    >
                      <FaEdit className="text-[15px]" />
                    </button>
                  </td>

                  
                  
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            A list of your recent created courses.
          </p>
        </div>
      </div>

      {/* Mobile Responsive LMS Cards */}
      <div className="md:hidden space-y-4">
        {creatorCourseData?.map((course, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            {/* Top */}
            <div className="flex gap-4">
              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                {course?.thumbnail ? (
                  <img src={course.thumbnail} alt="Course" className="w-full h-full object-cover" />
                ) : (
                  <img src={empty} alt="Course" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-800 text-[16px] line-clamp-1">
                  {course.title}
                </h2>

               

                <div className="flex items-center justify-between mt-4">
                  {/* Price */}
                  <h3 className="font-semibold text-gray-700">
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
            <div className="flex items-center justify-between mt-5 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-400">
                  Last Updated
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <button 
                onClick={() => navigate(`/edit-course/${course._id}`)}
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
            <p className="text-sm text-gray-500">
              Your created courses will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;