import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchCourses,
  deleteCourse,
  toggleCoursePublish,
} from "../../redux/slices/adminSlice";

import CourseTable from "../../components/admin/CourseTable";

import {
  Search,
  BookOpen,
  RefreshCcw,
} from "lucide-react";

const ManageCourses = () => {
  const dispatch = useDispatch();

  const {
    courses,
    loading,
  } = useSelector((state) => state.admin);

  // ============================================
  // STATES
  // ============================================

  const [search, setSearch] = useState("");

  // ============================================
  // FETCH COURSES
  // ============================================

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // ============================================
  // FILTER COURSES
  // ============================================

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [courses, search]);

  // ============================================
  // DELETE COURSE
  // ============================================

  const handleDeleteCourse = (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      dispatch(deleteCourse(courseId));
    }
  };

  // ============================================
  // TOGGLE PUBLISH
  // ============================================

  const handleTogglePublish = (courseId) => {
    dispatch(toggleCoursePublish(courseId));
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h1 className="mt-4 text-2xl font-bold text-gray-700">
            Loading Courses...
          </h1>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ========================================= */}
      {/* PAGE HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Manage Courses
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all platform courses here
          </p>

        </div>

        {/* SEARCH */}

        <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-md w-full lg:w-[350px]">

          <Search className="text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none ml-3 text-gray-700"
          />

        </div>

      </div>

      {/* ========================================= */}
      {/* TOP STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* TOTAL COURSES */}

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Total Courses
              </p>

              <h2 className="text-4xl font-bold mt-2 text-gray-800">
                {courses.length}
              </h2>

            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">

              <BookOpen className="text-blue-600" />

            </div>

          </div>

        </div>

        {/* PUBLISHED */}

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Published Courses
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {
                  courses.filter(
                    (course) => course.isPublished
                  ).length
                }
              </h2>

            </div>

            <div className="bg-green-100 p-4 rounded-2xl">

              <RefreshCcw className="text-green-600" />

            </div>

          </div>

        </div>

        {/* UNPUBLISHED */}

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Unpublished Courses
              </p>

              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {
                  courses.filter(
                    (course) => !course.isPublished
                  ).length
                }
              </h2>

            </div>

            <div className="bg-red-100 p-4 rounded-2xl">

              <BookOpen className="text-red-600" />

            </div>

          </div>

        </div>

      </div>


      {/* COURSE TABLE */}
      <CourseTable
        courses={filteredCourses}
        onDelete={handleDeleteCourse}
        onTogglePublish={handleTogglePublish}
      />

   
      {/* EMPTY STATE */}
      {!loading && filteredCourses.length === 0 && (

        <div className="bg-white rounded-2xl shadow-md p-12 text-center mt-8">

          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt=""
            className="w-32 mx-auto mb-5 opacity-80"
          />

          <h2 className="text-3xl font-bold text-gray-700">
            No Courses Found
          </h2>

          <p className="text-gray-500 mt-3">
            Try searching with another keyword
          </p>

        </div>

      )}

    </div>
  );
};

export default ManageCourses;