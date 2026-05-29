import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sparkles,
  BookOpen,
  Star,
  ArrowRight,
  Flame,
  Users,
  Trophy,
} from "lucide-react";

import Card from "./Card";

const CardPage = () => {
  const { courseData } = useSelector((state) => state.course);

  const [popularCourses, setPopularCourses] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (Array.isArray(courseData) && courseData.length > 0) {
      setPopularCourses(courseData.slice(0, 8));
    }
  }, [courseData]);

  const nextSlide = () => {
    if (index < popularCourses.length - 3) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-20 px-4 sm:px-6">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500">
            <Sparkles size={16} />
            <span className="text-xs sm:text-sm font-semibold">
              Most Popular Courses
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            Upgrade Your Skills With{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Premium Learning
            </span>
          </h1>

          <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
            Learn from experts with real-world projects, certificates and hands-on experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">

          <div className="p-5 text-center">
            <Users className="mx-auto text-blue-500" />
            <h2 className="text-2xl font-bold">10K+</h2>
            <p className="text-sm text-gray-500">Students</p>
          </div>

          <div className="p-5 text-center">
            <BookOpen className="mx-auto text-purple-500" />
            <h2 className="text-2xl font-bold">250+</h2>
            <p className="text-sm text-gray-500">Courses</p>
          </div>

          <div className="p-5 text-center">
            <Star className="mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold">4.9</h2>
            <p className="text-sm text-gray-500">Rating</p>
          </div>

          <div className="p-5 text-center">
            <Trophy className="mx-auto text-pink-500" />
            <h2 className="text-2xl font-bold">95%</h2>
            <p className="text-sm text-gray-500">Success</p>
          </div>

        </div>

        {/* Trending Header */}
        <div className="flex justify-between items-center mt-16 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Flame className="text-orange-500" />
              Trending Courses
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Explore most loved courses
            </p>
          </div>

          <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-2">
            Explore More <ArrowRight size={18} />
          </button>
        </div>

        {/* 🔥 CAROUSEL ADDED HERE */}
        <div className="relative overflow-hidden">

          {/* Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
          >
            ›
          </button>

          {/* Slider */}
          <div
            className="flex gap-6 transition-transform duration-500"
            style={{
              transform: `translateX(-${index * 33.33}%)`,
            }}
          >

            {popularCourses.map((course) => (
              <div
                key={course._id}
                className="min-w-full sm:min-w-[50%] lg:min-w-[33.33%]"
              >
                <Card
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  reviews={course.reviews}
                />
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default CardPage;