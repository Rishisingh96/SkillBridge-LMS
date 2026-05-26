import React from "react";
import img from "../assets/myphoto.png";
import video from "../assets/Pika.mp4";

import { FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-[#f8f9fc] py-16 px-5 lg:px-20 flex items-center justify-center">
      
      {/* Main Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT SIDE */}
        <div className="relative flex items-center justify-center">

          {/* Main Image */}
          <div className="relative w-full max-w-[520px]">
            <img
              src={img}
              alt="about"
              className="w-full h-[520px] object-cover rounded-[28px] shadow-2xl"
            />

            {/* Video Card */}
            <div className="absolute bottom-[-35px] right-[-20px] bg-white p-3 rounded-[22px] shadow-2xl border border-gray-200 w-[280px]">
              <video
                src={video}
                autoPlay
                muted
                loop
                controls
                className="w-full h-[170px] object-cover rounded-[16px]"
              />
            </div>

            {/* Glow Effect */}
            <div className="absolute -z-10 top-[-40px] left-[-40px] w-[180px] h-[180px] bg-blue-400/20 blur-[90px] rounded-full"></div>

            <div className="absolute -z-10 bottom-[-20px] right-[-20px] w-[180px] h-[180px] bg-purple-400/20 blur-[90px] rounded-full"></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">

          {/* Small Heading */}
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-semibold uppercase tracking-[3px] text-sm">
              About Us
            </span>

            <div className="w-[60px] h-[2px] bg-blue-600"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-[38px] lg:text-[56px] leading-tight font-bold text-gray-900">
            We Are Maximizing Your
            <span className="text-blue-600"> Learning Growth</span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-[17px] leading-8 max-w-[650px]">
            SkillBridge provides a modern Learning Management System
            designed to simplify online education, track progress,
            watch video lectures, practice coding, download notes,
            attend live classes, and collaborate with expert instructors.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:scale-[1.02] duration-300">
              <FaCheckCircle className="text-blue-600 text-[20px]" />

              <p className="font-semibold text-gray-800">
                Simplified Learning
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:scale-[1.02] duration-300">
              <FaCheckCircle className="text-blue-600 text-[20px]" />

              <p className="font-semibold text-gray-800">
                Expert Trainers
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:scale-[1.02] duration-300">
              <FaCheckCircle className="text-blue-600 text-[20px]" />

              <p className="font-semibold text-gray-800">
                Coding Practice
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:scale-[1.02] duration-300">
              <FaCheckCircle className="text-blue-600 text-[20px]" />

              <p className="font-semibold text-gray-800">
                Lifetime Access
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
              Explore Courses
            </button>

            <button className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-7 py-3 rounded-xl font-semibold transition-all duration-300">
              Learn More
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default About;