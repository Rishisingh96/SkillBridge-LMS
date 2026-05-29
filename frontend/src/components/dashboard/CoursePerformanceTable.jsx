import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiSearch,
  FiArrowUpRight,
  FiUsers,
  FiStar,
  FiDollarSign,
  FiEdit3,
  FiGrid,
  FiTrendingUp,
} from "react-icons/fi";

const CoursePerformanceTable = () => {

  const { stats } = useSelector(
    (state) => state.dashboard
  );

  const navigate = useNavigate();

  const enrollmentByCourse =
    stats?.enrollmentByCourse || [];

  // =========================================================
  // STATES
  // =========================================================

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  // =========================================================
  // FILTERED DATA
  // =========================================================

  const filteredCourses = useMemo(() => {

    let filtered =
      enrollmentByCourse.filter((item) =>
        item.courseTitle
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    if (activeFilter === "live") {
      filtered = filtered.filter(
        (item) => item.isPublished
      );
    }

    if (activeFilter === "draft") {
      filtered = filtered.filter(
        (item) => !item.isPublished
      );
    }

    return filtered;

  }, [
    enrollmentByCourse,
    search,
    activeFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalRevenue =
    filteredCourses.reduce(
      (acc, item) =>
        acc +
        (item.price || 0) *
          item.enrollmentCount,
      0
    );

  const totalStudents =
    filteredCourses.reduce(
      (acc, item) =>
        acc + item.enrollmentCount,
      0
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative mt-10">

      {/* BG EFFECTS */}
      <div
        className="
          absolute
          top-0
          right-0
          w-80
          h-80
          bg-violet-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-72
          h-72
          bg-cyan-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-gray-200/70
          dark:border-white/10
          bg-white/80
          dark:bg-[#020617]/70
          backdrop-blur-2xl
          shadow-[0_10px_50px_rgba(0,0,0,0.08)]
        "
      >

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div
          className="
            p-6
            border-b
            border-gray-200/70
            dark:border-white/10
          "
        >

          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-6
            "
          >

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-600
                    to-indigo-500
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                  "
                >
                  <FiGrid size={24} />
                </div>

                <div>

                  <h2
                    className="
                      text-2xl
                      font-black
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Course Performance
                  </h2>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                      mt-1
                    "
                  >
                    Analytics and growth of your courses
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                items-stretch
                sm:items-center
                gap-4
                w-full
                xl:w-auto
              "
            >

              {/* SEARCH */}
              <div
                className="
                  relative
                  w-full
                  sm:w-[320px]
                "
              >

                <FiSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200/70
                    dark:border-white/10
                    bg-white/70
                    dark:bg-white/5
                    backdrop-blur-xl
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                    font-medium
                    text-gray-800
                    dark:text-white
                    placeholder:text-gray-400
                    outline-none
                    transition-all
                    duration-300
                    focus:ring-2
                    focus:ring-violet-500/40
                  "
                />

              </div>

              {/* FILTERS */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-gray-200/70
                  dark:border-white/10
                  bg-white/70
                  dark:bg-white/5
                  backdrop-blur-xl
                  p-1
                "
              >

                {[
                  {
                    key: "all",
                    label: "All",
                  },
                  {
                    key: "live",
                    label: "Live",
                  },
                  {
                    key: "draft",
                    label: "Draft",
                  },
                ].map((item) => (

                  <button
                    key={item.key}
                    onClick={() =>
                      setActiveFilter(
                        item.key
                      )
                    }
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      ${
                        activeFilter ===
                        item.key
                          ? `
                            bg-gradient-to-r
                            from-violet-600
                            to-indigo-500
                            text-white
                            shadow-lg
                          `
                          : `
                            text-gray-600
                            dark:text-gray-300
                            hover:bg-gray-100
                            dark:hover:bg-white/10
                          `
                      }
                    `}
                  >
                    {item.label}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* =========================================================
              STATS CARDS
          ========================================================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              mt-8
            "
          >

            {[
              {
                title: "Total Courses",
                value:
                  filteredCourses.length,
                icon: <FiGrid />,
                gradient:
                  "from-violet-600 to-indigo-500",
              },
              {
                title: "Total Students",
                value:
                  totalStudents.toLocaleString(),
                icon: <FiUsers />,
                gradient:
                  "from-cyan-500 to-sky-500",
              },
              {
                title: "Revenue",
                value: `₹${totalRevenue.toLocaleString()}`,
                icon: <FiDollarSign />,
                gradient:
                  "from-emerald-500 to-green-500",
              },
            ].map((card, index) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.1,
                }}
                whileHover={{
                  y: -4,
                }}
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-200/70
                  dark:border-white/10
                  bg-white/80
                  dark:bg-white/5
                  backdrop-blur-xl
                  p-5
                "
              >

                <div
                  className={`
                    absolute
                    top-0
                    right-0
                    w-28
                    h-28
                    bg-gradient-to-br
                    ${card.gradient}
                    opacity-10
                    blur-2xl
                    rounded-full
                  `}
                />

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {card.title}
                    </p>

                    <h3
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {card.value}
                    </h3>

                  </div>

                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      bg-gradient-to-br
                      ${card.gradient}
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-lg
                    `}
                  >
                    {card.icon}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* =========================================================
            TABLE DESKTOP
        ========================================================= */}

        <div className="hidden lg:block overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  border-b
                  border-gray-200/70
                  dark:border-white/10
                  bg-gray-50/70
                  dark:bg-white/5
                "
              >

                {[
                  "#",
                  "Course",
                  "Students",
                  "Revenue",
                  "Reviews",
                  "Status",
                  "Action",
                ].map((head, i) => (

                  <th
                    key={i}
                    className="
                      px-6
                      py-5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {head}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              <AnimatePresence>

                {filteredCourses.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="
                        py-20
                        text-center
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >

                        <div
                          className="
                            w-20
                            h-20
                            rounded-3xl
                            bg-gradient-to-br
                            from-violet-600
                            to-indigo-500
                            text-white
                            flex
                            items-center
                            justify-center
                            text-3xl
                          "
                        >
                          📚
                        </div>

                        <h3
                          className="
                            mt-5
                            text-xl
                            font-bold
                            text-gray-800
                            dark:text-white
                          "
                        >
                          No Courses Found
                        </h3>

                        <p
                          className="
                            mt-2
                            text-sm
                            text-gray-500
                          "
                        >
                          Try another search or filter
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredCourses.map(
                    (
                      item,
                      index
                    ) => {

                      const revenue =
                        (
                          item.price || 0
                        ) *
                        item.enrollmentCount;

                      return (

                        <motion.tr
                          key={
                            item.courseId
                          }
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.05,
                          }}
                          whileHover={{
                            backgroundColor:
                              "rgba(120,119,198,0.03)",
                          }}
                          className="
                            border-b
                            border-gray-100
                            dark:border-white/5
                            transition-all
                          "
                        >

                          {/* INDEX */}
                          <td
                            className="
                              px-6
                              py-5
                              text-sm
                              font-semibold
                              text-gray-500
                            "
                          >
                            {index + 1}
                          </td>

                          {/* COURSE */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              {item.thumbnail ? (

                                <img
                                  src={
                                    item.thumbnail
                                  }
                                  alt=""
                                  className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    object-cover
                                    border
                                    border-gray-200
                                    dark:border-white/10
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
                                    to-indigo-500
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                  "
                                >
                                  {item.courseTitle
                                    ?.slice(
                                      0,
                                      2
                                    )
                                    .toUpperCase()}
                                </div>

                              )}

                              <div>

                                <h3
                                  className="
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                  "
                                >
                                  {
                                    item.courseTitle
                                  }
                                </h3>

                                <p
                                  className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                  "
                                >
                                  Course analytics
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* STUDENTS */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2">

                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-xl
                                  bg-cyan-100
                                  dark:bg-cyan-500/10
                                  text-cyan-600
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <FiUsers />
                              </div>

                              <span
                                className="
                                  font-bold
                                  text-gray-800
                                  dark:text-white
                                "
                              >
                                {
                                  item.enrollmentCount
                                }
                              </span>

                            </div>

                          </td>

                          {/* REVENUE */}
                          <td className="px-6 py-5">

                            <span
                              className="
                                text-emerald-600
                                font-black
                              "
                            >
                              ₹
                              {revenue.toLocaleString()}
                            </span>

                          </td>

                          {/* REVIEWS */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2">

                              <FiStar
                                className="
                                  text-yellow-500
                                "
                              />

                              <span
                                className="
                                  font-semibold
                                  text-gray-800
                                  dark:text-white
                                "
                              >
                                {item.reviewCount ||
                                  0}
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-5">

                            {item.isPublished ? (

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  px-4
                                  py-2
                                  text-xs
                                  font-bold
                                  bg-emerald-100
                                  dark:bg-emerald-500/10
                                  text-emerald-700
                                  dark:text-emerald-300
                                "
                              >

                                <span
                                  className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-emerald-500
                                  "
                                />

                                Live

                              </span>

                            ) : (

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  px-4
                                  py-2
                                  text-xs
                                  font-bold
                                  bg-gray-100
                                  dark:bg-white/10
                                  text-gray-700
                                  dark:text-gray-300
                                "
                              >

                                <span
                                  className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-gray-400
                                  "
                                />

                                Draft

                              </span>

                            )}

                          </td>

                          {/* ACTION */}
                          <td className="px-6 py-5">

                            <button
                              onClick={() =>
                                navigate(
                                  `/educator/edit-course/${item.courseId}`
                                )
                              }
                              className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-2xl
                                bg-black
                                dark:bg-white
                                text-white
                                dark:text-black
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                hover:scale-105
                              "
                            >

                              <FiEdit3 />

                              Manage

                              <FiArrowUpRight
                                className="
                                  group-hover:translate-x-1
                                  group-hover:-translate-y-1
                                  transition-all
                                "
                              />

                            </button>

                          </td>

                        </motion.tr>
                      );
                    }
                  )

                )}

              </AnimatePresence>

            </tbody>

          </table>

        </div>

        {/* =========================================================
            MOBILE CARDS
        ========================================================= */}

        <div
          className="
            lg:hidden
            p-5
            space-y-4
          "
        >

          {filteredCourses.length === 0 ? (

            <div
              className="
                py-20
                text-center
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  text-gray-800
                  dark:text-white
                "
              >
                No Courses Found
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                "
              >
                Try another search.
              </p>

            </div>

          ) : (

            filteredCourses.map(
              (
                item,
                index
              ) => {

                const revenue =
                  (
                    item.price || 0
                  ) *
                  item.enrollmentCount;

                return (

                  <motion.div
                    key={item.courseId}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="
                      rounded-3xl
                      border
                      border-gray-200/70
                      dark:border-white/10
                      bg-white/80
                      dark:bg-white/5
                      backdrop-blur-xl
                      p-5
                    "
                  >

                    {/* TOP */}
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div className="flex gap-4">

                        {item.thumbnail ? (

                          <img
                            src={
                              item.thumbnail
                            }
                            alt=""
                            className="
                              w-16
                              h-16
                              rounded-2xl
                              object-cover
                            "
                          />

                        ) : (

                          <div
                            className="
                              w-16
                              h-16
                              rounded-2xl
                              bg-gradient-to-br
                              from-violet-600
                              to-indigo-500
                              text-white
                              flex
                              items-center
                              justify-center
                              font-bold
                            "
                          >
                            {item.courseTitle
                              ?.slice(0, 2)
                              .toUpperCase()}
                          </div>

                        )}

                        <div>

                          <h3
                            className="
                              font-bold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            {
                              item.courseTitle
                            }
                          </h3>

                          <div
                            className="
                              mt-2
                              inline-flex
                              items-center
                              gap-2
                            "
                          >

                            {item.isPublished ? (

                              <span
                                className="
                                  text-xs
                                  font-bold
                                  text-emerald-600
                                "
                              >
                                ● Live
                              </span>

                            ) : (

                              <span
                                className="
                                  text-xs
                                  font-bold
                                  text-gray-500
                                "
                              >
                                ● Draft
                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* STATS */}
                    <div
                      className="
                        grid
                        grid-cols-3
                        gap-3
                        mt-5
                      "
                    >

                      {[
                        {
                          label:
                            "Students",
                          value:
                            item.enrollmentCount,
                        },
                        {
                          label:
                            "Revenue",
                          value: `₹${revenue}`,
                        },
                        {
                          label:
                            "Reviews",
                          value:
                            item.reviewCount ||
                            0,
                        },
                      ].map(
                        (
                          stat,
                          i
                        ) => (

                          <div
                            key={i}
                            className="
                              rounded-2xl
                              bg-gray-50
                              dark:bg-white/5
                              p-3
                              text-center
                            "
                          >

                            <p
                              className="
                                text-xs
                                text-gray-500
                              "
                            >
                              {
                                stat.label
                              }
                            </p>

                            <h4
                              className="
                                mt-1
                                text-sm
                                font-bold
                                text-gray-900
                                dark:text-white
                              "
                            >
                              {
                                stat.value
                              }
                            </h4>

                          </div>
                        )
                      )}

                    </div>

                    {/* ACTION */}
                    <button
                      onClick={() =>
                        navigate(
                          `/educator/edit-course/${item.courseId}`
                        )
                      }
                      className="
                        mt-5
                        w-full
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-500
                        text-white
                        py-3
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      Manage Course

                      <FiTrendingUp />

                    </button>

                  </motion.div>
                );
              }
            )

          )}

        </div>

      </div>

    </div>
  );
};

export default CoursePerformanceTable;