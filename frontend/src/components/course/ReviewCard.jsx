import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const ReviewCard = ({
  comment = "",
  rating = 5,
  photoUrl,
  name = "Student",
  courseTitle = "Course",
}) => {
  const [expanded, setExpanded] = useState(false);

  const safeComment = comment || "";

  const isLong = safeComment.length > 140;

  const displayComment = expanded
    ? safeComment
    : safeComment.slice(0, 140);

  return (
    <div className="group relative p-5 sm:p-6 rounded-3xl overflow-hidden
      bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl
      border border-slate-200 dark:border-slate-700
      shadow-md hover:shadow-2xl transition-all duration-300
      hover:-translate-y-1 w-full">

      {/* background hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-black dark:bg-white transition"></div>

      {/* icon */}
      <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-700 dark:group-hover:text-white transition">
        <HiOutlineChatBubbleLeftRight className="text-2xl sm:text-3xl" />
      </div>

      {/* user */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 relative z-10">

        <img
          src={
            photoUrl ||
            "https://ui-avatars.com/api/?name=Student&background=random"
          }
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-slate-300 shadow-sm"
          alt="user"
        />

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {name}
        </h2>
      </div>

      {/* rating */}
      <div className="flex items-center gap-1 text-yellow-400 mb-3 relative z-10">
        {Array(5)
          .fill(0)
          .map((_, index) =>
            index < rating ? (
              <FaStar key={index} />
            ) : (
              <FaRegStar key={index} />
            )
          )}
      </div>

      {/* course */}
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        bg-slate-900 text-white dark:bg-white dark:text-black mb-4 relative z-10">
        {courseTitle}
      </div>

      {/* COMMENT */}
      <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-[15px] leading-7 relative z-10">
        “{displayComment}{isLong && !expanded ? "..." : ""}”
      </p>

      {/* BUTTON (FIXED CLICK ISSUE) */}
      {isLong && (
        <button
          type="button"
          onClick={() => {
            console.log("CLICKED VIEW MORE");
            setExpanded((prev) => !prev);
          }}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer relative z-10"
        >
          {expanded ? "Show less" : "View more"}
        </button>
      )}
    </div>
  );
};

export default ReviewCard;