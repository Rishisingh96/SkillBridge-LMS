import React from "react";

const BlogHero = ({
  selectedCategory,
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

      <p
        className="
          text-gray-500
          dark:text-gray-400
        "
      >
        Explore tutorials, guides, and resources for {selectedCategory}
      </p>

    </div>
  );
};

export default BlogHero;