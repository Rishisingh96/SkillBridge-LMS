import React from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BlogSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  selectedCategory,
  setSelectedCategory,
  blogCategories,
}) => {

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

        {Object.entries(
          blogCategories
        ).map(
          ([category, value]) => {

            const Icon =
              value.icon;

            return (
              <button
                key={category}
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
                    selectedCategory ===
                    category
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-white/5"
                  }
                `}
              >

                <Icon size={20} />

                {sidebarOpen && (
                  <span>
                    {category}
                  </span>
                )}

              </button>
            );
          }
        )}

      </div>

    </div>
  );
};

export default BlogSidebar;