// TrustedCompanies.tsx
// Requirements: Tailwind CSS v3+, GSAP (npm i gsap)
// Usage: <TrustedCompanies />

import React, { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Company Data ─────────────────────────────────────────────────────────────
const COMPANIES = [
  {
    name: "Google",
    accentColor: "#4285F4",
    iconBg: "#E8F0FE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.09 22.56 15.37 22.56 12.25z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: "Microsoft",
    accentColor: "#00A4EF",
    iconBg: "#E3F5FE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 21 21" aria-hidden>
        <rect x="1" y="1" width="9" height="9" fill="#F35325" />
        <rect x="11" y="1" width="9" height="9" fill="#81BC06" />
        <rect x="1" y="11" width="9" height="9" fill="#05A6F0" />
        <rect x="11" y="11" width="9" height="9" fill="#FFBA08" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    accentColor: "#FF9900",
    iconBg: "#FFF3E0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6.9 17.5c3.6 2.4 8.3 3.1 13.3 1.7.3-.1.6.1.4.3C18 22 13.6 23 9.5 23 5 23 .7 21.1 -1 18c-.1-.2.1-.3.3-.2 2.5 1.5 5.4 2.4 7.6 2.4 1 0 2.1-.2 3-.7z" fill="#FF9900" />
        <path d="M18.5 15.8c-.3-.4-2-.2-2.7-.1-.2 0-.3-.2-.1-.3 1.3-.9 3.5-.7 3.8-.3.3.3-.1 2.5-1.3 3.5-.2.2-.4.1-.3-.1.3-.7.9-2.3.6-2.7z" fill="#FF9900" />
        <path d="M12 3C8.7 3 6 5.7 6 9s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" stroke="#FF9900" strokeWidth="1.5" fill="none" />
        <text x="12" y="10.5" textAnchor="middle" fill="#FF9900" fontSize="4.5" fontWeight="800">amazon</text>
      </svg>
    ),
  },
  {
    name: "Infosys",
    accentColor: "#007CC2",
    iconBg: "#E1F2FB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#007CC2" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold">INFO</text>
      </svg>
    ),
  },
  {
    name: "TCS",
    accentColor: "#0033A0",
    iconBg: "#E6EBFA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#0033A0" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">TCS</text>
      </svg>
    ),
  },
  {
    name: "Wipro",
    accentColor: "#341F6B",
    iconBg: "#EDE9F8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#341F6B" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">WIPRO</text>
      </svg>
    ),
  },
  {
    name: "Accenture",
    accentColor: "#A100FF",
    iconBg: "#F3E6FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polygon points="12,3 21,20 3,20" stroke="#A100FF" strokeWidth="2" fill="none" />
        <polygon points="12,9 18,20 8,20" fill="#A100FF" />
      </svg>
    ),
  },
  {
    name: "Meta",
    accentColor: "#0866FF",
    iconBg: "#E7EFFF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2.5 8c0-1.2.6-2.3 1.7-3 1-.6 2.3-.6 3.3 0l4.5 2.6 4.5-2.6c1-.6 2.3-.6 3.3 0 1.1.7 1.7 1.8 1.7 3v8c0 1.2-.6 2.3-1.7 3-1 .6-2.3.6-3.3 0L12 16.4l-4.5 2.6c-1 .6-2.3.6-3.3 0C3.1 18.3 2.5 17.2 2.5 16V8z" fill="#0866FF" />
      </svg>
    ),
  },
  {
    name: "IBM",
    accentColor: "#1F70C1",
    iconBg: "#E5F0FB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="4" fill="#1F70C1" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">IBM</text>
      </svg>
    ),
  },
  {
    name: "Oracle",
    accentColor: "#F80000",
    iconBg: "#FFECEC",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="none" stroke="#F80000" strokeWidth="2.5" />
        <ellipse cx="12" cy="12" rx="4.5" ry="3" fill="#F80000" opacity="0.2" />
      </svg>
    ),
  },
  {
    name: "Adobe",
    accentColor: "#FF0000",
    iconBg: "#FFEBEB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="4" fill="#FF0000" />
        <polygon points="12,4 20,20 4,20" fill="white" />
        <polygon points="12,10 16.5,20 9,20" fill="#FF0000" />
      </svg>
    ),
  },
  {
    name: "Salesforce",
    accentColor: "#00A1E0",
    iconBg: "#E0F4FC",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M10 5a3.5 3.5 0 0 1 6.5-1.5A3 3 0 0 1 20.5 6a3 3 0 0 1-.5 5.5H4.5a3.5 3.5 0 0 1 0-7A3.5 3.5 0 0 1 10 5z" fill="#00A1E0" />
      </svg>
    ),
  },
];

// Split into two rows for dual-direction marquee
const ROW_1 = COMPANIES.slice(0, 7);
const ROW_2 = COMPANIES.slice(5);

// ─── CompanyCard ──────────────────────────────────────────────────────────────
const CompanyCard = memo(({ company }) => {
  const cardRef = useRef(null);

  const handleEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.borderColor = company.accentColor + "55";
    cardRef.current.style.boxShadow = `0 6px 20px ${company.accentColor}22`;
    cardRef.current.style.transform = "translateY(-2px)";
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.borderColor = "";
    cardRef.current.style.boxShadow = "";
    cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="
        inline-flex items-center gap-2.5
        px-4 py-2.5 mx-2
        rounded-xl border border-gray-100
        bg-white dark:bg-gray-800 dark:border-gray-700
        cursor-pointer select-none shrink-0
        transition-[border-color,box-shadow,transform] duration-200
        shadow-sm
      "
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: company.iconBg }}
      >
        {company.icon}
      </div>

      {/* Name */}
      <span className="
        text-sm font-semibold tracking-tight whitespace-nowrap
        text-gray-800 dark:text-gray-100
      ">
        {company.name}
      </span>
    </div>
  );
});

CompanyCard.displayName = "CompanyCard";

// ─── MarqueeRow ───────────────────────────────────────────────────────────────
const MarqueeRow = memo(({ companies, direction, duration }) => {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const halfWidth = el.scrollWidth / 2;

    if (direction === "rtl") {
      tweenRef.current = gsap.to(el, {
        x: -halfWidth,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % halfWidth),
        },
      });
    } else {
      gsap.set(el, { x: -halfWidth });
      tweenRef.current = gsap.to(el, {
        x: 0,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const v = parseFloat(x) % halfWidth;
            return v > 0 ? v - halfWidth : v;
          }),
        },
      });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [direction, duration]);

  const handleMouseEnter = () => tweenRef.current?.timeScale(0.2);
  const handleMouseLeave = () => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5, ease: "power2.out" });
  };

  // Quadruple for seamless loop on all screen sizes
  const items = [...companies, ...companies, ...companies, ...companies];

  return (
    <div
      className="relative overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="inline-flex will-change-transform"
        aria-hidden="true"
      >
        {items.map((company, i) => (
          <CompanyCard key={`${direction}-${i}`} company={company} />
        ))}
      </div>
    </div>
  );
});

MarqueeRow.displayName = "MarqueeRow";

// ─── TrustedCompanies ─────────────────────────────────────────────────────────
const TrustedCompanies = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header scroll-triggered reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
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
      className="
        w-full overflow-hidden
        bg-gray-50 dark:bg-gray-900
        py-14 sm:py-16 lg:py-20
      "
      aria-label="Trusted by learners from top companies"
    >
      {/* ── Header ── */}
      <div
        ref={headerRef}
        className="text-center mb-10 px-4 opacity-0"
      >
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          10,000+ active learners
        </div>

        {/* Divider + label */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
            Trusted by professionals at
          </p>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600" />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Top companies worldwide
        </h2>
      </div>

      {/* ── Marquee rows ── */}
      <div className="flex flex-col gap-3">
        <MarqueeRow companies={ROW_1} direction="rtl" duration={28} />
        <MarqueeRow companies={ROW_2} direction="ltr" duration={34} />
      </div>
    </section>
  );
};

export default TrustedCompanies;