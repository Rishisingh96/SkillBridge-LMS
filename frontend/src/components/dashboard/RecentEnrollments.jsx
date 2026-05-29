import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  fetchRecentEnrollments,
} from "../../redux/slices/dashboardSlice";

import {
  FiUsers,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiClock,
  FiSearch,
} from "react-icons/fi";

import {
  MdClose,
} from "react-icons/md";

const RecentEnrollments = () => {

  const dispatch = useDispatch();

  const {
    recentEnrollments,
  } = useSelector(
    (state) => state.dashboard
  );

  const [selectedUser, setSelectedUser] =
    useState(null);

  // =========================================================
  // SEARCH STATE
  // =========================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {

    dispatch(
      fetchRecentEnrollments()
    );

  }, [dispatch]);

  const list =
    recentEnrollments || [];

  // =========================================================
  // SEARCH FILTER LOGIC
  // =========================================================

  const filteredList = list.filter(
    (enrollment) => {

      const userName =
        enrollment.user?.name?.toLowerCase() || "";

      const userEmail =
        enrollment.user?.email?.toLowerCase() || "";

      const courseTitle =
        enrollment.course?.title?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase();

      return (
        userName.includes(search) ||
        userEmail.includes(search) ||
        courseTitle.includes(search)
      );
    }
  );

  // =========================================================
  // TIME AGO
  // =========================================================

  const timeAgo = (date) => {

    const seconds = Math.floor(
      (new Date() -
        new Date(date)) /
        1000
    );

    if (seconds < 3600)
      return `${Math.floor(
        seconds / 60
      )}m ago`;

    if (seconds < 86400)
      return `${Math.floor(
        seconds / 3600
      )}h ago`;

    return `${Math.floor(
      seconds / 86400
    )}d ago`;
  };

  return (
    <>
      {/* =========================================================
          MAIN CARD
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

        {/* BG GRADIENT */}
        <div
          className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-violet-500/10
            blur-3xl
            rounded-full
          "
        />

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
            p-6
            border-b
            border-gray-200/70
            dark:border-white/10
          "
        >

          {/* LEFT */}
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

              <FiUsers size={24} />

            </div>

            <div>

              <h2
                className="
                  text-xl
                  font-black
                  text-gray-900
                  dark:text-white
                "
              >
                Recent Enrollments
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                Latest students joined your courses
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 w-full lg:w-auto">

            {/* SEARCH BAR */}
            <div
              className="
                relative
                flex-1
                lg:w-[320px]
              "
            >

              <FiSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  text-lg
                "
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search student or course..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200/70
                  dark:border-white/10
                  bg-white/80
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

            {/* COUNT */}
            <div
              className="
                px-4
                py-3
                rounded-2xl
                bg-violet-100
                dark:bg-violet-500/10
                text-violet-700
                dark:text-violet-300
                text-sm
                font-bold
                whitespace-nowrap
              "
            >
              {filteredList.length}
            </div>

          </div>

        </div>

        {/* =========================================================
            GRID CARDS
        ========================================================= */}

        <div
          className="
            relative
            z-10
            p-6
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          {filteredList.length === 0 ? (

            <div
              className="
                col-span-full
                py-20
                text-center
              "
            >

              <h3
                className="
                  text-lg
                  font-bold
                  text-gray-700
                  dark:text-gray-300
                "
              >
                No Matching Enrollments
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                "
              >
                Try searching with another keyword.
              </p>

            </div>

          ) : (

            filteredList.map(
              (
                enrollment,
                index
              ) => (

                <motion.div

                  key={
                    enrollment._id
                  }

                  initial={{
                    opacity: 0,
                    y: 30,
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
                    y: -5,
                  }}

                  onClick={() =>
                    setSelectedUser(
                      enrollment
                    )
                  }

                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-gray-200/70
                    dark:border-white/10
                    bg-white/90
                    dark:bg-white/5
                    backdrop-blur-xl
                    p-5
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:shadow-2xl
                  "
                >

                  {/* HOVER EFFECT */}
                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      duration-500
                      bg-gradient-to-br
                      from-violet-500/5
                      to-cyan-500/5
                    "
                  />

                  {/* TOP */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      items-start
                      justify-between
                    "
                  >

                    {/* USER */}
                    <div className="flex items-center gap-4">

                      {enrollment.user
                        ?.photoUrl ? (

                        <img
                          src={
                            enrollment
                              .user
                              ?.photoUrl
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
                            text-lg
                            font-black
                          "
                        >

                          {enrollment.user?.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                      )}

                      <div>

                        <h3
                          className="
                            text-base
                            font-bold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {
                            enrollment.user
                              ?.name
                          }
                        </h3>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            mt-1
                          "
                        >
                          {
                            enrollment.user
                              ?.role ||
                            "Student"
                          }
                        </p>

                      </div>

                    </div>

                    <FiArrowRight
                      className="
                        text-gray-400
                        group-hover:translate-x-1
                        transition-all
                      "
                    />

                  </div>

                  {/* COURSE */}
                  <div
                    className="
                      relative
                      z-10
                      mt-5
                      rounded-2xl
                      bg-gray-50
                      dark:bg-white/5
                      p-4
                    "
                  >

                    <div className="flex items-center gap-3">

                      {enrollment.course
                        ?.thumbnail ? (

                        <img
                          src={
                            enrollment
                              .course
                              ?.thumbnail
                          }
                          alt=""
                          className="
                            w-12
                            h-12
                            rounded-xl
                            object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-black
                            text-white
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <FiBookOpen />

                        </div>

                      )}

                      <div className="min-w-0">

                        <h4
                          className="
                            text-sm
                            font-bold
                            text-gray-900
                            dark:text-white
                            truncate
                          "
                        >
                          {
                            enrollment
                              .course
                              ?.title
                          }
                        </h4>

                        <p
                          className="
                            text-xs
                            text-emerald-600
                            font-semibold
                            mt-1
                          "
                        >
                          ₹
                          {enrollment.pricePaid ||
                            "Free"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* FOOTER */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      justify-between
                      mt-5
                      pt-4
                      border-t
                      border-gray-200/70
                      dark:border-white/10
                    "
                  >

                    <div className="flex items-center gap-2">

                      <FiClock
                        className="
                          text-gray-400
                          text-sm
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {timeAgo(
                          enrollment.createdAt
                        )}
                      </span>

                    </div>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-violet-600
                        dark:text-violet-300
                      "
                    >
                      Active
                    </span>

                  </div>

                </motion.div>
              )
            )

          )}

        </div>

      </div>

      {/* =========================================================
          MODAL
      ========================================================= */}

      <AnimatePresence>

        {selectedUser && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            onClick={() =>
              setSelectedUser(null)
            }

            className="
              fixed
              inset-0
              z-50
              bg-black/50
              backdrop-blur-sm
              flex
              items-center
              justify-center
              px-4
            "
          >

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.9,
              }}

              onClick={(e) =>
                e.stopPropagation()
              }

              className="
                relative
                w-full
                max-w-md
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white
                dark:bg-[#020617]
                shadow-2xl
              "
            >

              {/* CLOSE */}
              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="
                  absolute
                  top-4
                  right-4
                  z-10
                  w-10
                  h-10
                  rounded-xl
                  bg-black/10
                  dark:bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >

                <MdClose size={20} />

              </button>

              {/* TOP */}
              <div
                className="
                  p-8
                  bg-gradient-to-br
                  from-violet-600
                  to-indigo-500
                  text-white
                  text-center
                "
              >

                {selectedUser.user
                  ?.photoUrl ? (

                  <img
                    src={
                      selectedUser.user
                        ?.photoUrl
                    }
                    alt=""
                    className="
                      w-24
                      h-24
                      rounded-3xl
                      object-cover
                      mx-auto
                      border-4
                      border-white
                    "
                  />

                ) : (

                  <div
                    className="
                      w-24
                      h-24
                      rounded-3xl
                      bg-white
                      text-black
                      flex
                      items-center
                      justify-center
                      text-3xl
                      font-black
                      mx-auto
                    "
                  >

                    {selectedUser.user?.name
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                )}

                <h2
                  className="
                    mt-4
                    text-2xl
                    font-black
                  "
                >
                  {
                    selectedUser.user
                      ?.name
                  }
                </h2>

                <p
                  className="
                    text-white/80
                    mt-1
                  "
                >
                  {
                    selectedUser.user
                      ?.role ||
                    "Student"
                  }
                </p>

              </div>

              {/* BODY */}
              <div className="p-6 space-y-4">

                {[
                  {
                    icon: <FiMail />,
                    label: "Email",
                    value:
                      selectedUser.user
                        ?.email ||
                      "N/A",
                  },
                  {
                    icon: <FiPhone />,
                    label: "Phone",
                    value:
                      selectedUser.user
                        ?.phone ||
                      "Not Provided",
                  },
                ].map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        bg-gray-50
                        dark:bg-white/5
                        p-4
                      "
                    >

                      <div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-black
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {item.icon}
                      </div>

                      <div>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          {item.label}
                        </p>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {item.value}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
};

export default RecentEnrollments;