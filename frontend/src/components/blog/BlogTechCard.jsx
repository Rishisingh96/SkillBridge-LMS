import React from "react";

import {
  ChevronRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

const BlogTechCard = ({
  item,
  categorySlug,
}) => {

  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(
          `/blogs/${categorySlug}/${item.slug}`
        )
      }
      className="
        flex
        items-center
        justify-between
        px-5
        py-4
        rounded-2xl
        bg-gray-100
        dark:bg-white/5
        hover:bg-gradient-to-r
        hover:from-violet-600
        hover:to-indigo-500
        hover:text-white
        transition-all
        cursor-pointer
      "
    >

      <div>

        <h3 className="font-semibold">
          {item.name}
        </h3>

        <p
          className="
            text-sm
            opacity-70
            mt-1
          "
        >
          Read tutorials about{" "}
          {item.name}
        </p>

      </div>

      <ChevronRight />

    </div>
  );
};

export default BlogTechCard;