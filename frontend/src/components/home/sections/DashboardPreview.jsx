import React, { useEffect } from "react";
import {
  BookOpen,
  Trophy,
  Clock3,
  TrendingUp,
  Award,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DashboardPreview = () => {
  useEffect(() => {
    // Left content animation
    gsap.fromTo(
      ".dashboard-content",
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".dashboard-content",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for feature items
    gsap.fromTo(
      ".dashboard-feature",
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".dashboard-feature",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Right dashboard card animation
    gsap.fromTo(
      ".dashboard-card",
      {
        opacity: 0,
        x: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".dashboard-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for dashboard stats
    gsap.fromTo(
      ".dashboard-stat",
      {
        opacity: 0,
        y: 20,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".dashboard-stat",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Progress bar animation
    gsap.fromTo(
      ".dashboard-progress",
      {
        width: "0%",
      },
      {
        width: "85%",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".dashboard-progress",
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
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}

          <div className="dashboard-content">

            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
              📊 Student Dashboard
            </span>

            <h2 className="text-4xl font-bold mt-6">
              Track Your Learning Progress
            </h2>

            <p className="text-gray-600 mt-5 text-lg">
              Manage courses, certificates, progress,
              streaks and achievements from a powerful
              student dashboard.
            </p>

            <div className="space-y-5 mt-8">

              <div className="dashboard-feature flex gap-4">
                <BookOpen className="text-blue-600" />
                <div>
                  <h4 className="font-semibold">
                    My Courses
                  </h4>
                  <p className="text-gray-500">
                    Access all enrolled courses.
                  </p>
                </div>
              </div>

              <div className="dashboard-feature flex gap-4">
                <TrendingUp className="text-green-600" />
                <div>
                  <h4 className="font-semibold">
                    Progress Tracking
                  </h4>
                  <p className="text-gray-500">
                    Monitor completion percentage.
                  </p>
                </div>
              </div>

              <div className="dashboard-feature flex gap-4">
                <Award className="text-yellow-600" />
                <div>
                  <h4 className="font-semibold">
                    Certificates
                  </h4>
                  <p className="text-gray-500">
                    Download certificates anytime.
                  </p>
                </div>
              </div>

              <div className="dashboard-feature flex gap-4">
                <Clock3 className="text-purple-600" />
                <div>
                  <h4 className="font-semibold">
                    Learning Streak
                  </h4>
                  <p className="text-gray-500">
                    Stay consistent every day.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="dashboard-card bg-white rounded-3xl shadow-2xl p-8">

              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl">
                  Dashboard Overview
                </h3>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="dashboard-stat bg-slate-50 rounded-xl p-5">
                  <BookOpen size={28} />
                  <h4 className="font-bold mt-3">12</h4>
                  <p className="text-gray-500 text-sm">
                    Courses
                  </p>
                </div>

                <div className="dashboard-stat bg-slate-50 rounded-xl p-5">
                  <Award size={28} />
                  <h4 className="font-bold mt-3">8</h4>
                  <p className="text-gray-500 text-sm">
                    Certificates
                  </p>
                </div>

                <div className="dashboard-stat bg-slate-50 rounded-xl p-5">
                  <TrendingUp size={28} />
                  <h4 className="font-bold mt-3">85%</h4>
                  <p className="text-gray-500 text-sm">
                    Progress
                  </p>
                </div>

                <div className="dashboard-stat bg-slate-50 rounded-xl p-5">
                  <Trophy size={28} />
                  <h4 className="font-bold mt-3">42</h4>
                  <p className="text-gray-500 text-sm">
                    Day Streak
                  </p>
                </div>

              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-2">
                  Overall Progress
                </p>

                <div className="w-full h-3 bg-slate-200 rounded-full">
                  <div className="dashboard-progress h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;