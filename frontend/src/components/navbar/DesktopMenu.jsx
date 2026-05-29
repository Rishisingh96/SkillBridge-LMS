import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import CoursesMegaMenu from "./CoursesMegaMenu";

const DesktopMenu = ({
  userData,
  navigate,
}) => {

  const [showCourses, setShowCourses] =
    useState(false);

  const navLinks = [
    {
      title: "Home",
      path: "/",
    },

    {
      title: "Courses",
      megaMenu: true,
    },

    {
      title: "About",
      path: "/about",
    },

    {
      title: "Contact",
      path: "/contact",
    },
  ];

  return (
    <div className="hidden lg:flex items-center gap-2">

      {/* ========================================================= */}
      {/* NAV LINKS */}
      {/* ========================================================= */}

      {navLinks.map((item, index) => (

        <div
          key={index}
          className="relative"
          onMouseEnter={() => {
            if (item.megaMenu) {
              setShowCourses(true);
            }
          }}
        >

          {/* BUTTON */}

          <button
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              }
            }}
            className="
              relative
              h-11
              px-5
              rounded-2xl
              text-[15px]
              font-medium
              text-gray-700
              dark:text-gray-200
              hover:text-black
              dark:hover:text-white
              hover:bg-gray-100
              dark:hover:bg-slate-800
              transition-all
              duration-300
            "
          >

            <span className="relative z-10">
              {item.title}
            </span>

            {/* ACTIVE HOVER BG */}

            <motion.div
              layoutId="navbar-pill"
              className="
                absolute
                inset-0
                rounded-2xl
                bg-gray-100
                dark:bg-slate-800
                opacity-0
                hover:opacity-100
              "
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.5,
              }}
            />

          </button>

          {/* ========================================================= */}
          {/* MEGA MENU */}
          {/* ========================================================= */}

          <AnimatePresence>

            {item.megaMenu &&
              showCourses && (

                <div
                  onMouseLeave={() =>
                    setShowCourses(false)
                  }
                >

                  <CoursesMegaMenu
                    showCourses={
                      showCourses
                    }
                    setShowCourses={
                      setShowCourses
                    }
                  />

                </div>
              )}

          </AnimatePresence>

        </div>
      ))}

      {/* ========================================================= */}
      {/* CTA BUTTON */}
      {/* ========================================================= */}

      {!userData && (

        <button
          onClick={() =>
            navigate("/login")
          }
          className="
            ml-2
            h-11
            px-6
            rounded-2xl
            bg-black
            dark:bg-white
            dark:text-black
            text-white
            font-semibold
            hover:scale-[1.03]
            active:scale-[0.98]
            transition-all
            duration-300
            shadow-lg
          "
        >
          Get Started
        </button>

      )}

    </div>
  );
};

export default DesktopMenu;