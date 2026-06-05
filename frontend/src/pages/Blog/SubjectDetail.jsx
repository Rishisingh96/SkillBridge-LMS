import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogTopicById } from "../../redux/slices/blogSlice";
import BlogSidebar from "../../components/blog/BlogSidebar";
import BlogHero from "../../components/blog/BlogHero";
import BlogContent from "../../components/blog/BlogContent";

const SubjectDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { categories, selectedTopic } = useSelector((state) => state.blog);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    // Find the course by ID from all categories
    if (categories.length > 0 && courseId) {
      for (const category of categories) {
        const course = category.blogCourses?.find(c => c._id === courseId);
        if (course) {
          setSelectedCategory(category);
          setSelectedCourse(course);
          // Auto-select first model if available
          if (course.blogModels?.length > 0) {
            setSelectedModel(course.blogModels[0]);
            // Auto-select first topic if available
            if (course.blogModels[0].blogTopics?.length > 0) {
              dispatch(fetchBlogTopicById(course.blogModels[0].blogTopics[0]._id));
            }
          }
          break;
        }
      }
    }
  }, [categories, courseId, dispatch]);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    if (model.blogTopics?.length > 0) {
      dispatch(fetchBlogTopicById(model.blogTopics[0]._id));
    }
  };

  const handleTopicSelect = (topic) => {
    dispatch(fetchBlogTopicById(topic._id));
  };

  const handleBackToSubjects = () => {
    navigate("/blogs");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617] flex">
      <BlogSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={() => {}}
        selectedCourse={selectedCourse}
        setSelectedCourse={() => {}}
        selectedModel={selectedModel}
        setSelectedModel={handleModelSelect}
        selectedTopic={selectedTopic}
        setSelectedTopic={handleTopicSelect}
        blogCategories={selectedCategory ? [selectedCategory] : []}
      />

      <div className="flex-1 p-8">
        {!selectedCourse ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Loading subject...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={handleBackToSubjects}
                className="text-violet-600 dark:text-violet-400 hover:underline mb-4"
              >
                ← Back to Subjects
              </button>
              <BlogHero 
                selectedCategory={selectedCategory?.name} 
                selectedCourse={selectedCourse?.name}
                selectedModel={selectedModel?.title}
              />
            </div>

            {selectedTopic ? (
              <BlogContent topic={selectedTopic} />
            ) : selectedModel ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Select a topic to view content</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No modules available for this subject</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
