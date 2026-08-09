import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchPublishedCourses } from "../../../redux/slices/courseSlice";
import CourseCard from "../component/CourseCard";

const AUTO_SCROLL_SPEED = 40; // px per second — jitna zyada, utni tez auto-scroll
const RESUME_DELAY = 2500; // button dabane ke baad kitni der ruke rahe (ms)

const FeaturedCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const scrollRef = useRef(null);       // scrollable container
  const isPaused = useRef(false);        // hover/touch/manual click pe true
  const rafRef = useRef(null);           // requestAnimationFrame id
  const resumeTimeoutRef = useRef(null);

  const { courseData, loading, error } = useSelector((state) => state.course);
  const featuredCourses = courseData || [];

  useEffect(() => {
    if (courseData.length === 0) {
      dispatch(fetchPublishedCourses());
    }
  }, [dispatch, courseData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // 👇 AUTO-SCROLL ENGINE — requestAnimationFrame se continuous scrollLeft badhata hai
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || featuredCourses.length === 0) return;

    let lastTime = null;

    const step = (timestamp) => {
      if (lastTime === null) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isPaused.current) {
        el.scrollLeft += (AUTO_SCROLL_SPEED * delta) / 1000;

        // seamless loop: list 2x duplicate hai, aadha scroll hote hi reset kar do
        const singleSetWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= singleSetWidth) {
          el.scrollLeft -= singleSetWidth;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [featuredCourses.length]);

  // 👇 Hover / touch pe pause, chhodte hi resume
  const pause = () => { isPaused.current = true; };
  const resume = () => { isPaused.current = false; };

  // 👇 Prev/Next button click — turant pause, smooth scroll, kuch second baad auto-scroll resume
  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    isPaused.current = true;
    clearTimeout(resumeTimeoutRef.current);

    const card = el.querySelector(".marquee-item");
    const cardWidth = card ? card.offsetWidth + 24 : 380;
    const singleSetWidth = el.scrollWidth / 2;

    let target = el.scrollLeft + (direction === "next" ? cardWidth : -cardWidth);

    // wrap-around taaki start/end pe atke na
    if (target < 0) target += singleSetWidth;
    if (target >= singleSetWidth) target -= singleSetWidth;

    el.scrollTo({ left: target, behavior: "smooth" });

    resumeTimeoutRef.current = setTimeout(() => {
      isPaused.current = false;
    }, RESUME_DELAY);
  };

  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-[#f9f7ff] dark:bg-[#0a0812] w-full">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-purple-200/40 dark:bg-purple-900/30 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-pink-200/30 dark:bg-pink-900/30 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-700/50">
              <Sparkles className="w-3 h-3" />
              Curated Learning
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Featured{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  Courses
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 opacity-40" />
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-300 leading-relaxed">
              Discover our most popular courses designed by industry experts to
              help you build production-ready skills — fast.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/allcourses")}
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-lg transition-all"
            >
              View All Courses
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* 👇 Prev / Next — infinite loop hai isliye kabhi disable nahi honge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollByAmount("prev")}
                aria-label="Previous courses"
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollByAmount("next")}
                aria-label="Next courses"
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message={error} />
      ) : featuredCourses.length > 0 ? (
        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollRef}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            className="marquee-wrapper"
          >
            <div className="marquee-track">
              {[...featuredCourses, ...featuredCourses].map((course, index) => (
                <div key={`${course._id}-${index}`} className="marquee-item">
                  <CourseCard
                    id={course._id}
                    thumbnail={course.thumbnail}
                    title={course.title}
                    category={course.category}
                    price={course.price}
                    reviews={course.reviews}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      <style>{`
      .marquee-wrapper {
        width: 100%;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding: 4px 4px 24px 4px;
      }
      .marquee-wrapper::-webkit-scrollbar { display: none; }

      .marquee-track {
        display: flex;
        width: max-content;
      }

      .marquee-item {
        width: 380px;
        flex-shrink: 0;
        padding-right: 24px;
      }

      @media (max-width: 768px) {
        .marquee-item { width: 280px; padding-right: 16px; }
      }
    `}</style>
    </section>
  );
};

const SkeletonGrid = () => (
  <div className="flex overflow-x-auto gap-6 pb-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="shrink-0 w-[300px] sm:w-[320px] lg:w-[340px] rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 p-4 space-y-4 shadow-sm">
        <div className="w-full h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-2 px-1">
          <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-5 w-10/12 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-8/12 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
          <div className="h-6 w-1/4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 max-w-md mx-auto text-center rounded-3xl bg-white dark:bg-slate-800/90 border-2 border-slate-200/60 dark:border-purple-500/30 shadow-xl">
    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">No Courses Yet</h3>
    <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
      Premium tracks are currently in development. Check back soon!
    </p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 max-w-md mx-auto text-center rounded-3xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 shadow-xl">
    <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Error Loading Courses</h3>
    <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
      {message || "Unable to load courses. Please try again later."}
    </p>
  </div>
);

export default FeaturedCourses;
