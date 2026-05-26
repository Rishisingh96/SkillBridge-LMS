import React from 'react'
import { FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const ReviewCard = ({
  comment,
  rating,
  photoUrl,
  name,
  description,
  courseTitle
}) => {

  return (

    <div className='group relative overflow-hidden bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>

      {/* Glow Effect */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500'></div>

      {/* Quote Icon */}
      <div className='absolute top-6 right-6'>
        <HiOutlineChatBubbleLeftRight className='text-3xl text-gray-200 group-hover:text-black transition-all duration-300' />
      </div>

      {/* User Info */}
      <div className='flex items-center gap-4 mb-6 relative z-10'>

        <img
          src={
            photoUrl ||
            "https://ui-avatars.com/api/?name=Student&background=random"
          }
          alt=""
          className='w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md'
        />

        <div>

          <h2 className='text-[20px] font-bold text-gray-900 capitalize'>
            {name || "Student"}
          </h2>

          <p className='text-sm text-gray-500 mt-1'>
            {description || "LMS Student"}
          </p>

        </div>

      </div>

      {/* Rating */}
      <div className='flex items-center gap-1 text-yellow-400 mb-5 relative z-10'>

        {
          Array(5).fill(0).map((_, index) => (
            <span key={index}>
              {
                index < rating
                  ? <FaStar className='text-[18px]' />
                  : <FaRegStar className='text-[18px]' />
              }
            </span>
          ))
        }

      </div>

      {/* Course Badge */}
      <div className='inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-xs font-medium mb-5 relative z-10'>

        {courseTitle || "Course"}

      </div>

      {/* Comment */}
      <p className='text-gray-600 leading-8 text-[15px] relative z-10'>

        “{comment}”

      </p>

    </div>

  )
}

export default ReviewCard