import React from "react";

import {
  ChevronRight,
} from "lucide-react";

const BlogSectionCard = ({
  section,
  onCourseSelect,
}) => {

  return (
    <div
      onClick={() => onCourseSelect && onCourseSelect(section)}
      className="
        rounded-[30px]
        bg-white
        dark:bg-[#0F172A]
        border
        border-gray-200
        dark:border-white/10
        p-6
        hover:border-violet-500
        dark:hover:border-violet-500
        transition-all
        cursor-pointer
      "
    >

      <div className="flex items-start justify-between mb-4">
        <h2
          className="
            text-2xl
            font-bold
            dark:text-white
          "
        >
          {section.name || section.title}
        </h2>
        <ChevronRight className="text-violet-600" />
      </div>

      {section.description && (
        <p
          className="
            text-gray-600
            dark:text-gray-400
            mb-4
          "
        >
          {section.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>📚 {section.blogModels?.length || 0} Modules</span>
        {section.blogModels && section.blogModels.length > 0 && (
          <span>•</span>
        )}
        <span>
          {section.blogModels?.reduce((acc, model) => acc + (model.blogTopics?.length || 0), 0) || 0} Topics
        </span>
      </div>

    </div>
  );
};

export default BlogSectionCard;