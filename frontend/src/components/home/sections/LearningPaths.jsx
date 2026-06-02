import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  Code2,
  Brain,
  Database,
  Server,
  Cloud,
  Layers3,
  Sparkles,
  Trophy,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const paths = [
  {
    title: "Frontend Developer",
    icon: Code2,
    courses: 12,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Backend Developer",
    icon: Server,
    courses: 10,
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Full Stack Developer",
    icon: Layers3,
    courses: 18,
    skills: ["React", "Node", "MongoDB", "Deployment"],
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    title: "AI Engineer",
    icon: Brain,
    courses: 14,
    skills: ["Python", "ML", "LLMs", "Deep Learning"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Data Scientist",
    icon: Database,
    courses: 11,
    skills: ["Python", "Pandas", "SQL", "Visualization"],
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "DevOps Engineer",
    icon: Cloud,
    courses: 9,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    gradient: "from-indigo-500 to-violet-600",
  },
];

const LearningPaths = () => {
  useEffect(() => {
    gsap.from(".paths-header", {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".paths-header",
        start: "top 85%",
      },
    });

    gsap.from(".path-card", {
      opacity: 0,
      y: 80,
      scale: 0.9,
      stagger: 0.12,
      duration: 0.8,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: ".paths-grid",
        start: "top 80%",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
<section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-white via-violet-50/40 to-white">

  {/* Blobs */}
  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[120px]" />

  <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-pink-300/20 blur-[120px]" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="paths-header text-center mb-16">

      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-sm">

        <Sparkles size={16} />

        Career Roadmaps

      </div>

      <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight">

        Choose Your{" "}

        <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">

          Learning Path

        </span>

      </h2>

      <p className="max-w-2xl mx-auto mt-5 text-slate-600 text-lg leading-relaxed">
        Follow industry-designed roadmaps that guide you from beginner to job-ready.
      </p>

    </div>

    {/* Grid */}
    <div className="paths-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

      {paths.map((path, index) => {

        const Icon = path.icon;

        return (
          <div
            key={index}
            className="
            path-card
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200/80
            bg-white/80
            backdrop-blur-xl
            p-7
            shadow-sm
            hover:-translate-y-3
            hover:shadow-[0_25px_80px_rgba(124,58,237,0.18)]
            transition-all
            duration-500
            "
          >

            {/* Glow */}
            <div
              className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-700
              bg-gradient-to-br
              from-violet-500/5
              via-fuchsia-500/5
              to-cyan-500/5
              "
            />

            {/* Badge */}
            <div className="absolute top-5 right-5">

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">

                <Trophy size={12} />

                Popular

              </div>

            </div>

            {/* Icon */}
            <div
              className={`
              w-16
              h-16
              rounded-2xl
              flex
              items-center
              justify-center
              text-white
              bg-gradient-to-br
              ${path.gradient}
              shadow-lg
              mb-6
              `}
            >
              <Icon size={30} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-violet-600 transition-colors">

              {path.title}

            </h3>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-6">

              {path.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="
                  px-3
                  py-1.5
                  rounded-full
                  bg-slate-100
                  border
                  border-slate-200
                  text-xs
                  font-medium
                  text-slate-700
                  "
                >
                  {skill}
                </span>
              ))}

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Learning Modules
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {path.courses} Courses
                </p>

              </div>

              <button
                className="
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                text-white
                font-semibold
                hover:shadow-lg
                hover:shadow-violet-500/30
                transition-all
                "
              >
                Explore
                <ArrowRight size={18} />
              </button>

            </div>

          </div>
        );
      })}

    </div>

  </div>

</section>
  );
};

export default LearningPaths;