import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InstructorCard from "../component/InstructorCard";

gsap.registerPlugin(ScrollTrigger);

const instructors = [
  {
    id: 1,
    name: "Rishi Singh",
    expertise: "Full Stack Developer",
    students: 12000,
    courses: 15,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    id: 2,
    name: "Aman Sharma",
    expertise: "AI Engineer",
    students: 9000,
    courses: 12,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: 3,
    name: "Vikas Kumar",
    expertise: "System Design Expert",
    students: 15000,
    courses: 18,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    id: 4,
    name: "Priya Verma",
    expertise: "Data Scientist",
    students: 8000,
    courses: 10,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

const Instructors = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".instructors-header",
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
          trigger: ".instructors-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for instructor cards
    gsap.fromTo(
      ".instructor-card",
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
        stagger: 0.12,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".instructor-card",
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

        <div className="instructors-header text-center mb-16">

          <span
            className="
            inline-flex
            items-center
            px-4
            py-2
            rounded-full
            bg-blue-100 dark:bg-blue-900/30
            text-blue-600 dark:text-blue-400
            font-semibold
            "
          >
            👨‍🏫 Expert Mentors
          </span>

          <h2
            className="
            mt-6
            text-4xl
            md:text-5xl
            font-bold
            text-slate-900 dark:text-white
            "
          >
            Learn From Industry Experts
          </h2>

          <p
            className="
            mt-5
            max-w-2xl
            mx-auto
            text-slate-600 dark:text-slate-300
            "
          >
            Get mentored by professionals working
            at top companies and helping thousands
            of students build successful careers.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {instructors.map((instructor) => (
            <div key={instructor.id} className="instructor-card">
              <InstructorCard
                image={instructor.image}
                name={instructor.name}
                expertise={instructor.expertise}
                students={instructor.students}
                courses={instructor.courses}
                rating={instructor.rating}
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Instructors;