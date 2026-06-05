import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllBlogCategories, fetchBlogTopicById } from "../../redux/slices/blogSlice";
import BlogSidebar from "../../components/blog/BlogSidebar";
import BlogHero from "../../components/blog/BlogHero";
import BlogSectionCard from "../../components/blog/BlogSectionCard";
import BlogContent from "../../components/blog/BlogContent";

const BlogPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, selectedTopic } = useSelector((state) => state.blog);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBlogCategories());
  }, [dispatch]);

  // Flatten all courses (subjects) from all categories
  const allSubjects = categories?.flatMap(category => 
    category.blogCourses?.map(course => ({
      ...course,
      categoryName: category.name,
      categoryId: category._id
    })) || []
  ) || [];

  const handleSubjectClick = (subject) => {
    navigate(`/blogs/subject/${subject._id}`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCourse(null);
    setSelectedModel(null);
    // Auto-select first course and model
    if (category.blogCourses?.length > 0) {
      setSelectedCourse(category.blogCourses[0]);
      if (category.blogCourses[0].blogModels?.length > 0) {
        setSelectedModel(category.blogCourses[0].blogModels[0]);
        if (category.blogCourses[0].blogModels[0].blogTopics?.length > 0) {
          dispatch(fetchBlogTopicById(category.blogCourses[0].blogModels[0].blogTopics[0]._id));
        }
      }
    }
  };

  const handleCourseSelect = (course, model = null) => {
    setSelectedCourse(course);
    if (model) {
      setSelectedModel(model);
      if (model.blogTopics?.length > 0) {
        dispatch(fetchBlogTopicById(model.blogTopics[0]._id));
      }
    } else {
      setSelectedModel(null);
      if (course.blogModels?.length > 0) {
        setSelectedModel(course.blogModels[0]);
        if (course.blogModels[0].blogTopics?.length > 0) {
          dispatch(fetchBlogTopicById(course.blogModels[0].blogTopics[0]._id));
        }
      }
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    if (model.blogTopics?.length > 0) {
      dispatch(fetchBlogTopicById(model.blogTopics[0]._id));
    }
  };

  const handleTopicSelect = (topic) => {
    dispatch(fetchBlogTopicById(topic._id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617] flex">
      <BlogSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategorySelect}
        selectedCourse={selectedCourse}
        setSelectedCourse={handleCourseSelect}
        selectedModel={selectedModel}
        setSelectedModel={handleModelSelect}
        selectedTopic={selectedTopic}
        setSelectedTopic={handleTopicSelect}
        blogCategories={categories}
      />

      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : (
          <>
            <BlogHero selectedCategory="All Subjects" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allSubjects.map((subject) => (
                <div
                  key={subject._id}
                  onClick={() => handleSubjectClick(subject)}
                  className="
                    rounded-2xl
                    bg-white
                    dark:bg-[#0F172A]
                    border
                    border-gray-200
                    dark:border-white/10
                    p-5
                    hover:border-violet-500
                    dark:hover:border-violet-500
                    hover:shadow-lg
                    transition-all
                    cursor-pointer
                    flex
                    flex-col
                    items-center
                    text-center
                  "
                >
                  <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="font-bold text-lg dark:text-white mb-1">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {subject.categoryName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>📦 {subject.blogModels?.length || 0} Modules</span>
                  </div>
                </div>
              ))}
            </div>

            {allSubjects.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No subjects found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPanel;