import React from "react";

const BlogHero = ({
  selectedCategory,
  selectedCourse,
  selectedModel,
}) => {

  return (
    <div
      className="
        mb-8
      "
    >

      <h1
        className="
          text-4xl
          font-black
          dark:text-white
          mb-2
        "
      >
        {selectedCategory}
      </h1>

      {(selectedCourse || selectedModel) && (
        <p
          className="
            text-gray-500
            dark:text-gray-400
          "
        >
          {selectedCourse && <span>{selectedCourse}</span>}
          {selectedCourse && selectedModel && <span> • </span>}
          {selectedModel && <span>{selectedModel}</span>}
        </p>
      )}

      {!selectedCourse && !selectedModel && (
        <p
          className="
            text-gray-500
            dark:text-gray-400
          "
        >
          Explore tutorials, guides, and resources for {selectedCategory}
        </p>
      )}

    </div>
  );
};

export default BlogHero;