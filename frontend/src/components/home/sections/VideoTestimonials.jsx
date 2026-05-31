import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TestimonialCard from "../component/TestimonialCard";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "Data Analyst",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Full Stack Developer",
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    rating: 5,
  },
];

const VideoTestimonials = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".testimonial-header",
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
          trigger: ".testimonial-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for testimonial cards
    gsap.fromTo(
      ".testimonial-card",
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
          trigger: ".testimonial-card",
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

        {/* Header */}
        <div className="testimonial-header text-center mb-14">
          <span className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-medium">
            🎥 Student Stories
          </span>

          <h2 className="text-4xl font-bold mt-5">
            Hear From Our Learners
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Real students sharing their learning journey, career growth and success stories.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((student, index) => (
            <div key={index} className="testimonial-card">
              <TestimonialCard
                thumbnail={student.thumbnail}
                name={student.name}
                role={student.role}
                rating={student.rating}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VideoTestimonials;