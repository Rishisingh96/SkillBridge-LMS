import React, { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Content animation
    gsap.fromTo(
      ".cta-content",
      {
        opacity: 0,
        y: 40,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cta-content",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for stats
    gsap.fromTo(
      ".cta-stat",
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".cta-stat",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Counter animation for stats
    const statCounters = document.querySelectorAll(".cta-stat h3");
    statCounters.forEach((counter) => {
      const text = counter.textContent;
      const hasK = text.includes("K");
      const hasPlus = text.includes("+");
      const hasStar = text.includes("★");
      const numValue = parseFloat(text.replace(/[^0-9.]/g, ""));

      if (!hasStar) {
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
              } else {
                counter.textContent = Math.floor(current) + (hasPlus ? "+" : "");
              }
            },
          }
        );
      }
    });

    // Buttons animation
    gsap.fromTo(
      ".cta-button",
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
          trigger: ".cta-button",
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
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        <div
          className="
          cta-content
          relative
          rounded-[40px]
          overflow-hidden
          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-purple-700
          px-8
          md:px-16
          py-20
          text-center
          "
        >
          {/* Glow Effects */}

          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-400/20 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/20 blur-[120px] rounded-full" />

          {/* Content */}

          <div className="relative z-10">

            <div
              className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/10
              border
              border-white/20
              text-white
              mb-6
              "
            >
              <Sparkles size={16} />

              <span>
                Join The Future Of Learning
              </span>
            </div>

            <h2
              className="
              text-white
              text-4xl
              md:text-6xl
              font-bold
              leading-tight
              "
            >
              Ready To Transform
              <br />
              Your Career?
            </h2>

            <p
              className="
              text-white/80
              mt-6
              max-w-3xl
              mx-auto
              text-lg
              leading-8
              "
            >
              Join thousands of students learning new skills,
              building projects, earning certificates,
              and growing their careers with SkillBridge.
            </p>

            {/* Stats */}

            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
              mt-12
              max-w-4xl
              mx-auto
              "
            >
              <div className="cta-stat">
                <h3 className="text-white text-3xl font-bold">
                  50K+
                </h3>

                <p className="text-white/70">
                  Students
                </p>
              </div>

              <div className="cta-stat">
                <h3 className="text-white text-3xl font-bold">
                  500+
                </h3>

                <p className="text-white/70">
                  Courses
                </p>
              </div>

              <div className="cta-stat">
                <h3 className="text-white text-3xl font-bold">
                  120+
                </h3>

                <p className="text-white/70">
                  Mentors
                </p>
              </div>

              <div className="cta-stat">
                <h3 className="text-white text-3xl font-bold">
                  4.9★
                </h3>

                <p className="text-white/70">
                  Rating
                </p>
              </div>
            </div>

            {/* Buttons */}

            <div
              className="
              mt-12
              flex
              flex-wrap
              justify-center
              gap-5
              "
            >
              <button
                onClick={() =>
                  navigate("/allcourses")
                }
                className="
                cta-button
                px-8
                py-4
                rounded-2xl
                bg-white
                text-slate-900
                font-semibold
                flex
                items-center
                gap-2
                hover:scale-105
                transition-all
                "
              >
                Explore Courses

                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  navigate("/register")
                }
                className="
                cta-button
                px-8
                py-4
                rounded-2xl
                border
                border-white/30
                bg-white/10
                backdrop-blur-lg
                text-white
                font-semibold
                hover:bg-white/20
                transition-all
                "
              >
                Get Started Free
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CTABanner;