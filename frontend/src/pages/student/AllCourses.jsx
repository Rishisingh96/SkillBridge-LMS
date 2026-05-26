import React, { useEffect, useState } from "react";
import Nav from "../../components/common/Navbar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublishedCourses } from "../../redux/slices/courseSlice";
import Card from "../../components/course/Card";
import ai from "../../assets/ai.png";

// Categories
const categories = [
  { label: "Web Development", value: "web-development" },
  { label: "Mobile Development", value: "mobile-development" },
  { label: "Machine Learning", value: "machine-learning" },
  { label: "UI UX Design", value: "ui-ux-design" },
  { label: "Digital Marketing", value: "digital-marketing" },
  { label: "AI ML", value: "ai-ml" },
  { label: "Ethical Hacking", value: "ethical-hacking" },
  { label: "Business", value: "business" },
  { label: "Other", value: "other" },
];

const AllCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Data
  const { courseData } = useSelector((state) => state.course);

  // States
  const [category, setCategory] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch published courses on mount
  useEffect(() => {
    dispatch(fetchPublishedCourses());
  }, [dispatch]);

  // Toggle Category
  const toggleCategory = (e) => {
    const value = e.target.value;

    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // Apply Filter
  const applyFilter = () => {
    let courseCopy = [...courseData];

    // Category Filter
    if (category.length > 0) {
      courseCopy = courseCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    // Search Filter
    if (search.trim() !== "") {
      courseCopy = courseCopy.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilterCourse(courseCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, courseData]);

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Nav />

      <div className="flex flex-col md:flex-row">
        {/* ================= Sidebar ================= */}

        <aside className="w-full md:w-[360px] lg:w-[380px] bg-black text-white md:min-h-screen md:sticky md:top-0 py-16 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-10 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="text-white hover:text-purple-400 transition duration-300"
            >
              <FaArrowLeftLong className="text-2xl" />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Filter by Category
            </h2>
          </div>

          {/* Filter Box */}
          <div className="mx-4 mb-6 bg-gradient-to-b from-gray-700 to-gray-800 p-5 rounded-3xl border border-gray-600 shadow-2xl">
            
            {/* AI Search Button */}
            <button className="w-full mb-6 bg-black border border-purple-500 hover:border-purple-400 rounded-2xl px-4 py-4 flex items-center justify-between transition-all duration-300 group shadow-lg hover:shadow-purple-500/20">
              
              <div className="flex items-center gap-3">
                {/* AI Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                  <img
                    src={ai}
                    alt="AI"
                    className="w-6 h-6 object-contain"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold text-white">
                    Search with AI
                  </span>

                  <span className="text-sm text-gray-400">
                    Smart course discovery
                  </span>
                </div>
              </div>

              <FiSearch className="text-purple-400 text-2xl group-hover:scale-110 transition" />
            </button>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/70 border border-gray-600 rounded-2xl py-4 pl-5 pr-12 text-base outline-none focus:border-purple-500 text-white placeholder:text-gray-400"
              />

              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl" />
            </div>

            {/* ================= Desktop Categories ================= */}

            <div className="hidden md:flex flex-col space-y-4">
              {categories.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-4 cursor-pointer border rounded-2xl px-4 py-4 transition-all duration-300 ${
                    category.includes(item.value)
                      ? "bg-purple-500/20 border-purple-500"
                      : "bg-black/30 border-gray-700 hover:bg-purple-500/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={item.value}
                    checked={category.includes(item.value)}
                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                    onChange={toggleCategory}
                  />

                  <span className="text-base font-medium text-gray-200">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {/* ================= Mobile Categories ================= */}

            <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-full border cursor-pointer transition-all ${
                    category.includes(item.value)
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-black border-gray-600 text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={item.value}
                    checked={category.includes(item.value)}
                    className="hidden"
                    onChange={toggleCategory}
                  />

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= Main Content ================= */}

        <div className="flex-1 px-6 sm:px-8 lg:px-12 py-10 md:py-12 overflow-hidden">
          
          {/* Heading */}
          <div className="mb-10 md:mb-12 mt-2 py-10 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl text-center text-white shadow-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Explore Courses
            </h1>

            <p className="text-gray-800 mt-3 text-base sm:text-lg">
              Learn trending skills and grow your career with modern
              industry-ready courses.
            </p>
          </div>

          {/* ================= Course Grid ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filterCourse?.length > 0 ? (
              filterCourse.map((course, index) => (
                <Card
                  key={index}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  reviews={course.reviews}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-[300px]">
                <h1 className="text-2xl font-bold text-gray-500">
                  No Courses Found
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;