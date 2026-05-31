import React, { useEffect, useRef } from "react";
import Nav from "../../navbar/Navbar";
import Videobg from "../shared/Videobg";
import ai from "../../../assets/ai.png";
import heroStudent from "../../../assets/myphoto.png";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaUsers, FaBookOpen, FaAward, FaArrowRight,
  FaFire, FaChartLine, FaMedal, FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdRocketLaunch, MdVerified, MdOndemandVideo } from "react-icons/md";
import { TbChartInfographic, TbBrain, TbCode, TbCertificate } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";
import { FaLaptopCode, FaTrophy } from "react-icons/fa6";
import { BiSolidBadgeCheck } from "react-icons/bi";

gsap.registerPlugin(ScrollTrigger);

// ── Animated floating card ──────────────────────────────────────────────────
const FloatCard = ({ children, className = "" }) => (
  <div className={`floating-card ${className}`}>
    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {children}
    </div>
  </div>
);

// ── Stat item ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, suffix, label, accent, border }) => (
  <div className={`stat-card flex items-center gap-4 px-6 py-7 ${border ? "border-r border-white/10" : ""}`}>
    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0`}>
      <span className={accent}>{icon}</span>
    </div>
    <div>
      <h3
        className={`stat-number text-white text-3xl md:text-4xl font-black leading-none tracking-tight ${accent}`}
        data-value={value}
        data-suffix={suffix}
      >
        0{suffix}
      </h3>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
const HeroSection = React.memo(() => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Master entrance timeline ──────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge
      tl.fromTo(".hero-badge",
        { opacity: 0, y: -20, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55 }
      );

      // Student image from left
      tl.fromTo(".hero-image",
        { opacity: 0, x: -100, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power2.out" },
        0.1
      );

      // Floating cards pop in
      tl.fromTo(".floating-card",
        { opacity: 0, scale: 0.5, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.8)" },
        "-=0.5"
      );

      // Headings from right
      tl.fromTo(".hero-heading",
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.15 },
        "-=0.7"
      );

      // Subtitle
      tl.fromTo(".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55 },
        "-=0.35"
      );

      // Buttons
      tl.fromTo(".hero-btn",
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.14 },
        "-=0.3"
      );

      // Stats slide up
      tl.fromTo(".stat-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
        "-=0.2"
      );

      // ── Floating bob loop ──────────────────────────────────────────
      gsap.to(".floating-card", {
        y: -14,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.35, from: "random" },
      });

      // Subtle image breathe
      gsap.to(".hero-image", {
        scale: 1.015,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Counter animation ──────────────────────────────────────────
      document.querySelectorAll(".stat-number").forEach((el) => {
        const num = parseFloat(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: num,
            duration: 2.2,
            ease: "power2.out",
            delay: 1.4,
            snap: { innerText: 1 },
            onUpdate() {
              const v = parseFloat(this.targets()[0].innerText);
              el.textContent = Math.round(v) + suffix;
            },
          }
        );
      });

      // ── Sparkle shimmer on gradient text ─────────────────────────
      gsap.to(".hero-gradient-text", {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "none",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Videobg>
      <Nav />

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/45 to-blue-950/35 z-0 pointer-events-none" />

        {/* ── CONTENT WRAPPER ─────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-6">

          {/* Badge — centered top */}
          <div className="flex justify-center mb-8">
            <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl text-cyan-300 text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <HiSparkles className="text-cyan-400" />
              AI Powered Learning Platform
            </div>
          </div>

          {/* ── MAIN 2-COL GRID ─────────────────────────────────────
              LEFT  → Student image (big)
              RIGHT → Text + CTAs
          ─────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[520px_1fr] gap-8 xl:gap-14 items-center">

            {/* ── LEFT — Student Image ─────────────────────────── */}
            <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">

              {/* Glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

              <img
                src={heroStudent}
                alt="Student learning"
                className="hero-image relative z-10 w-full max-w-[440px] lg:max-w-[500px] xl:max-w-[520px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] select-none"
                draggable={false}
              />

              {/* ── Floating icon badges ─────────────────────── */}
              <FloatCard className="absolute top-8 right-6 lg:right-4 z-20">
                <FaBookOpen size={22} className="text-cyan-400" />
              </FloatCard>

              <FloatCard className="absolute top-1/3 -left-2 z-20">
                <PiStudentBold size={24} className="text-purple-400" />
              </FloatCard>

              <FloatCard className="absolute bottom-32 right-2 lg:-right-2 z-20">
                <FaLaptopCode size={22} className="text-blue-400" />
              </FloatCard>

              <FloatCard className="absolute bottom-10 left-4 z-20">
                <MdRocketLaunch size={24} className="text-pink-400" />
              </FloatCard>

              <FloatCard className="absolute top-16 left-1/3 z-20">
                <TbBrain size={24} className="text-yellow-400" />
              </FloatCard>

              <FloatCard className="absolute bottom-20 left-1/2 z-20">
                <FaTrophy size={22} className="text-orange-400" />
              </FloatCard>

            </div>

            {/* ── RIGHT — Text content ─────────────────────────── */}
            <div className="flex flex-col gap-5 order-1 lg:order-2">

              <div className="space-y-0.5">
                <h1 className="hero-heading text-white font-black leading-[1.0] tracking-tight text-4xl sm:text-5xl md:text-[56px] lg:text-[52px] xl:text-[62px] 2xl:text-[72px]">
                  Grow Your Skills to
                </h1>
                <h1
                  className="hero-heading hero-gradient-text font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-[56px] lg:text-[52px] xl:text-[62px] 2xl:text-[72px]"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #fff 0%, #a5f3fc 30%, #38bdf8 60%, #6366f1 80%, #a5f3fc 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Advance Your Career Path
                </h1>
              </div>

              <p className="hero-subtitle text-gray-300 text-base md:text-lg xl:text-xl max-w-[520px] leading-relaxed">
                Learn from industry experts with
                <span className="text-cyan-400 font-semibold"> 250+ premium courses </span>
                and hands-on projects designed to build real-world skills faster.
              </p>

              {/* Feature pills */}
              <div className="hero-subtitle flex flex-wrap gap-2">
                {[
                  { icon: <MdVerified size={14} />, label: "Certified Instructors" },
                  { icon: <MdOndemandVideo size={14} />, label: "HD Video Lessons" },
                  { icon: <BiSolidBadgeCheck size={14} />, label: "Industry Certificates" },
                  { icon: <FaFire size={14} />, label: "Live Projects" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-gray-300 text-xs font-medium"
                  >
                    <span className="text-cyan-400">{icon}</span>
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-1">
                <button
                  onClick={() => navigate("/allcourses")}
                  className="hero-btn group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-sm md:text-base flex items-center gap-3 overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.4)] hover:scale-105 hover:shadow-[0_12px_44px_rgba(37,99,235,0.55)] active:scale-[0.98] transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  View All Courses
                  <FaArrowRight className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </button>

                <button className="hero-btn group relative px-7 py-3.5 rounded-2xl bg-white/95 text-black font-bold text-sm md:text-base flex items-center gap-3 shadow-xl hover:scale-105 hover:bg-white active:scale-[0.98] transition-all duration-300">
                  Search With AI
                  <img src={ai} alt="AI" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>

            </div>
          </div>

          {/* ── STATS BAR ──────────────────────────────────────────── */}
          <div className="mt-10 lg:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-[28px] border border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(59,130,246,0.1)]">

              <StatCard
                icon={<FaUsers size={28} />}
                value="50" suffix="K+"
                label="Active Students"
                accent="text-cyan-400"
                border
              />
              <StatCard
                icon={<FaBookOpen size={28} />}
                value="250" suffix="+"
                label="Premium Courses"
                accent="text-blue-400"
                border
              />
              <StatCard
                icon={<TbCertificate size={28} />}
                value="15" suffix="K+"
                label="Certificates Issued"
                accent="text-purple-400"
                border
              />
              <StatCard
                icon={<FaChartLine size={28} />}
                value="98" suffix="%"
                label="Satisfaction Rate"
                accent="text-green-400"
                border={false}
              />

            </div>
          </div>

        </div>
      </section>
    </Videobg>
  );
});

export default HeroSection;