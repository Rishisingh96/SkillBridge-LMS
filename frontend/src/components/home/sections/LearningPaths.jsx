import React, { useEffect } from "react";
import {
  ArrowRight,
  Code2,
  Brain,
  Database,
  Server,
  Cloud,
  Layers3,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const paths = [
  {
    title: "Frontend Developer",
    icon: Code2,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    courses: 12,
  },
  {
    title: "Backend Developer",
    icon: Server,
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    courses: 10,
  },
  {
    title: "Full Stack Developer",
    icon: Layers3,
    skills: ["React", "Node", "MongoDB", "Deployment"],
    courses: 18,
  },
  {
    title: "AI Engineer",
    icon: Brain,
    skills: ["Python", "ML", "LLMs", "Deep Learning"],
    courses: 14,
  },
  {
    title: "Data Scientist",
    icon: Database,
    skills: ["Python", "Pandas", "SQL", "Visualization"],
    courses: 11,
  },
  {
    title: "DevOps Engineer",
    icon: Cloud,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    courses: 9,
  },
];

const LearningPaths = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".paths-header",
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
          trigger: ".paths-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for path cards
    gsap.fromTo(
      ".path-card",
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
          trigger: ".path-card",
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
        
        <div className="paths-header text-center mb-14">
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
            🚀 Career Roadmaps
          </span>

          <h2 className="text-4xl font-bold mt-5">
            Choose Your Learning Path
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Follow structured learning journeys designed to
            help you become job-ready faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path, index) => {
            const Icon = path.icon;

            return (
              <div
                key={index}
                className="
                path-card
                group
                border
                rounded-2xl
                p-6
                hover:shadow-xl
                hover:-translate-y-2
                transition-all
                duration-300
                "
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {path.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-5">
                  {path.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="
                      px-3 py-1
                      rounded-full
                      bg-slate-100
                      text-sm
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    {path.courses} Courses
                  </span>

                  <button
                    className="
                    flex items-center gap-2
                    text-blue-600
                    font-semibold
                    "
                  >
                    View Path
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