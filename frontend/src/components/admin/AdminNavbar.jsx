import React from "react";

import {
  Menu,
  Search,
} from "lucide-react";

import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import NotificationBell from "../ui/NotificationBell";

const AdminNavbar = ({
  setSidebarOpen,
}) => {

  const { userData } = useSelector(
    (state) => state.user
  );

  return (
    <div
      className="
      sticky top-0 z-30
      h-[85px]
      bg-white/90 backdrop-blur-xl
      border-b border-gray-200
      px-4 md:px-7
      flex items-center justify-between
      shadow-sm
    "
    >

      {/* ===================================== */}
      {/* LEFT SECTION */}
      {/* ===================================== */}

      <div className="flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
          lg:hidden
          w-11 h-11
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          flex items-center justify-center
          transition-all duration-300
        "
        >

          <Menu size={22} />

        </button>

        {/* PAGE TITLE */}

        <div>

          <h1 className="text-2xl font-bold text-gray-800">

            Admin Dashboard

          </h1>

          <p className="text-sm text-gray-500">

            Manage your platform efficiently

          </p>

        </div>

      </div>

      {/* ===================================== */}
      {/* RIGHT SECTION */}
      {/* ===================================== */}

      <div className="flex items-center gap-4">

        {/* SEARCH BAR */}

        <div
          className="
          hidden md:flex
          items-center gap-3
          bg-gray-100
          px-4
          h-[48px]
          rounded-2xl
          min-w-[260px]
        "
        >

          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
            bg-transparent
            outline-none
            text-sm
            w-full
          "
          />

        </div>

        {/* NOTIFICATION */}
        <NotificationBell />

        {/* PROFILE */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
          flex items-center gap-3
          bg-gray-100
          px-3 py-2
          rounded-2xl
          cursor-pointer
          hover:bg-gray-200
          transition-all duration-300
        "
        >

          {/* IMAGE */}

          <img
            src={userData?.photoUrl}
            alt=""
            className="
            w-11 h-11
            rounded-full
            object-cover
            border-2 border-purple-500
          "
          />

          {/* TEXT */}

          <div className="hidden sm:block">

            <h2 className="font-semibold text-gray-800">

              {userData?.name}

            </h2>

            <p className="text-xs text-gray-500">

              Administrator

            </p>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

AdminNavbar.displayName = "AdminNavbar";
export default AdminNavbar;