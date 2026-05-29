import React from "react";

import {
  useParams,
} from "react-router-dom";

const CategoryBlog = () => {

  const { category } =
    useParams();

  return (
    <div
      className="
        min-h-screen
        p-10
        bg-gray-100
        dark:bg-[#020617]
      "
    >

      <h1
        className="
          text-5xl
          font-black
          dark:text-white
        "
      >
        {category}
      </h1>

      <p
        className="
          mt-4
          text-gray-500
        "
      >
        Category Page
      </p>

    </div>
  );
};

export default CategoryBlog;