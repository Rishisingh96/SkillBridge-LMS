import React from "react";

import {
  ChevronRight,
} from "lucide-react";

const BlogSectionCard = ({
  section,
}) => {

  return (
    <div
      className="
        rounded-[30px]
        bg-white
        dark:bg-[#0F172A]
        border
        border-gray-200
        dark:border-white/10
        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          dark:text-white
          mb-6
        "
      >
        {section.title}
      </h2>

      <div className="space-y-4">

        {section.items.map(
          (item, i) => (

            <div
              key={i}
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
          )
        )}

      </div>

    </div>
  );
};

export default BlogSectionCard;