import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles } from "lucide-react";

import ReviewCard from "./ReviewCard";

const ReviewPage = () => {
  const { reviewData } = useSelector((state) => state.review);

  const [latestReview, setLatestReview] = useState([]);

  useEffect(() => {
    if (reviewData?.length > 0) {
      setLatestReview(reviewData.slice(0, 6));
    }
  }, [reviewData]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-20 z-0">
      
      {/* Background Glow */}
      <div className="absolute -z-10 top-10 left-[-120px] w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] bg-blue-500/10 blur-[140px] rounded-full"></div>

      <div className="absolute -z-10 bottom-10 right-[-120px] w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] bg-purple-500/10 blur-[140px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-5"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 backdrop-blur-md">

            <Sparkles size={16} />

            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Student Testimonials
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Real Reviews From
            <br />

            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Real Learners
            </span>
          </h1>

          <p className="mt-5 text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-7 text-sm sm:text-base px-2">
            Students share how this LMS helped them learn faster,
            build real-world projects, and grow their careers with
            confidence.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16"
        >

          {/* Reviews */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 text-center shadow-lg backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">

            <Quote
              className="mx-auto mb-3 text-blue-500"
              size={28}
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              5K+
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Student Reviews
            </p>
          </div>

          {/* Rating */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 text-center shadow-lg backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">

            <Star
              className="mx-auto mb-3 text-yellow-400 fill-yellow-400"
              size={28}
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              4.9
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Average Rating
            </p>
          </div>

          {/* Satisfaction */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 text-center shadow-lg backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">

            <Sparkles
              className="mx-auto mb-3 text-purple-500"
              size={28}
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              98%
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Satisfaction
            </p>
          </div>

          {/* Learners */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 text-center shadow-lg backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">

            <Quote
              className="mx-auto mb-3 text-pink-500"
              size={28}
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              10K+
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Happy Learners
            </p>
          </div>
        </motion.div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">

          {latestReview?.map((review, index) => (
            <motion.div
              key={review._id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative"
            >

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500"></div>

              {/* Review Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500">

                <ReviewCard
                  comment={review.comment}
                  rating={review.rating}
                  photoUrl={review.user?.photoUrl}
                  name={review.user?.name}
                  description={review.user?.description}
                  courseTitle={review.course?.title}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewPage;