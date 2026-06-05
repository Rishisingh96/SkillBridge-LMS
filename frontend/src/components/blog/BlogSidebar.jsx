import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

const BlogSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  selectedCategory,
  setSelectedCategory,
  selectedCourse,
  setSelectedCourse,
  selectedModel,
  setSelectedModel,
  selectedTopic,
  setSelectedTopic,
  blogCategories,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`
        ${
          sidebarOpen
            ? "w-[320px]"
            : "w-[90px]"
        }
        transition-all
        duration-300
        border-r
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-[#0F172A]
        p-5
      `}
    >

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        {sidebarOpen && (
          <div>

            <h1
              className="
                text-2xl
                font-black
                dark:text-white
              "
            >
              Blog Panel
            </h1>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Explore Categories
            </p>

          </div>
        )}

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="
            w-11
            h-11
            rounded-2xl
            bg-gray-100
            dark:bg-white/5
            flex
            items-center
            justify-center
          "
        >

          {sidebarOpen ? (
            <ChevronLeft />
          ) : (
            <ChevronRight />
          )}

        </button>

      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/")}
          className={`
            w-full
            flex
            items-center
            gap-4
            px-4
            py-4
            rounded-2xl
            font-semibold
            transition-all
            bg-gray-100
            dark:bg-white/5
            hover:bg-violet-100
            dark:hover:bg-violet-900/30
          `}
        >
          <Home className="text-violet-600 dark:text-violet-400" />
          {sidebarOpen && (
            <span className="text-gray-700 dark:text-gray-300">
              Home
            </span>
          )}
        </button>

        {blogCategories?.map(
          (category) => {

            return (
              <button
                key={category._id}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-4
                  px-4
                  py-4
                  rounded-2xl
                  font-semibold
                  transition-all
                  ${
                    selectedCategory?._id ===
                    category._id
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-white/5"
                  }
                `}
              >

                {category.icon && (
                  <span className="text-xl">
                    {category.icon}
                  </span>
                )}

                {sidebarOpen && (
                  <span>
                    {category.name}
                  </span>
                )}

              </button>
            );
          }
        )}

      </div>

      {/* Show Subjects (blogCourses) when category is selected */}
      {selectedCategory && sidebarOpen && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
            Subjects
          </p>
          {selectedCategory.blogCourses?.map((course) => (
            <button
              key={course._id}
              onClick={() => setSelectedCourse(course)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                transition-all
                ${
                  selectedCourse?._id === course._id
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                }
              `}
            >
              <span>{course.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Show Modules (blogModels) when course is selected */}
      {selectedCourse && sidebarOpen && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
            Modules
          </p>
          {selectedCourse.blogModels?.map((model, index) => (
            <button
              key={model._id}
              onClick={() => setSelectedModel(model)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                transition-all
                ${
                  selectedModel?._id === model._id
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                }
              `}
            >
              <span>Module {index + 1}: {model.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Show Topics when model is selected */}
      {selectedModel && sidebarOpen && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
            Topics
          </p>
          {selectedModel.blogTopics?.map((topic) => (
            <button
              key={topic._id}
              onClick={() => setSelectedTopic(topic)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                transition-all
                ${
                  selectedTopic?._id === topic._id
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                }
              `}
            >
              <span>{topic.title}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default BlogSidebar;