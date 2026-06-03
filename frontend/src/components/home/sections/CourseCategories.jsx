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
  ArrowRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Development",
    value: "web-development",
    courses: 120,
    icon: <Code2 className="w-8 h-8 text-blue-600" />,
    bg: "bg-blue-50/70",
    borderGlow: "group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    tagColor: "bg-blue-600",
    textColor: "text-blue-600",
  },
  {
    title: "Business",
    value: "business",
    courses: 80,
    icon: <Briefcase className="w-8 h-8 text-emerald-600" />,
    bg: "bg-emerald-50/70",
    borderGlow: "group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    tagColor: "bg-emerald-600",
    textColor: "text-emerald-600",
    isPremium: true, // Example premium tag
  },
  {
    title: "Design",
    value: "ui-ux-design",
    courses: 60,
    icon: <Palette className="w-8 h-8 text-rose-600" />,
    bg: "bg-rose-50/70",
    borderGlow: "group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    tagColor: "bg-rose-600",
    textColor: "text-rose-600",
  },
  {
    title: "Marketing",
    value: "digital-marketing",
    courses: 75,
    icon: <Megaphone className="w-8 h-8 text-orange-600" />,
    bg: "bg-orange-50/70",
    borderGlow: "group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]",
    tagColor: "bg-orange-600",
    textColor: "text-orange-600",
  },
  {
    title: "Data Science",
    value: "machine-learning",
    courses: 90,
    icon: <Database className="w-8 h-8 text-indigo-600" />,
    bg: "bg-indigo-50/70",
    borderGlow: "group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]",
    tagColor: "bg-indigo-600",
    textColor: "text-indigo-600",
  },
  {
    title: "AI & ML",
    value: "ai-ml",
    courses: 50,
    icon: <Brain className="w-8 h-8 text-purple-600" />,
    bg: "bg-purple-50/70",
    borderGlow: "group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    tagColor: "bg-purple-600",
    textColor: "text-purple-600",
  },
  {
    title: "Cyber Security",
    value: "ethical-hacking",
    courses: 40,
    icon: <Shield className="w-8 h-8 text-slate-700" />,
    bg: "bg-slate-100/70",
    borderGlow: "group-hover:border-slate-400 group-hover:shadow-[0_0_20px_rgba(71,85,105,0.25)]",
    tagColor: "bg-slate-700",
    textColor: "text-slate-700",
  },
  {
    title: "Finance",
    value: "business",
    courses: 35,
    icon: <Landmark className="w-8 h-8 text-amber-600" />,
    bg: "bg-amber-50/70",
    borderGlow: "group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(217,119,6,0.25)]",
    tagColor: "bg-amber-600",
    textColor: "text-amber-600",
  },
];

const CategoryCard = ({ title, value, courses, icon, bg, borderGlow, tagColor, textColor, isPremium, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer h-full rounded-[32px] border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-7 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${borderGlow}`}
    >
      {/* Premium Tag Indicator if applicable */}
      {isPremium && (
        <span className={`absolute top-4 right-4 text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${tagColor}`}>
          Premium
        </span>
      )}

      <div>
        {/* Apple-style Premium Icon Pod Container */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg} transition-all duration-500 group-hover:scale-110 border border-transparent group-hover:border-white/50 shadow-inner`}
          style={{ boxShadow: "inset 0px 2px 8px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.03)" }}
        >
          <div className="transition-transform duration-500 group-hover:rotate-3">
            {icon}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors group-hover:text-black dark:group-hover:text-white">
            {title}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
            {courses}+ Courses Available
          </p>
        </div>
      </div>

      {/* Modern Luxury LMS Interactive Arrow Link */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50 group-hover:border-gray-100 dark:group-hover:border-gray-600">
        <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${textColor} group-hover:opacity-90`}>
          Explore Category
        </span>
        <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-gray-50 group-hover:${bg} transition-all duration-300`}>
          <ArrowRight className={`w-4 h-4 ${textColor} transition-transform duration-300 group-hover:translate-x-0.5`} />
        </div>
      </div>

      {/* Growing Border Glow Layer */}
      <div className="absolute inset-0 rounded-[32px] border-2 border-transparent transition-all duration-500 pointer-events-none group-hover:scale-[1.01]" />
    </div>
  );
};

const CourseCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryValue) => {
    navigate("/allcourses", { state: { selectedCategory: categoryValue } });
  };

  useEffect(() => {
    // Elegant standard scroll reveal for Headers
    gsap.fromTo(
      ".categories-header",
      { opacity: 0, y: 40 },
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

    // Dynamic grid stagger entrance for premium response
    gsap.fromTo(
      ".category-card-item",
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".category-grid",
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
    <section className="py-24 md:py-32 bg-slate-50/60 dark:bg-gray-900/60 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="categories-header text-center mb-16 md:mb-20">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-xs md:text-sm tracking-wide mb-4 border border-blue-100/50 dark:border-blue-700/50 uppercase">
            ⚡ Upgrade Your Future
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 dark:text-white tracking-tight leading-none">
            Browse Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Categories</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-4 md:mt-6 max-w-2xl mx-auto leading-relaxed">
            Explore premium courses across the most in-demand industry skills and accelerate your career growth with expert-led training.
          </p>
        </div>

        {/* Fully Responsive Premium Grid Layer */}
        <div className="category-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <div key={index} className="category-card-item h-full">
              <CategoryCard 
                {...category} 
                onClick={() => handleCategoryClick(category.value)} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;