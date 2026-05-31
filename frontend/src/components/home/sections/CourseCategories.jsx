import React, { useEffect } from "react";
import {
  Code2,
  Briefcase,
  Palette,
  Megaphone,
  Database,
  Brain,
  Shield,
  Landmark,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CategoryCard from "../component/CategoryCard";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Development",
    courses: 120,
    icon: <Code2 />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Business",
    courses: 80,
    icon: <Briefcase />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Design",
    courses: 60,
    icon: <Palette />,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Marketing",
    courses: 75,
    icon: <Megaphone />,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Data Science",
    courses: 90,
    icon: <Database />,
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "AI & ML",
    courses: 50,
    icon: <Brain />,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Cyber Security",
    courses: 40,
    icon: <Shield />,
    color: "from-slate-700 to-slate-900",
  },
  {
    title: "Finance",
    courses: 35,
    icon: <Landmark />,
    color: "from-yellow-500 to-amber-500",
  },
];

const CourseCategories = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".categories-header",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".categories-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for category cards
    gsap.fromTo(
      ".category-card-item",
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".category-card-item",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <div className="categories-header text-center mb-14">

          <h2 className="text-4xl md:text-5xl font-bold">
            Browse Top Categories
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore courses across the most in-demand skills
            and accelerate your career growth.
          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((category, index) => (
            <div key={index} className="category-card-item">
              <CategoryCard
                title={category.title}
                icon={category.icon}
                courses={category.courses}
                color={category.color}
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CourseCategories;