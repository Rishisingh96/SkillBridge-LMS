import React from "react";
import logo from "../../assets/logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { FiArrowUpRight } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-black text-white pt-16 pb-8 px-6 lg:px-20 mt-20 overflow-hidden">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12">

        {/* LOGO & ABOUT */}
        <div>

          <div className="flex items-center gap-3 mb-5">
            <img
              src={logo}
              alt="logo"
              className="w-14 h-14 object-cover rounded-xl"
            />

            <div>
              <h2 className="text-2xl font-bold tracking-wide">
                SkillBridge
              </h2>

              <p className="text-sm text-gray-400">
                AI-Powered Learning Platform
              </p>
            </div>
          </div>

          <p className="text-gray-400 leading-7 text-sm">
            SkillBridge helps students master coding, AI, development,
            and real-world skills with premium online courses,
            live classes, projects, and expert mentorship.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mt-6">

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center cursor-pointer">
              <FaFacebookF />
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500 transition-all duration-300 flex items-center justify-center cursor-pointer">
              <FaInstagram />
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center cursor-pointer">
              <FaLinkedinIn />
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center cursor-pointer">
              <FaGithub />
            </div>

          </div>
        </div>

        {/* QUICK LINKS */}
        <div>

          <h2 className="text-xl font-semibold mb-6 text-white">
            Quick Links
          </h2>

          <ul className="space-y-4 text-gray-400 text-sm">

            <li
              onClick={() => navigate("/")}
              className="hover:text-blue-500 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <FiArrowUpRight />
              Home
            </li>

            <li
              onClick={() => navigate("/allcourses")}
              className="hover:text-blue-500 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <FiArrowUpRight />
              All Courses
            </li>

            <li
              onClick={() => navigate("/login")}
              className="hover:text-blue-500 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <FiArrowUpRight />
              Login
            </li>

            <li
              onClick={() => navigate("/profile")}
              className="hover:text-blue-500 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <FiArrowUpRight />
              My Profile
            </li>

          </ul>
        </div>

        {/* CATEGORIES */}
        <div>

          <h2 className="text-xl font-semibold mb-6 text-white">
            Categories
          </h2>

          <ul className="space-y-4 text-gray-400 text-sm">

            <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
              Web Development
            </li>

            <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
              App Development
            </li>

            <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
              AI / ML
            </li>

            <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
              UI / UX Design
            </li>

            <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
              Digital Marketing
            </li>

          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>

          <h2 className="text-xl font-semibold mb-6 text-white">
            Stay Updated
          </h2>

          <p className="text-gray-400 text-sm leading-7 mb-5">
            Subscribe to get latest updates, new courses,
            coding tips, and AI learning resources.
          </p>

          <div className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm"
            />

            <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-xl py-3 font-semibold shadow-lg">
              Subscribe Now
            </button>

          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm text-gray-500">

        <p>
          © {new Date().getFullYear()} SkillBridge. All Rights Reserved.
        </p>

        <div className="flex items-center gap-6">

          <p className="hover:text-blue-500 cursor-pointer transition-all duration-300">
            Privacy Policy
          </p>

          <p className="hover:text-blue-500 cursor-pointer transition-all duration-300">
            Terms & Conditions
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;