import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiChevronRight,
  FiBookOpen,
  FiLogOut,
  FiUser,
  FiGrid,
} from "react-icons/fi";

import { categories } from "./categories";

const MobileMenu = ({
  showHam,
  setShowHam,
  userData,
  navigate,
  handleLogout,
}) => {

  const [showCategories, setShowCategories] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  // =========================================================
  // NAVIGATION LINKS
  // =========================================================

  const links = [
    {
      title: "Home",
      path: "/",
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
    <AnimatePresence>

      {showHam && (

        <>
          {/* ========================================================= */}
          {/* BACKDROP */}
          {/* ========================================================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setShowHam(false)
            }
            className="
              fixed
              inset-0
              bg-black/50
              backdrop-blur-sm
              z-40
              lg:hidden
            "
          />

          {/* ========================================================= */}
          {/* SIDEBAR */}
          {/* ========================================================= */}

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 220,
            }}
            className="
              fixed
              top-0
              right-0
              w-[88%]
              max-w-[380px]
              h-screen
              bg-white/90
              dark:bg-slate-900/90
              backdrop-blur-2xl
              border-l
              border-gray-200
              dark:border-slate-700
              z-50
              overflow-hidden
              flex
              flex-col
            "
          >

            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                p-5
                border-b
                border-gray-200
                dark:border-slate-700
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Menu
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Explore everything
                </p>

              </div>

              <button
                onClick={() =>
                  setShowHam(false)
                }
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-gray-100
                  dark:bg-slate-800
                  text-gray-700
                  dark:text-gray-300
                "
              >
                ✕
              </button>

            </div>

            {/* ========================================================= */}
            {/* USER */}
            {/* ========================================================= */}

            {userData && (

              <div
                className="
                  p-5
                  border-b
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <div className="flex items-center gap-4">

                  {userData?.photoUrl ? (

                    <img
                      src={userData.photoUrl}
                      alt="user"
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-600
                        to-cyan-500
                        flex
                        items-center
                        justify-center
                        text-white
                        font-bold
                        text-xl
                      "
                    >
                      {userData?.name
                        ?.slice(0, 1)
                        ?.toUpperCase()}
                    </div>

                  )}

                  <div className="min-w-0">

                    <h3
                      className="
                        font-bold
                        text-gray-900
                        dark:text-white
                        truncate
                      "
                    >
                      {userData?.name}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                        truncate
                      "
                    >
                      {userData?.email}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* MENU BODY */}
            {/* ========================================================= */}

            <div className="flex-1 overflow-y-auto p-4">

              {/* NORMAL LINKS */}

              <div className="space-y-2">

                {links.map((item, index) => (

                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setShowHam(false);
                    }}
                    className="
                      w-full
                      h-14
                      px-4
                      rounded-2xl
                      flex
                      items-center
                      justify-between
                      bg-gray-100
                      dark:bg-slate-800
                      hover:bg-gray-200
                      dark:hover:bg-slate-700
                      transition-all
                      duration-300
                    "
                  >

                    <span
                      className="
                        font-medium
                        text-gray-800
                        dark:text-gray-200
                      "
                    >
                      {item.title}
                    </span>

                    <FiChevronRight />

                  </button>
                ))}

              </div>

              {/* ========================================================= */}
              {/* COURSES */}
              {/* ========================================================= */}

              <div className="mt-6">

                <button
                  onClick={() =>
                    setShowCategories(
                      !showCategories
                    )
                  }
                  className="
                    w-full
                    h-14
                    px-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-cyan-500
                    text-white
                    flex
                    items-center
                    justify-between
                    font-semibold
                    shadow-lg
                  "
                >

                  <div className="flex items-center gap-3">

                    <FiGrid />

                    Courses

                  </div>

                  <FiChevronRight
                    className={`
                      transition-transform
                      duration-300
                      ${
                        showCategories
                          ? "rotate-90"
                          : ""
                      }
                    `}
                  />

                </button>

                {/* ========================================================= */}
                {/* CATEGORY LIST */}
                {/* ========================================================= */}

                <AnimatePresence>

                  {showCategories && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="
                        overflow-hidden
                        mt-3
                      "
                    >

                      <div className="space-y-2">

                        {categories.map(
                          (category) => (

                            <div
                              key={category.slug}
                            >

                              {/* CATEGORY */}

                              <button
                                onClick={() =>
                                  setSelectedCategory(
                                    selectedCategory ===
                                      category.slug
                                      ? null
                                      : category.slug
                                  )
                                }
                                className="
                                  w-full
                                  px-4
                                  py-4
                                  rounded-2xl
                                  bg-gray-100
                                  dark:bg-slate-800
                                  flex
                                  items-center
                                  justify-between
                                  text-left
                                "
                              >

                                <div>

                                  <h3
                                    className="
                                      font-semibold
                                      text-gray-900
                                      dark:text-white
                                    "
                                  >
                                    {
                                      category.title
                                    }
                                  </h3>

                                  <p
                                    className="
                                      text-xs
                                      text-gray-500
                                      mt-1
                                    "
                                  >
                                    {
                                      category
                                        .courses
                                        .length
                                    }{" "}
                                    Courses
                                  </p>

                                </div>

                                <FiChevronRight
                                  className={`
                                    transition-transform
                                    duration-300
                                    ${
                                      selectedCategory ===
                                      category.slug
                                        ? "rotate-90"
                                        : ""
                                    }
                                  `}
                                />

                              </button>

                              {/* COURSES */}

                              <AnimatePresence>

                                {selectedCategory ===
                                  category.slug && (

                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      height: 0,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      height: "auto",
                                    }}
                                    exit={{
                                      opacity: 0,
                                      height: 0,
                                    }}
                                    className="
                                      overflow-hidden
                                    "
                                  >

                                    <div
                                      className="
                                        mt-2
                                        ml-3
                                        space-y-2
                                      "
                                    >

                                      {category.courses.map(
                                        (
                                          course,
                                          index
                                        ) => (

                                          <button
                                            key={
                                              index
                                            }
                                            className="
                                              w-full
                                              px-4
                                              py-3
                                              rounded-2xl
                                              bg-white
                                              dark:bg-slate-900
                                              border
                                              border-gray-200
                                              dark:border-slate-700
                                              text-left
                                              hover:border-violet-500
                                              transition-all
                                            "
                                          >

                                            <div className="flex items-center justify-between">

                                              <div>

                                                <h4
                                                  className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900
                                                    dark:text-white
                                                  "
                                                >
                                                  {
                                                    course.title
                                                  }
                                                </h4>

                                                <p
                                                  className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                  "
                                                >
                                                  {
                                                    course.duration
                                                  }
                                                </p>

                                              </div>

                                              <FiBookOpen />

                                            </div>

                                          </button>
                                        )
                                      )}

                                    </div>

                                  </motion.div>
                                )}

                              </AnimatePresence>

                            </div>
                          )
                        )}

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

            </div>

            {/* ========================================================= */}
            {/* FOOTER */}
            {/* ========================================================= */}

            {userData ? (

              <div
                className="
                  p-4
                  border-t
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <button
                  onClick={handleLogout}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                  "
                >

                  <FiLogOut />

                  Logout

                </button>

              </div>

            ) : (

              <div
                className="
                  p-4
                  border-t
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <button
                  onClick={() =>
                    navigate("/login")
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-black
                    dark:bg-white
                    dark:text-black
                    text-white
                    font-semibold
                  "
                >
                  Login
                </button>

              </div>

            )}

          </motion.div>
        </>
      )}

    </AnimatePresence>
  );
};

export default MobileMenu;