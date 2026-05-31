import React, { useEffect } from "react";
import img from "../../../assets/myphoto.png";
import video from "../../../assets/Pika.mp4";

import {
  Users,
  Award,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  useEffect(() => {
    // Image side animation
    gsap.fromTo(
      ".about-image",
      {
        opacity: 0,
        x: -50,
        scale: 0.95,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-image",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating cards animation
    gsap.fromTo(
      ".about-floating-card",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".about-floating-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Content side animation
    gsap.fromTo(
      ".about-content",
      {
        opacity: 0,
        x: 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for feature cards
    gsap.fromTo(
      ".about-feature",
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".about-feature",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // CTA buttons animation
    gsap.fromTo(
      ".about-cta",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-cta",
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
    <section className="relative py-28 bg-gradient-to-b from-white to-slate-50 overflow-hidden">

      {/* Glow */}

      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* IMAGE SIDE */}

          <div className="about-image relative">

            <img
              src={img}
              alt="Founder"
              className="
              w-full
              max-w-[500px]
              mx-auto
              h-[620px]
              object-cover
              rounded-[32px]
              shadow-2xl
              "
            />

            {/* Students */}

            <div
              className="
              about-floating-card
              absolute
              top-8
              -left-5
              bg-white
              rounded-2xl
              p-4
              shadow-xl
              border
              "
            >
              <h3 className="text-2xl font-bold">
                50K+
              </h3>

              <p className="text-gray-500 text-sm">
                Active Students
              </p>
            </div>

            {/* Rating */}

            <div
              className="
              about-floating-card
              absolute
              bottom-44
              -right-5
              bg-white
              rounded-2xl
              p-4
              shadow-xl
              border
              "
            >
              <h3 className="text-2xl font-bold">
                4.9★
              </h3>

              <p className="text-gray-500 text-sm">
                Average Rating
              </p>
            </div>

            {/* Video Card */}

            <div
              className="
              about-floating-card
              absolute
              -bottom-8
              right-10
              bg-white
              rounded-3xl
              p-3
              shadow-2xl
              border
              w-[280px]
              "
            >
              <video
                src={video}
                autoPlay
                muted
                loop
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* CONTENT */}

          <div className="about-content">

            <div className="inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
              🚀 About SkillBridge
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Building Careers Through
              <span className="text-blue-600">
                {" "}Modern Learning
              </span>
            </h2>

            <p className="mt-7 text-gray-600 leading-8 text-lg">
              SkillBridge was created with a simple mission:
              make quality education accessible, practical,
              and career-focused.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              We combine structured learning paths,
              live mentorship, projects, certifications,
              AI-powered learning, and real-world practice
              to help students become industry ready.
            </p>

            {/* Features */}

            <div className="grid sm:grid-cols-2 gap-4 mt-10">

              <div className="about-feature bg-white border rounded-2xl p-5">
                <BookOpen className="text-blue-600 mb-3" />
                <h4 className="font-bold">
                  500+ Courses
                </h4>
              </div>

              <div className="about-feature bg-white border rounded-2xl p-5">
                <Users className="text-green-600 mb-3" />
                <h4 className="font-bold">
                  50K+ Learners
                </h4>
              </div>

              <div className="about-feature bg-white border rounded-2xl p-5">
                <GraduationCap className="text-purple-600 mb-3" />
                <h4 className="font-bold">
                  Expert Mentors
                </h4>
              </div>

              <div className="about-feature bg-white border rounded-2xl p-5">
                <Award className="text-yellow-500 mb-3" />
                <h4 className="font-bold">
                  Verified Certificates
                </h4>
              </div>

            </div>

            {/* CTA */}

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                className="
                about-cta
                px-8
                py-4
                rounded-2xl
                bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-700
                transition
                "
              >
                Start Learning
              </button>

              <button
                className="
                about-cta
                px-8
                py-4
                rounded-2xl
                border
                font-semibold
                hover:bg-slate-100
                transition
                "
              >
                Explore Courses
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;