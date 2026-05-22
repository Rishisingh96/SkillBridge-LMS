import React from 'react'
import { ImStarFull } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import empty from '../assets/Empty.png'

const Card = ({ thumbnail, title, category, price, id, reviews }) => {
    const navigate = useNavigate()

     const calculateAvgReview = (reviews) =>{
    if(!reviews || reviews.length === 0){
      return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total/reviews.length).toFixed(1)
  }

  
    const avgRating = calculateAvgReview(reviews)
   
    // console.log("Avg in Card Component Rating:", avgRating)
    return (
        <div className='w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer'>

            {/* Image */}
            <div className='overflow-hidden'>
                <img
                    src={thumbnail || empty }
                    alt={title}
                    className='w-full h-52 object-cover hover:scale-105 transition-all duration-300'
                    onClick={()=>navigate(`/viewcourse/${id}`)}
                />
            </div>

            {/* Content */}
            <div className='p-5 space-y-4'>

                {/* Title */}
                <h2 className='text-2xl font-bold text-gray-900 line-clamp-2'>
                    {title}
                </h2>

                {/* Category */}
                <span className='inline-block bg-gray-100 text-gray-700 text-sm px-4 py-1 rounded-full'>
                    {category}
                </span>

                {/* Bottom */}
                <div className='flex items-center justify-between pt-2'>

                    <span className='text-2xl font-bold text-gray-900'>
                        ₹{price}
                    </span>

                    <div className='flex items-center gap-1 text-yellow-400'>
                        <ImStarFull />
                        <span className='text-gray-700 font-medium'>{avgRating}</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Card