import React, { useState } from "react";
import { Star, Play, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import empty from "../../../assets/Empty.png";


const CourseCard = React.memo(({ thumbnail, title, category, price, id, reviews, enableMarquee = false }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Average rating
  const avgRating = React.useMemo(() => {
    if (!reviews?.length) return "4.8";
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const reviewCount = reviews?.length || 12;

  return (
    <>
      <article
        onClick={() => navigate(`/course/${id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`View course: ${title}`}
        style={enableMarquee ? {
          animation: "marquee-scroll 20s linear infinite",
          animationPlayState: hovered ? "paused" : "running",
        } : {}}
        className={`
          group relative cursor-pointer h-full flex flex-col rounded-3xl overflow-hidden
          bg-white dark:bg-[#110f1e]
          border border-slate-200/80 dark:border-white/8
          shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]
          hover:shadow-[0_20px_48px_-8px_rgba(124,58,237,0.25)]
          transition-all duration-500 ease-out
          hover:-translate-y-2 hover:scale-[1.015]
          focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2
        `}
      >

        {/* ── Ambient glow ring (hover only) ── */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent
            group-hover:border-purple-500/30 dark:group-hover:border-purple-400/25
            transition-all duration-500 z-20"
        />

        {/* ── Thumbnail ── */}
        <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
          <img
            src={thumbnail || empty}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient overlay on hover */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Category badge */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide
            bg-black/60 dark:bg-white/80 backdrop-blur-md
            text-white dark:text-slate-900 border border-white/10 dark:border-black/5">
            {category || "Technology"}
          </div>

          {/* Play button */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-xl
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-white/10
            flex items-center justify-center shadow-sm
            group-hover:bg-purple-600 group-hover:border-purple-500
            transition-all duration-300">
            <Play className="w-4 h-4 text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors fill-current" aria-hidden />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-4 pb-0 gap-3">

          {/* Title with marquee - scrolls by default, pauses on hover */}
          <div className="overflow-hidden w-full">
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                animation: "marquee-ltr 5s linear infinite",
                willChange: "transform",
                animationPlayState: hovered ? "paused" : "running",
              }}
            >
              {/* Copy 1 */}
              <span className="text-base sm:text-[17px] font-bold leading-snug text-purple-600 dark:text-purple-400 pr-12 shrink-0">
                {title}
              </span>
              {/* Copy 2 — creates seamless loop */}
              <span className="text-base sm:text-[17px] font-bold leading-snug text-purple-600 dark:text-purple-400 pr-12 shrink-0">
                {title}
              </span>
            </div>
          </div>

          {/* Sub-description */}
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
            Learn real industry skills with immersive modules designed by experts.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-4 mt-auto border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">

          {/* Price */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-0.5">
              Price
            </p>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {price === 0 ? "Free" : `₹${price}`}
            </span>
          </div>

          {/* Rating + CTA */}
          <div className="flex items-center gap-2.5">
            {/* Rating pill */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{avgRating}</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{reviewCount} reviews</span>
            </div>

            {/* Arrow CTA button */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
              bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5
              text-slate-500 dark:text-slate-400
              group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500
              group-hover:border-transparent group-hover:text-white
              transition-all duration-300">
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45"
                aria-hidden
              />
            </div>
          </div>
        </div>

      </article>

      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
});

CourseCard.displayName = "CourseCard";
export default CourseCard;