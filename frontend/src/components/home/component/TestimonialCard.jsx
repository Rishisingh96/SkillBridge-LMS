import React from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Star,
} from "lucide-react";

const TestimonialCard = ({
  thumbnail,
  name,
  role,
  rating = 5,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="
      group
      overflow-hidden
      rounded-[30px]
      bg-white
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      "
    >
      <div className="relative">

        <img
          src={thumbnail}
          alt={name}
          loading="lazy"
          className="
          w-full
          h-[260px]
          object-cover
          "
        />

        <div
          className="
          absolute
          inset-0
          bg-black/30
          flex
          items-center
          justify-center
          "
        >
          <PlayCircle
            size={70}
            className="
            text-white
            group-hover:scale-110
            transition-all
            "
          />
        </div>

      </div>

      <div className="p-6">

        <div className="flex gap-1 text-yellow-400 mb-4">

          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill="currentColor"
            />
          ))}

        </div>

        <h3 className="font-bold text-xl">
          {name}
        </h3>

        <p className="text-slate-500 mt-1">
          {role}
        </p>

        <button
          className="
          mt-5
          w-full
          py-3
          rounded-2xl
          bg-slate-900
          text-white
          font-semibold
          "
        >
          Watch Testimonial
        </button>

      </div>
    </motion.div>
  );
};

export default TestimonialCard;