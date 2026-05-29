import React, { useState } from "react";

import BlogSidebar from "../../components/blog/BlogSidebar";

import BlogHero from "../../components/blog/BlogHero";

import BlogSectionCard from "../../components/blog/BlogSectionCard";

import { blogCategories } from "./blogData";

const BlogPanel = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("Web Development");

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        dark:bg-[#020617]
        flex
      "
    >

      <BlogSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
        blogCategories={
          blogCategories
        }
      />

      <div className="flex-1 p-8">

        <BlogHero
          selectedCategory={
            selectedCategory
          }
        />

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >

          {blogCategories[
            selectedCategory
          ]?.sections?.map(
            (section, index) => (

              <BlogSectionCard
                key={index}
                section={section}
              />
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default BlogPanel;