import React, { useEffect } from "react";
import {
  BookOpen,
  BadgeDollarSign,
  Award,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BookOpen,
    title: "250+ Premium Courses",
    description:
      "Access industry-focused courses designed by experts.",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Learning",
    description:
      "Get maximum value with budget-friendly pricing.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Earn certificates to showcase your achievements.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Learn together with students and mentors.",
  },
];

const WhyChooseUs = () => {
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".why-choose-header",
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
          trigger: ".why-choose-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for feature cards
    gsap.fromTo(
      ".feature-card",
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
          trigger: ".feature-card",
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

        <div className="why-choose-header text-center mb-14">
          <h2 className="text-4xl font-bold">
            Why Choose SkillBridge?
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Everything you need to learn, practice,
            and become job-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                feature-card
                bg-white
                p-8
                rounded-2xl
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                hover:-translate-y-2
                "
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <Icon size={28} />
                </div>

                <h3 className="font-bold text-xl mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;