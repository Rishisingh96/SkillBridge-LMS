import React, { useEffect } from "react";
import {
  Users,
  Award,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SuccessStoryCard from "../component/SuccessStoryCard";

gsap.registerPlugin(ScrollTrigger);

const successStories = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    company: "Infosys",
    packageAmount: "₹8.5 LPA",
    story:
      "Rahul started from zero and mastered frontend development through our structured roadmap and hands-on projects.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    name: "Priya Verma",
    role: "Data Analyst",
    company: "Accenture",
    packageAmount: "₹10 LPA",
    story:
      "Priya switched from non-tech background to data analytics and landed a high-paying job within 6 months.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Amit Kumar",
    role: "Full Stack Developer",
    company: "TCS",
    packageAmount: "₹12 LPA",
    story:
      "Amit built multiple real-world projects and cracked interviews at top MNCs with confidence.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
];

const SuccessStories = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".success-header",
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
          trigger: ".success-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for stats
    gsap.fromTo(
      ".success-stat",
      {
        opacity: 0,
        y: 30,
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
          trigger: ".success-stat",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Counter animation for stats
    const statCounters = document.querySelectorAll(".success-stat h3");
    statCounters.forEach((counter) => {
      const text = counter.textContent;
      const hasK = text.includes("K");
      const hasPercent = text.includes("%");
      const hasPlus = text.includes("+");
      const numValue = parseFloat(text.replace(/[^0-9.]/g, ""));

      gsap.fromTo(
        counter,
        { innerText: 0 },
        {
          innerText: numValue,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            once: true,
          },
          onUpdate: function() {
            let current = parseFloat(this.targets()[0].innerText);
            if (hasK) {
              counter.textContent = Math.floor(current) + "K" + (hasPlus ? "+" : "");
            } else if (hasPercent) {
              counter.textContent = Math.floor(current) + "%";
            } else {
              counter.textContent = Math.floor(current) + (hasPlus ? "+" : "");
            }
          },
        }
      );
    });

    // Stagger animation for story cards
    gsap.fromTo(
      ".success-story-card",
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
          trigger: ".success-story-card",
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
    <section className="py-24 bg-slate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="success-header text-center mb-14">
          <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
            🚀 Success Stories
          </span>

          <h2 className="text-4xl font-bold mt-5 text-gray-900 dark:text-white">
            Our Students Are Growing Fast
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Thousands of learners have transformed their careers with our courses and mentorship.
          </p>
        </div>

       

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <div key={index} className="success-story-card">
              <SuccessStoryCard
                image={story.image}
                name={story.name}
                role={story.role}
                company={story.company}
                packageAmount={story.packageAmount}
                story={story.story}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SuccessStories;