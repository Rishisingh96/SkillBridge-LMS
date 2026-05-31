import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiveClassCard from "../component/LiveClassCard";

gsap.registerPlugin(ScrollTrigger);

const liveClasses = [
  {
    id: 1,
    title: "React 2026 Complete Masterclass",
    instructor: "Rishi Singh",
    date: "15 June 2026",
    time: "07:00 PM",
    students: 420,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    id: 2,
    title: "AI Engineering Bootcamp",
    instructor: "Aman Sharma",
    date: "18 June 2026",
    time: "08:00 PM",
    students: 380,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    id: 3,
    title: "System Design Interview Prep",
    instructor: "Vikas Kumar",
    date: "20 June 2026",
    time: "06:00 PM",
    students: 520,
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
  },
];

const LiveClasses = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".live-header",
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
          trigger: ".live-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for live class cards
    gsap.fromTo(
      ".live-class-card",
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
          trigger: ".live-class-card",
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

        <div className="live-header text-center mb-16">

          <span className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold">
            🔴 Live Learning
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold">
            Upcoming Live Classes
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Learn directly from experts through
            interactive live sessions, workshops
            and masterclasses.
          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {liveClasses.map((item) => (
            <div key={item.id} className="live-class-card">
              <LiveClassCard
                {...item}
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default LiveClasses;