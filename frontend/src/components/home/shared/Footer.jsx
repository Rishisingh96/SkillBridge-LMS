import React, { useEffect } from "react";

import logo from "../../../assets/logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      ".footer-column",
      { opacity: 0, y: 30 },
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

    gsap.fromTo(
      ".footer-bottom",
      { opacity: 0, y: 20 },
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
              <h2 className="text-xl font-extrabold tracking-wide text-gray-900 dark:text-gray-100 leading-tight">
                LEARN CODE
                <br />
                WITH DURGESH
              </h2>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-7 text-sm">
            Empowering the next generation of developers with premium,
            industry-ready coding education in Hindi. Over 500,000+ strong
            community.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3 mt-6">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <FaFacebookF size={15} />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-400 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <FaLinkedinIn size={15} />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <FaGithub size={16} />
            </a>
          </div>
        </div>

        {/* EXPLORE */}
        <div className="footer-column">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-400 dark:text-gray-500">
            Explore
          </h2>

          <ul className="space-y-4 text-gray-800 dark:text-gray-200 text-[15px] font-medium">
            <li
              onClick={() => navigate("/allcourses")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Courses
            </li>
            <li
              onClick={() => navigate("/handbooks")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Handbooks
            </li>
            <li
              onClick={() => navigate("/blogs")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Blogs
            </li>
            <li
              onClick={() => navigate("/flexbox-game")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Flex Box Game
            </li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-column">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-400 dark:text-gray-500">
            Company
          </h2>

          <ul className="space-y-4 text-gray-800 dark:text-gray-200 text-[15px] font-medium">
            <li
              onClick={() => navigate("/about")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              About Us
            </li>
            <li
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Privacy Policy
            </li>
            <li
              onClick={() => navigate("/terms")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Terms of Service
            </li>
            <li
              onClick={() => navigate("/refund-policy")}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              Refund Policy
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-400 dark:text-gray-500">
            Contact
          </h2>

          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HiOutlineMail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                Email Support
              </p>
              <a
                href="mailto:rishisinghdev98@gmail.com"
                className="block text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300"
              >
                rishisinghdev98@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <HiOutlinePhone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                Call Us
              </p>
              <a
                href="tel:+917800017055"
                className="block text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300"
              >
                +91-7800017055
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm text-gray-500 dark:text-gray-400">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Learn Code With Durgesh. All Rights
          Reserved.
        </p>

        <div className="flex items-center gap-6">
          <p
            onClick={() => navigate("/privacy-policy")}
            className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all duration-300"
          >
            Privacy Policy
          </p>

          <p
            onClick={() => navigate("/terms")}
            className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all duration-300"
          >
            Terms & Conditions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
