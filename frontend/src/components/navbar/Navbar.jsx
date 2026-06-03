import React, { useMemo, useState } from "react";

import logo from "../../assets/logo1.png";

import {
  HiOutlineMenuAlt3,
} from "react-icons/hi";

import {
  RxCross2,
} from "react-icons/rx";

import {
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiBookOpen,
  FiGrid,
} from "react-icons/fi";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

import { serverUrl } from "../../App";

import {
  setUserData,
} from "../../redux/slices/userSlice";

import {
  clearAllProgress,
} from "../../redux/slices/progressSlice";

import {
  clearModuleData,
} from "../../redux/slices/moduleSlice";

import DarkModeButton from "../ui/DarkModeButton";
import NotificationBell from "../ui/NotificationBell";

const Nav = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector(
    (state) => state.user
  );

  const { courseData } = useSelector(
    (state) => state.course
  );

  const [showProfile, setShowProfile] =
    useState(false);

  const [showMobile, setShowMobile] =
    useState(false);

  const [showCourses, setShowCourses] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const categories = useMemo(() => {

    if (!courseData) return [];

    return [
      ...new Set(
        courseData.map(
          (course) => course.category
        )
      ),
    ];

  }, [courseData]);

  React.useEffect(() => {

    if (
      categories.length > 0 &&
      !selectedCategory
    ) {
      setSelectedCategory(categories[0]);
    }

  }, [categories]);

  const filteredCourses =
    courseData?.filter(
      (course) =>
        course.category === selectedCategory
    );

  const handleLogout = async () => {

    try {

      await axios.get(
        serverUrl + "/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      localStorage.clear();

      dispatch(setUserData(null));
      dispatch(clearAllProgress());
      dispatch(clearModuleData());

      toast.success(
        "Logout Successfully"
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Logout Failed"
      );

    }
  };

  return (
    <>
      <header
        className="
          fixed
          top-0
          left-0
          w-full
          z-50
          border-b
          border-white/10
          bg-white/70
          dark:bg-[#020617]/70
          backdrop-blur-2xl
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            h-[74px]
            px-4
            lg:px-8
            flex
            items-center
            justify-between
          "
        >

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">

            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="
                flex
                items-center
                gap-3
                cursor-pointer
                group
              "
            >

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                "
              >

                <img
                  src={logo}
                  alt="logo"
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    object-cover
                    border
                    border-white/20
                    shadow-xl
                    group-hover:scale-105
                    transition-all
                    duration-300
                  "
                />

              </div>

              <div>

                <h1
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    text-gray-900
                    dark:text-white
                  "
                >
                  SkillBridge
                </h1>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-gray-400
                    -mt-1
                  "
                >
                  Learn Anything
                </p>

              </div>

            </div>

            {/* COURSES BUTTON LEFT SIDE */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() =>
                setShowCourses(true)
              }
              onMouseLeave={() =>
                setShowCourses(false)
              }
            >

              <button
                className="
                  h-11
                  px-5
                  rounded-2xl
                  flex
                  items-center
                  gap-2
                  bg-white/60
                  dark:bg-white/5
                  border
                  border-gray-200
                  dark:border-white/10
                  hover:bg-white
                  dark:hover:bg-white/10
                  text-gray-800
                  dark:text-gray-200
                  transition-all
                "
              >

                <FiGrid />

                Courses

                <FiChevronDown
                  className={`
                    transition-all
                    ${showCourses
                      ? "rotate-180"
                      : ""
                    }
                  `}
                />

              </button>

              <AnimatePresence>

                {showCourses && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 15,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      absolute
                      top-[65px]
                      left-0
                      w-[950px]
                      h-[500px]
                      rounded-3xl
                      overflow-hidden
                      border
                      border-white/10
                      bg-white/90
                      dark:bg-[#0F172A]/95
                      backdrop-blur-2xl
                      shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                      flex
                    "
                  >

                    <div
                      className="
                        w-[280px]
                        border-r
                        border-gray-200
                        dark:border-white/10
                        p-4
                        overflow-y-auto
                      "
                    >

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-gray-500
                          dark:text-gray-400
                          uppercase
                          mb-4
                        "
                      >
                        Categories
                      </h2>

                      <div className="space-y-2">

                        {categories?.map(
                          (category) => (

                            <button
                              key={category}
                              onMouseEnter={() =>
                                setSelectedCategory(
                                  category
                                )
                              }
                              className={`
                                w-full
                                text-left
                                px-4
                                py-3
                                rounded-2xl
                                transition-all
                                font-medium
                                ${selectedCategory ===
                                  category
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                                }
                              `}
                            >
                              {category}
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    <div
                      className="
                        flex-1
                        p-6
                        overflow-y-auto
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-6
                        "
                      >

                        <div>

                          <h2
                            className="
                              text-2xl
                              font-bold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            {selectedCategory}
                          </h2>

                          <p
                            className="
                              text-sm
                              text-gray-500
                              dark:text-gray-400
                              mt-1
                            "
                          >
                            Explore premium courses
                          </p>

                        </div>

                      </div>

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-4
                        "
                      >

                        {filteredCourses?.map(
                          (course) => (

                            <motion.div
                              whileHover={{
                                y: -4,
                              }}
                              key={course._id}
                              onClick={() =>
                                navigate(
                                  `/course/${course._id}`
                                )
                              }
                              className="
                                group
                                cursor-pointer
                                rounded-3xl
                                overflow-hidden
                                border
                                border-gray-200
                                dark:border-white/10
                                bg-white
                                dark:bg-white/5
                                hover:shadow-2xl
                                transition-all
                              "
                            >

                              <img
                                src={
                                  course.thumbnail
                                }
                                alt=""
                                className="
                                  w-full
                                  h-36
                                  object-cover
                                "
                              />

                              <div className="p-4">

                                <h3
                                  className="
                                    font-semibold
                                    text-gray-900
                                    dark:text-white
                                    line-clamp-1
                                  "
                                >
                                  {course.title}
                                </h3>

                                <p
                                  className="
                                    text-sm
                                    text-gray-500
                                    dark:text-gray-400
                                    mt-1
                                  "
                                >
                                  {
                                    course
                                      ?.educator
                                      ?.name
                                  }
                                </p>

                              </div>

                            </motion.div>
                          )
                        )}

                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* DASHBOARD BUTTON LEFT SIDE */}
            {userData?.role ===
              "educator" && (

                <button
                  onClick={() =>
                    navigate(
                      "/educator/profile"
                    )
                  }
                  className="
                  hidden
                  lg:block
                  h-11
                  px-5
                  rounded-2xl
                  bg-black
                  dark:bg-white
                  dark:text-black
                  text-white
                  font-medium
                  hover:scale-[1.03]
                  active:scale-95
                  transition-all
                "
                >
                  Dashboard
                </button>
              )}

            {/* BLOG BUTTON */}
            {userData?.role !== "educator" && (
              <button
                onClick={() => navigate("/blogs")}
                className="
      hidden
      lg:flex
      items-center
      gap-2
      h-11
      px-5
      rounded-2xl
      bg-white/60
      dark:bg-white/5
      border
      border-gray-200
      dark:border-white/10
      hover:bg-white
      dark:hover:bg-white/10
      text-gray-800
      dark:text-gray-200
      font-medium
      transition-all
    "
              >
                <FiBookOpen />
                Blog
              </button>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div
            className="
              hidden
              lg:flex
              items-center
              gap-3
            "
          >

            <DarkModeButton />

            {userData && <NotificationBell />}
            
            {!userData && (

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="
                  h-11
                  px-5
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-500
                  text-white
                  font-semibold
                  shadow-xl
                  shadow-violet-500/20
                  hover:scale-[1.03]
                  active:scale-95
                  transition-all
                "
              >
                Login
              </button>
            )}

            {userData && (

              <div className="relative">

                <button
                  onClick={() =>
                    setShowProfile(
                      !showProfile
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    pl-2
                    pr-4
                    h-12
                    rounded-2xl
                    bg-white/60
                    dark:bg-white/5
                    border
                    border-gray-200
                    dark:border-white/10
                    hover:bg-white
                    dark:hover:bg-white/10
                    transition-all
                  "
                >

                  {userData?.photoUrl ? (

                    <img
                      src={
                        userData.photoUrl
                      }
                      alt=""
                      className="
                        w-9
                        h-9
                        rounded-xl
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-black
                        dark:bg-white
                        dark:text-black
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      {userData?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <div
                    className="
                      text-left
                      hidden
                      xl:block
                    "
                  >

                    <h2
                      className="
                        text-sm
                        font-semibold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {userData?.name}
                    </h2>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {userData?.role}
                    </p>

                  </div>

                </button>

                <AnimatePresence>

                  {showProfile && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="
                        absolute
                        right-0
                        top-[60px]
                        w-[280px]
                        max-w-[calc(100vw-32px)]
                        bg-white/95
                        dark:bg-[#0F172A]/95
                        backdrop-blur-2xl
                        rounded-3xl
                        border
                        border-gray-200
                        dark:border-white/10
                        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                        overflow-hidden
                        z-50
                      "
                    >

                      {/* User Info Section */}
                      <div
                        className="
                          p-5
                          border-b
                          border-gray-200
                          dark:border-white/10
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >

                          {userData?.photoUrl ? (
                            <img
                              src={
                                userData.photoUrl
                              }
                              alt=""
                              className="
                                w-14
                                h-14
                                rounded-2xl
                                object-cover
                                border-2
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
                                bg-black
                                dark:bg-white
                                dark:text-black
                                text-white
                                flex
                                items-center
                                justify-center
                                text-xl
                                font-bold
                              "
                            >
                              {userData?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">

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

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">

                        <button
                          onClick={() => {
                            navigate("/student/dashboard");
                            setShowProfile(false);
                          }}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            text-gray-700
                            dark:text-gray-300
                            hover:bg-gray-100
                            dark:hover:bg-white/5
                            transition-all
                            font-medium
                          "
                        >
                          <FiUser className="text-lg" />
                          My Profile
                        </button>

                        <button
                          onClick={() => {
                            navigate("/mycourses");
                            setShowProfile(false);
                          }}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            text-gray-700
                            dark:text-gray-300
                            hover:bg-gray-100
                            dark:hover:bg-white/5
                            transition-all
                            font-medium
                          "
                        >
                          <FiBookOpen className="text-lg" />
                          My Courses
                        </button>

                        <div
                          className="
                            h-px
                            bg-gray-200
                            dark:bg-white/10
                            my-2
                          "
                        />

                        <button
                          onClick={handleLogout}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                            transition-all
                            font-medium
                          "
                        >
                          <FiLogOut className="text-lg" />
                          Logout
                        </button>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() =>
              setShowMobile(
                !showMobile
              )
            }
            className="
              lg:hidden
              w-11
              h-11
              rounded-2xl
              border
              border-white/10
              bg-white/60
              dark:bg-white/5
              flex
              items-center
              justify-center
              text-xl
            "
          >

            {showMobile ? (
              <RxCross2 />
            ) : (
              <HiOutlineMenuAlt3 />
            )}

          </button>

        </div>

      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>

        {showMobile && (

          <>
            {/* Backdrop */}
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
                setShowMobile(false)
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

            {/* Sidebar */}
            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="
                fixed
                top-0
                right-0
                w-[85%]
                max-w-[400px]
                h-full
                bg-white
                dark:bg-[#0F172A]
                z-50
                shadow-2xl
                lg:hidden
                overflow-y-auto
              "
            >

              <div className="p-6 space-y-6">

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      setShowMobile(
                        false
                      )
                    }
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-gray-100
                      dark:bg-white/5
                      flex
                      items-center
                      justify-center
                      hover:bg-gray-200
                      dark:hover:bg-white/10
                      transition-all
                    "
                  >
                    <RxCross2 className="text-xl text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* User Info */}
                {userData && (
                  <div
                    className="
                      p-5
                      rounded-3xl
                      bg-gradient-to-br
                      from-gray-50
                      to-gray-100
                      dark:from-white/5
                      dark:to-white/10
                      border
                      border-gray-200
                      dark:border-white/10
                    "
                  >

                    <div className="flex items-center gap-4">

                      {userData?.photoUrl ? (
                        <img
                          src={
                            userData.photoUrl
                          }
                          alt=""
                          className="
                            w-16
                            h-16
                            rounded-2xl
                            object-cover
                            border-2
                            border-gray-200
                            dark:border-white/10
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-black
                            dark:bg-white
                            dark:text-black
                            text-white
                            flex
                            items-center
                            justify-center
                            text-2xl
                            font-bold
                          "
                        >
                          {userData?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">

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

                        <span
                          className="
                            inline-block
                            mt-2
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            rounded-full
                            bg-black
                            dark:bg-white
                            dark:text-black
                            text-white
                            capitalize
                          "
                        >
                          {userData?.role}
                        </span>

                      </div>

                    </div>

                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-2">

                  {!userData ? (
                    <button
                      onClick={() => {
                        navigate("/login");
                        setShowMobile(false);
                      }}
                      className="
                        w-full
                        py-4
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-500
                        text-white
                        font-semibold
                        shadow-xl
                        shadow-violet-500/20
                        hover:scale-[1.02]
                        active:scale-95
                        transition-all
                      "
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      {/* Dashboard */}
                      {userData?.role ===
                        "educator" && (
                          <button
                            onClick={() => {
                              navigate(
                                "/educator/profile"
                              );
                              setShowMobile(
                                false
                              );
                            }}
                            className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-5
                            py-4
                            rounded-2xl
                            bg-black
                            dark:bg-white
                            dark:text-black
                            text-white
                            font-semibold
                            hover:scale-[1.02]
                            active:scale-95
                            transition-all
                          "
                          >
                            <FiGrid className="text-xl" />
                            Dashboard
                          </button>
                        )}

                      {/* Profile */}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowMobile(
                            false
                          );
                        }}
                        className="
                          w-full
                          flex
                          items-center
                            gap-3
                          px-5
                          py-4
                          rounded-2xl
                          bg-gray-100
                          dark:bg-white/5
                          text-gray-900
                          dark:text-white
                          font-semibold
                          hover:bg-gray-200
                          dark:hover:bg-white/10
                          transition-all
                        "
                      >
                        <FiUser className="text-xl" />
                        My Profile
                      </button>

                      {/* Courses */}

                      {/* Blog */}
                      {userData?.role !== "educator" && (
                        <button
                          onClick={() => {
                            navigate("/blogs");
                            setShowMobile(false);
                          }}
                          className="
      w-full
      flex
      items-center
      gap-3
      px-5
      py-4
      rounded-2xl
      bg-gray-100
      dark:bg-white/5
      text-gray-900
      dark:text-white
      font-semibold
      hover:bg-gray-200
      dark:hover:bg-white/10
      transition-all
    "
                        >
                          <FiBookOpen className="text-xl" />
                          Blog
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigate(
                            "/mycourses"
                          );
                          setShowMobile(
                            false
                          );
                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-5
                          py-4
                          rounded-2xl
                          bg-gray-100
                          dark:bg-white/5
                          text-gray-900
                          dark:text-white
                          font-semibold
                          hover:bg-gray-200
                          dark:hover:bg-white/10
                          transition-all
                        "
                      >
                        <FiBookOpen className="text-xl" />
                        My Courses
                      </button>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-5
                          py-4
                          rounded-2xl
                          bg-red-500
                          text-white
                          font-semibold
                          hover:bg-red-600
                          transition-all
                        "
                      >
                        <FiLogOut className="text-xl" />
                        Logout
                      </button>
                    </>
                  )}

                </div>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

    </>
  );
};

export default Nav;