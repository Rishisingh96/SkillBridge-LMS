import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ReviewCard from "../component/ReviewCard";

gsap.registerPlugin(ScrollTrigger);

const Reviews = () => {
  const { reviewData, loading } = useSelector(
    (state) => state.review
  );

  const reviews = reviewData || [];

  useEffect(() => {
    // Header animation
    const headerAnim = gsap.fromTo(
      ".reviews-header",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reviews-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for review cards
    const cardsAnim = gsap.fromTo(
      ".review-card-item",
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".review-card-item",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      headerAnim.kill();
      cardsAnim.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-gray-900 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4">

        <div className="reviews-header text-center mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-5">
            <Sparkles size={16} />
            Student Reviews
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Loved By Thousands Of Learners
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Real experiences from students who transformed
            their careers through our platform.
          </p>

        </div>

      </div>

      {/* Row 1 */}

      {loading ? (
        // Skeleton loader while reviews are loading
        <div className="relative flex overflow-hidden mb-8">
          <div className="flex gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-80 h-48 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 flex-shrink-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex overflow-hidden mb-8">

            <div className="flex gap-6 animate-marquee">

              {[...reviews, ...reviews].map(
                (review, index) => (
                  <div key={index} className="review-card-item">
                    <ReviewCard
                      comment={review.comment}
                      rating={review.rating}
                      photoUrl={review.user?.photoUrl}
                      name={review.user?.name}
                      courseTitle={review.course?.title}
                    />
                  </div>
                )
              )}

            </div>

          </div>

          {/* Row 2 */}

          <div className="relative flex overflow-hidden">

            <div className="flex gap-6 animate-marquee-reverse">

              {[...reviews, ...reviews].map(
                (review, index) => (
                  <div key={`review-${index}`} className="review-card-item">
                    <ReviewCard
                      comment={review.comment}
                      rating={review.rating}
                      photoUrl={review.user?.photoUrl}
                      name={review.user?.name}
                      courseTitle={review.course?.title}
                    />
                  </div>
                )
              )}

            </div>

          </div>
        </>
      )}

    </section>
  );
};

export default Reviews;