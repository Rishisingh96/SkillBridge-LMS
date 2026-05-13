import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Card from './Card';

const CardPage = () => {

    const { courseData } = useSelector((state) => state.course);

    const [popularCourses, setPopularCourses] = useState([]);

    useEffect(() => {

        if (courseData && courseData.length > 0) {
            setPopularCourses(courseData.slice(0, 6));
        }

    }, [courseData]);

    return (
        <div className='w-full px-5 py-16 flex flex-col items-center'>

            {/* Heading */}
            <h1 className='text-4xl font-bold text-gray-800 mb-4 text-center'>
                Our Popular Courses
            </h1>

            {/* Line */}
            <div className='w-24 h-1 bg-blue-500 rounded-full mb-5'></div>

            {/* Description */}
            <p className='text-gray-600 text-center max-w-2xl mb-12'>
                Explore top-rated courses designed to boost your skills,
                enhance your career, and help you achieve future success.
            </p>

            {/* Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl'>

                {
                    popularCourses.map((course, index) => (
                        <Card
                            key={index}
                            thumbnail={course.thumbnail}
                            title={course.title}
                            category={course.category}
                            price={course.price}
                            id = {course._id}

                        />
                    ))
                }

            </div>
        </div>
    )
}

export default CardPage