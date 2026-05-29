import React, { useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiUser,
  FiBookOpen,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const ProfileDropdown = ({
  userData,
  showProfile,
  setShowProfile,
  navigate,
  handleLogout,
}) => {

  const dropdownRef = useRef();

  // =========================================================
  // CLOSE ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [setShowProfile]);

  // =========================================================
  // MENU ITEMS
  // =========================================================

  const menuItems = [
    {
      icon: <FiUser />,
      title: "My Profile",
      action: () =>
        navigate("/profile"),
    },

    {
      icon: <FiBookOpen />,
      title: "My Courses",
      action: () =>
        navigate("/mycourses"),
    },

    {
      icon: <FiSettings />,
      title: "Settings",
      action: () =>
        navigate("/settings"),
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* ========================================================= */}
      {/* AVATAR */}
      {/* ========================================================= */}

      <button
        onClick={() =>
          setShowProfile(
            !showProfile
          )
        }
        className="
          relative
          group
        "
      >

        {userData?.photoUrl ? (

          <img
            src={userData.photoUrl}
            alt="profile"
            className={`
              w-12
              h-12
              rounded-2xl
              object-cover
              border
              transition-all
              duration-300

              ${
                showProfile
                  ? `
                    border-violet-500
                    scale-105
                    shadow-lg
                    shadow-violet-500/20
                  `
                  : `
                    border-gray-200
                    dark:border-slate-700
                    hover:scale-105
                  `
              }
            `}
          />

        ) : (

          <div
            className={`
              w-12
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              font-bold
              text-lg
              transition-all
              duration-300

              ${
                showProfile
                  ? `
                    bg-gradient-to-br
                    from-violet-600
                    to-cyan-500
                    text-white
                    scale-105
                  `
                  : `
                    bg-gray-900
                    dark:bg-white
                    dark:text-black
                    text-white
                    hover:scale-105
                  `
              }
            `}
          >
            {userData?.name
              ?.slice(0, 1)
              ?.toUpperCase()}
          </div>

        )}

        {/* ONLINE DOT */}

        <span
          className="
            absolute
            bottom-0
            right-0
            w-3.5
            h-3.5
            rounded-full
            bg-green-500
            border-2
            border-white
            dark:border-slate-900
          "
        />

      </button>

      {/* ========================================================= */}
      {/* DROPDOWN */}
      {/* ========================================================= */}

      <AnimatePresence>

        {showProfile && (

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 12,
              scale: 0.96,
            }}
            transition={{
              duration: 0.22,
            }}
            className="
              absolute
              right-0
              top-[65px]
              w-[290px]
              overflow-hidden
              rounded-[28px]
              border
              border-gray-200
              dark:border-slate-700
              bg-white/90
              dark:bg-slate-900/90
              backdrop-blur-2xl
              shadow-[0_20px_70px_rgba(0,0,0,0.18)]
              z-50
            "
          >

            {/* ========================================================= */}
            {/* USER INFO */}
            {/* ========================================================= */}

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
                      text-white
                      flex
                      items-center
                      justify-center
                      text-xl
                      font-bold
                    "
                  >
                    {userData?.name
                      ?.slice(0, 1)
                      ?.toUpperCase()}
                  </div>

                )}

                <div className="min-w-0">

                  <h2
                    className="
                      text-[16px]
                      font-bold
                      text-gray-900
                      dark:text-white
                      truncate
                    "
                  >
                    {userData?.name}
                  </h2>

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

            {/* ========================================================= */}
            {/* MENU */}
            {/* ========================================================= */}

            <div className="p-3 space-y-1">

              {menuItems.map(
                (item, index) => (

                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setShowProfile(
                        false
                      );
                    }}
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      text-gray-700
                      dark:text-gray-200
                      hover:bg-gray-100
                      dark:hover:bg-slate-800
                      transition-all
                      duration-300
                      font-medium
                    "
                  >

                    <span className="text-lg">
                      {item.icon}
                    </span>

                    {item.title}

                  </button>
                )
              )}

            </div>

            {/* ========================================================= */}
            {/* LOGOUT */}
            {/* ========================================================= */}

            <div
              className="
                p-3
                border-t
                border-gray-200
                dark:border-slate-700
              "
            >

              <button
                onClick={handleLogout}
                className="
                  w-full
                  h-12
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
                  duration-300
                  hover:scale-[1.01]
                  active:scale-[0.98]
                "
              >

                <FiLogOut />

                Logout

              </button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default ProfileDropdown;