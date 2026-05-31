import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPublishedCourses } from "../../../redux/slices/courseSlice";

import CourseCard from "../component/CourseCard";

gsap.registerPlugin(ScrollTrigger);

const FeaturedCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData, loading } = useSelector(
    (state) => state.course
  );

  const featuredCourses =
    courseData?.slice(0, 4) || [];

  useEffect(() => {
    // Only fetch if not already fetched in App.jsx
    if (courseData.length === 0) {
      dispatch(fetchPublishedCourses());
    }
  }, [dispatch, courseData.length]);

  useEffect(() => {
    // Header animation
    const headerAnim = gsap.fromTo(
      ".featured-header",
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
          trigger: ".featured-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for course cards
    const cardsAnim = gsap.fromTo(
      ".featured-course-card",
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
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".featured-course-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      headerAnim.kill();
      cardsAnim.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}

        <div className="featured-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>

            <span
              className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-blue-100
              text-blue-600
              text-sm
              font-semibold
              mb-4
              "
            >
              Featured Learning
            </span>

            <h2
              className="
              text-4xl
              md:text-5xl
              font-bold
              text-slate-900
              "
            >
              Featured Courses
            </h2>

            <p
              className="
              mt-4
              text-slate-600
              max-w-2xl
              "
            >
              Discover our most popular courses
              designed by industry experts to help
              you learn practical skills and grow
              your career.
            </p>

          </div>

          <button
            onClick={() => navigate("/allcourses")}
            className="
            flex
            items-center
            gap-2
            font-semibold
            text-blue-600
            hover:gap-3
            transition-all
            "
          >
            View All Courses

            <ArrowRight size={18} />
          </button>

        </div>

        {/* Grid */}

        {loading ? (
          // Skeleton loader while data is loading
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="w-full h-40 bg-slate-200 rounded-xl animate-pulse mb-4" />
                <div className="h-6 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-200 rounded animate-pulse w-1/3" />
                  <div className="h-8 bg-slate-200 rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

            {featuredCourses.map((course) => (
              <div key={course._id} className="featured-course-card">
                <CourseCard
                  id={course._id}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  reviews={course.reviews || []}
                />
              </div>
            ))}

          </div>

        ) : (

          <div
            className="
            py-20
            text-center
            rounded-3xl
            bg-white
            border
            "
          >
            <h3 className="text-xl font-semibold">
              No Courses Available
            </h3>

            <p className="text-slate-500 mt-2">
              Courses will appear here once
              published.
            </p>
          </div>

        )}

      </div>

    </section>
  );
};

export default FeaturedCourses;