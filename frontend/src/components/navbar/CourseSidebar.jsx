import React from "react";
import { FiChevronRight } from "react-icons/fi";

const CourseSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div
      className="
        w-full
        lg:w-[280px]
        border-r
        border-gray-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        overflow-y-auto
      "
    >
      <div className="p-3 space-y-1">

        {categories.map((category) => {
          const active =
            selectedCategory?.title ===
            category.title;

          return (
            <button
              key={category.slug}
              onMouseEnter={() =>
                setSelectedCategory(category)
              }
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`
                group
                w-full
                flex
                items-center
                justify-between
                px-4
                py-4
                rounded-2xl
                text-left
                transition-all
                duration-300

                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-orange-50
                      to-orange-100
                      dark:from-orange-500/10
                      dark:to-orange-500/5
                      text-orange-600
                      dark:text-orange-400
                      shadow-sm
                    `
                    : `
                      text-gray-700
                      dark:text-gray-300
                      hover:bg-gray-100
                      dark:hover:bg-slate-800
                    `
                }
              `}
            >

              {/* LEFT */}
              <div className="flex flex-col">

                <span className="font-semibold text-[15px]">
                  {category.title}
                </span>

                <span
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-500
                    mt-1
                  "
                >
                  {category.courses.length} Courses
                </span>

              </div>

              {/* RIGHT ICON */}
              <FiChevronRight
                className={`
                  text-lg
                  transition-transform
                  duration-300

                  ${
                    active
                      ? "translate-x-1"
                      : "group-hover:translate-x-1"
                  }
                `}
              />

            </button>
          );
        })}

      </div>
    </div>
  );
};

export default CourseSidebar;