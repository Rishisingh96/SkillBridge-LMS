import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard'
import { motion } from "framer-motion";

const ReviewPage = () => {

    const { reviewData } = useSelector(state => state.review)

    const [latestReview, setLatestReview] = useState([])

    useEffect(() => {

        if (reviewData) {
            setLatestReview(reviewData.slice(0, 6))
        }

    }, [reviewData])

    return (

        <div className='w-full bg-[#f8fafc] py-24 px-6 lg:px-20 relative overflow-hidden'>

            {/* Background Blur */}
            <div className='absolute top-0 left-0 w-72 h-72 bg-gray-200 rounded-full blur-3xl opacity-30'></div>

            <div className='absolute bottom-0 right-0 w-72 h-72 bg-gray-300 rounded-full blur-3xl opacity-30'></div>

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className='max-w-4xl mx-auto text-center mb-20 relative z-10'
            >

                <span className='px-5 py-2 rounded-full bg-black text-white text-sm font-medium inline-block mb-6'>
                    Student Testimonials
                </span>

                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6'>

                    Real Reviews From
                    <span className='block text-gray-500'>
                        Real Learners
                    </span>

                </h1>

                <p className='text-lg text-gray-600 leading-8 max-w-3xl mx-auto'>

                    Discover how our online learning platform is helping
                    students and professionals build new skills,
                    grow their careers, and achieve their goals.

                </p>

            </motion.div>

            {/* Review Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10'>

                {
                    latestReview?.map((review, index) => (

                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1
                            }}
                            viewport={{ once: true }}
                        >

                            <ReviewCard
                                comment={review.comment}
                                rating={review.rating}
                                photoUrl={review.user?.photoUrl}
                                name={review.user?.name}
                                description={review.user?.description}
                                courseTitle={review.course?.title}
                            />

                        </motion.div>

                    ))
                }

            </div>

        </div>

    )
}

export default ReviewPage