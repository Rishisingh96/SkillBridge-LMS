import React, { useEffect, useMemo, useState } from "react";
import Nav from "../../components/navbar/Navbar";
import { FaArrowLeft } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublishedCourses } from "../../redux/slices/courseSlice";
import Card from "../../components/home/component/CourseCard";

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
  const location = useLocation();

  const { courseData, loading } = useSelector((state) => state.course);

  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch Courses and set selected category from navigation state
  useEffect(() => {
    dispatch(fetchPublishedCourses());
    
    // Check if a category was passed from navigation state
    if (location.state?.selectedCategory) {
      setCategory([location.state.selectedCategory]);
    }
  }, [dispatch, location.state]);

  // Toggle Category
  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Filter Courses
  const filteredCourses = useMemo(() => {
    let courses = [...(courseData || [])];

    if (category.length > 0) {
      courses = courses.filter((item) =>
        category.includes(item.category)
      );
    }

    if (search.trim()) {
      courses = courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return courses;
  }, [courseData, category, search]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7fb] dark:bg-[#050816] text-black dark:text-white transition-colors duration-300">
      {/* Background Blur */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full -z-10" />

      <Nav />

      <div className="flex flex-col lg:flex-row">
        
        {/* ================= Sidebar ================= */}

        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[340px] xl:w-[370px] 
          border-r border-white/10 
          bg-white/60 dark:bg-white/5 
          backdrop-blur-2xl 
          lg:min-h-screen 
          sticky top-0 z-20"
        >
          <div className="p-6 md:p-8">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 py-12 mt-3">
              <button
                onClick={() => navigate("/")}
                className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <FaArrowLeft className="text-lg" />
              </button>

              <div>
                <h2 className="text-2xl font-bold">
                  Explore Courses
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Discover premium learning paths
                </p>
              </div>
            </div>

           

            {/* Search */}
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search premium courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-5 pr-14 outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />

              <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-purple-500" />
            </div>

            {/* Categories */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-5">
                Categories
              </h3>

              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2">
                {categories.map((item, index) => {
                  const active = category.includes(item.value);

                  return (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      key={index}
                      onClick={() => toggleCategory(item.value)}
                      className={`group whitespace-nowrap lg:w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/30"
                          : "bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10"
                      }`}
                    >
                      <span className="font-medium text-sm md:text-base">
                        {item.label}
                      </span>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          active
                            ? "border-white bg-white"
                            : "border-gray-400"
                        }`}
                      >
                        {active && (
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* ================= Main Content ================= */}

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 md:py-10">
          
          {/* Hero Section */}
         

          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-10 mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                Available Courses
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {filteredCourses.length} courses found
              </p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-xl">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Trending Learning Paths 🚀
              </span>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[320px] rounded-3xl bg-white/60 dark:bg-white/5 animate-pulse border border-black/10 dark:border-white/10"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Course Grid */}
              {filteredCourses.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-7"
                >
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        thumbnail={course.thumbnail}
                        title={course.title}
                        category={course.category}
                        price={course.price}
                        id={course._id}
                        reviews={course.reviews}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                    <FiSearch className="text-4xl text-white" />
                  </div>

                  <h2 className="text-3xl font-bold mt-6">
                    No Courses Found
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mt-3 text-center max-w-md">
                    Try changing your search keywords or selecting different categories.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllCourses;