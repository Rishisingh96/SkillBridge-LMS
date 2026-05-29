import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";

const CourseCarousel = () => {
  const { courseData } = useSelector((state) => state.course);

  const courses = courseData?.slice(0, 10) || [];

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">

      {/* Wrapper */}
      <div className="relative overflow-hidden rounded-2xl">

        {courses.map((course, index) => (
          <div
            key={course._id}
            className={`${index === 0 ? "block" : "hidden"} duration-700 ease-in-out`}
            data-carousel-item
          >
            <div className="flex justify-center py-10">
              <div className="w-[320px] sm:w-[350px]">
                <Card
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  reviews={course.reviews}
                />
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* controls same as your code */}
    </div>
  );
};

export default CourseCarousel;