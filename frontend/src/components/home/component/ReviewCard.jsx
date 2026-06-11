import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const ReviewCard = React.memo(({
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
    <div
      className="
      group
      relative
      min-w-[350px]
      max-w-[350px]
      h-[420px]
      p-6
      rounded-3xl
      bg-white
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-300
      hover:-translate-y-2
      flex
      flex-col
      "
    >
      <div className="absolute top-4 right-4 text-slate-300">
        <HiOutlineChatBubbleLeftRight className="text-3xl" />
      </div>

      <div className="flex items-center gap-4 mb-5">
        <img
          src={
            photoUrl ||
            "https://ui-avatars.com/api/?name=Student&background=random"
          }
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="font-bold text-lg">
            {name}
          </h3>

          <p className="text-sm text-slate-500">
            Student
          </p>
        </div>
      </div>

      <div className="flex gap-1 text-yellow-400 mb-4">
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

      <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-white mb-4">
        {courseTitle}
      </div>

      <p className="text-slate-600 leading-7 flex-grow">
        "{displayComment}
        {isLong && !expanded ? "..." : ""}"
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-blue-600 text-sm font-medium"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";
export default ReviewCard;