import React from "react";
import { motion } from "framer-motion";
import { ImStarFull } from "react-icons/im";
import { HiMiniPlayCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import empty from "../../../assets/Empty.png";

const Card = React.memo(({
  thumbnail,
  title,
  category,
  price,
  id,
  reviews,
}) => {
  const navigate = useNavigate();

  // Average Rating
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
      onClick={() => navigate(`/course/${id}`)}
      className="group relative overflow-hidden rounded-[30px] border border-black/10 dark:border-white/10 
      bg-white/70 dark:bg-white/5 backdrop-blur-2xl 
      shadow-[0_10px_40px_rgba(0,0,0,0.06)] 
      hover:shadow-[0_20px_60px_rgba(124,58,237,0.25)]
      transition-all duration-500 cursor-pointer"
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 blur-3xl rounded-full" />
      </div>

      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        
        {/* Image */}
        <img
          src={thumbnail || empty}
          alt={title}
          loading="lazy"
          className="w-full h-[230px] sm:h-[240px] object-cover 
          transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

        {/* Play Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 w-12 h-12 rounded-2xl 
          bg-white/15 backdrop-blur-xl border border-white/20
          flex items-center justify-center shadow-xl"
        >
          <HiMiniPlayCircle className="text-white text-2xl" />
        </motion.div>

        {/* Category Badge */}
        <div
          className="absolute bottom-4 left-4 
          px-4 py-2 rounded-full 
          bg-white/15 backdrop-blur-xl border border-white/20
          text-white text-xs sm:text-sm font-semibold tracking-wide"
        >
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6">
        
        {/* Title */}
        <h2
          className="text-xl sm:text-2xl font-bold 
          text-gray-900 dark:text-white 
          leading-snug line-clamp-2
          group-hover:text-purple-600 dark:group-hover:text-purple-400
          transition-colors duration-300"
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          Learn modern industry-ready skills with immersive
          premium learning experience.
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent my-5" />

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          
          {/* Price */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Course Price
            </p>

            <h3
              className="text-2xl font-black 
              bg-gradient-to-r from-purple-500 to-pink-500 
              bg-clip-text text-transparent"
            >
              ₹{price}
            </h3>
          </div>

          {/* Ratings */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl
            bg-yellow-400/10 border border-yellow-400/20
            backdrop-blur-xl"
          >
            <ImStarFull className="text-yellow-400 text-lg" />

            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {avgRating}
              </span>

              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {reviews?.length || 0} Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Hover Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="mt-6 w-full py-3 rounded-2xl 
          bg-gradient-to-r from-purple-500 to-pink-500 
          text-white font-semibold tracking-wide
          shadow-lg shadow-purple-500/30
          hover:shadow-purple-500/50
          transition-all duration-300"
        >
          Explore Course
        </motion.button>
      </div>
    </motion.div>
  );
});

export default Card;