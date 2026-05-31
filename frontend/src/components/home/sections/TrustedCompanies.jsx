import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
];

const TrustedCompanies = () => {
  useEffect(() => {
    gsap.fromTo(
      ".company-item",
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
          trigger: ".company-item",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 font-medium mb-10">
          Trusted by learners from top companies
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {companies.map((company, index) => (
            <div
              key={index}
              className="company-item text-gray-700 text-lg font-semibold hover:text-blue-600 transition-all cursor-pointer"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;