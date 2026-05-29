import React from "react";

const AnimatedBrand = ({ text = "SkillBridge", trigger }) => {
  return (
    <div
      className="hidden sm:block overflow-hidden select-none"
      style={{ perspective: "900px" }}
    >
      <h1 key={trigger} className="brand-container">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="letter"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      <style>{`
        .brand-container {
          font-size: 22px;
          font-weight: 900;
          display: flex;
          gap: 1px;
          color: inherit;
          letter-spacing: 0.5px;
        }

        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(-60px) rotateX(120deg) scale(0.8);
          transform-origin: top;
          animation: dropIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          text-shadow: 0 6px 20px rgba(0,0,0,0.25);
          transition: transform 0.3s ease;
        }

        /* Hover effect (premium feel) */
        .brand-container:hover .letter {
          transform: translateY(0) rotateX(0deg) scale(1.1);
        }

        @keyframes dropIn {
          0% {
            opacity: 0;
            transform: translateY(-60px) rotateX(120deg) scale(0.6);
            filter: blur(6px);
          }

          60% {
            opacity: 1;
            transform: translateY(8px) rotateX(-12deg) scale(1.05);
            filter: blur(0px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBrand;