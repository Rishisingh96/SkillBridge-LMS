// WhyChooseUs.tsx
// Requirements: Tailwind CSS v3+, GSAP (npm i gsap), lucide-react (npm i lucide-react)

import React, { useEffect, useRef, memo } from "react";
import { BookOpen, BadgeDollarSign, Award, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BookOpen,
    title: "250+ Premium Courses",
    description: "Access industry-focused courses designed by experts to get you job-ready fast.",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    glow: "group-hover:shadow-violet-500/20",
    iconColor: "text-violet-500",
    stat: "250+",
    statLabel: "Courses",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Learning",
    description: "Get maximum value with transparent, budget-friendly pricing — no hidden fees.",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    glow: "group-hover:shadow-emerald-500/20",
    iconColor: "text-emerald-500",
    stat: "₹199",
    statLabel: "Starting at",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn industry-recognized certificates to showcase your skills to employers.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    glow: "group-hover:shadow-amber-500/20",
    iconColor: "text-amber-500",
    stat: "100%",
    statLabel: "Recognized",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Learn alongside thousands of students with mentors available around the clock.",
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
    glow: "group-hover:shadow-sky-500/20",
    iconColor: "text-sky-500",
    stat: "10K+",
    statLabel: "Learners",
  },
];

// ─── FeatureCard ──────────────────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <div
      className={`
        feature-card group relative overflow-hidden
        rounded-2xl border border-white/60 dark:border-gray-700/60
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        p-7 lg:p-8
        shadow-sm hover:shadow-2xl ${feature.glow}
        transition-all duration-500 ease-out
        hover:-translate-y-2 cursor-default
      `}
    >
      {/* Background gradient blob */}
      <div
        className={`
          absolute -top-10 -right-10 w-40 h-40 rounded-full
          bg-gradient-to-br ${feature.gradient}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500 blur-2xl pointer-events-none
        `}
      />

      {/* Top row: icon + stat */}
      <div className="flex items-start justify-between mb-6">
        {/* Icon */}
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${feature.gradient.replace("transparent", "white/80")}
            border border-white/60 dark:border-gray-700/60
            group-hover:scale-110 transition-transform duration-300
          `}
        >
          <Icon size={26} className={feature.iconColor} strokeWidth={1.8} />
        </div>

        {/* Stat pill */}
        <div className="text-right">
          <p className={`text-2xl font-black tracking-tight ${feature.iconColor}`}>
            {feature.stat}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-widest">
            {feature.statLabel}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight leading-snug">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full
          bg-gradient-to-r ${feature.gradient.replace("to-transparent", "to-white/0").replace("from-", "from-").replace("/20", "")}
          transition-all duration-500 ease-out rounded-b-2xl
        `}
      />
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

// ─── WhyChooseUs ──────────────────────────────────────────────────────────────
const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header reveal ──
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Cards stagger ──
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".feature-card",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-slate-50 dark:bg-gray-900"
      aria-labelledby="why-choose-heading"
    >
      {/* ── Background decoration ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Top-left mesh */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-100/60 dark:bg-violet-900/30 blur-[100px]" />
        {/* Bottom-right mesh */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-sky-100/60 dark:bg-sky-900/30 blur-[100px]" />
        {/* Center subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="text-center mb-14 lg:mb-16 opacity-0"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm mb-5">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Why SkillBridge
            </span>
          </div>

          <h2
            id="why-choose-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight"
          >
            Everything You Need{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
                to Succeed
              </span>
              {/* Underline accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6 C50 2, 150 2, 198 6"
                  stroke="url(#uline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="uline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A complete learning ecosystem — expert-crafted courses, real certificates,
            and a community that grows with you.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-gray-500 text-sm">
            Join <span className="font-bold text-gray-800">10,000+</span> learners already upskilling
          </p>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex -space-x-2">
            {["bg-violet-400", "bg-sky-400", "bg-emerald-400", "bg-amber-400"].map((c, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-white ${c} flex items-center justify-center text-white text-[10px] font-bold`}
              >
                {["A", "B", "C", "D"][i]}
              </div>
            ))}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">and growing every day</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;