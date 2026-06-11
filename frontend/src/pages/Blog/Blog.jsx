import React from "react";
import SEO from "../../components/seo/SEO";
import { blogPostSchema } from "../../components/seo/SchemaData";

import {
  useParams,
} from "react-router-dom";

const Blog = () => {

  const {
    category,
    slug,
  } = useParams();

  return (
    <>
      <SEO
        title={`${category} - SkillBridge LMS Blog`}
        description="Read the latest articles and insights from SkillBridge LMS experts."
        keywords="blog, articles, education, learning, skill development"
        schema={blogPostSchema({
          title: `${category} - Blog`,
          description: "Read the latest articles and insights from SkillBridge LMS experts.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })}
      />
      <div
        className="
          min-h-screen
          bg-gray-100
          dark:bg-[#020617]
          p-10
        "
      >

      <div
        className="
          max-w-5xl
          mx-auto
          rounded-[35px]
          bg-white
          dark:bg-[#0F172A]
          p-10
          border
          border-gray-200
          dark:border-white/10
        "
      >

        <span
          className="
            inline-block
            px-4
            py-2
            rounded-full
            bg-violet-100
            text-violet-700
            text-sm
            font-semibold
            mb-6
          "
        >
          {category}
        </span>

        <h1
          className="
            text-5xl
            font-black
            dark:text-white
          "
        >
          {slug}
        </h1>

        <p
          className="
            mt-6
            text-lg
            text-gray-600
            dark:text-gray-400
            leading-8
          "
        >
          This is the blog page for{" "}
          {slug}. Here you can add:
          tutorials, roadmap,
          markdown blogs, videos,
          code snippets, notes and
          documentation.
        </p>

      </div>

    </div>
    </>
  );
};

export default Blog;