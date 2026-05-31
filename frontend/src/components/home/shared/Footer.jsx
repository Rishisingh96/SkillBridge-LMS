import React, { useEffect } from "react";

import logo from "../../../assets/logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,

} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Stagger animation for footer columns
    gsap.fromTo(
      ".footer-column",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-column",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Bottom section animation
    gsap.fromTo(
      ".footer-bottom",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-bottom",
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (

    <footer className="w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 pt-16 pb-8 px-6 lg:px-20 mt-20 overflow-hidden">



      {/* TOP SECTION */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-200 dark:border-slate-700 pb-12">



        {/* LOGO & ABOUT */}

        <div className="footer-column">



          <div className="flex items-center gap-3 mb-5">

            <img

              src={logo}

              alt="logo"

              className="w-14 h-14 object-cover rounded-xl"

            />



            <div>

              <h2 className="text-2xl font-bold tracking-wide text-gray-900 dark:text-gray-100">

                SkillBridge

              </h2>



              <p className="text-sm text-gray-600 dark:text-gray-300">

                AI-Powered Learning Platform

              </p>

            </div>

          </div>



          <p className="text-gray-600 dark:text-gray-300 leading-7 text-sm">

            SkillBridge helps students master coding, AI, development,

            and real-world skills with premium online courses,

            live classes, projects, and expert mentorship.

          </p>



          {/* SOCIAL ICONS */}

          <div className="flex items-center gap-4 mt-6">



            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300">

              <FaFacebookF />

            </div>



            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-pink-500 dark:hover:bg-pink-400 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300">

              <FaInstagram />

            </div>



            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300">

              <FaLinkedinIn />

            </div>



            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-300">

              <FaGithub />

            </div>



          </div>

        </div>



        {/* QUICK LINKS */}

        <div className="footer-column">



          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">

            Quick Links

          </h2>



          <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">



            <li

              onClick={() => navigate("/")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              Home

            </li>



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              All Courses

            </li>



            <li

              onClick={() => navigate("/login")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              Login

            </li>



            <li

              onClick={() => navigate("/profile")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              My Profile

            </li>



          </ul>

        </div>



        {/* CATEGORIES */}

        <div className="footer-column">



          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">

            Categories

          </h2>



          <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              Web Development

            </li>



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              App Development

            </li>



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              AI / ML

            </li>



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              UI / UX Design

            </li>



            <li

              onClick={() => navigate("/allcourses")}

              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer flex items-center gap-2"

            >

              <FiArrowUpRight />

              Digital Marketing

            </li>



          </ul>

        </div>



        {/* NEWSLETTER */}

        <div className="footer-column">



          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">

            Stay Updated

          </h2>



          <p className="text-gray-600 dark:text-gray-300 text-sm leading-7 mb-5">

            Subscribe to get latest updates, new courses,

            coding tips, and AI learning resources.

          </p>



          <div className="flex flex-col gap-4">



            <input

              type="email"

              placeholder="Enter your email"

              className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-500"

            />



            <button className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 rounded-xl py-3 font-semibold shadow-lg text-white">

              Subscribe Now

            </button>



          </div>

        </div>

      </div>



      {/* BOTTOM */}

      <div className="footer-bottom max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm text-gray-500 dark:text-gray-400">



        <p className="text-gray-500 dark:text-gray-400">

          © {new Date().getFullYear()} SkillBridge. All Rights Reserved.

        </p>



        <div className="flex items-center gap-6">



          <p className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all duration-300">

            Privacy Policy

          </p>



          <p className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all duration-300">

            Terms & Conditions

          </p>



        </div>

      </div>

    </footer>

  );

};



export default Footer;