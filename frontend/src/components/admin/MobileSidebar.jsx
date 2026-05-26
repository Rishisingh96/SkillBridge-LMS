import React from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { toast } from "react-toastify";

import { removeUserData } from "../../redux/slices/userSlice";

import { serverUrl } from "../../App";

const MobileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector(
    (state) => state.user
  );

  // ============================================
  // NAVIGATION LINKS
  // ============================================

  const navLinks = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      title: "Manage Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },

    {
      title: "Manage Courses",
      path: "/admin/courses",
      icon: <BookOpen size={20} />,
    },

    {
      title: "Platform Stats",
      path: "/admin/stats",
      icon: <BarChart3 size={20} />,
    },
  ];

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {

    try {

      const result = await axios.get(
        `${serverUrl}/api/auth/logout`,
        {
          withCredentials: true,
        }
      );

      dispatch(removeUserData());

      toast.success(result.data.message);

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Logout Failed"
      );

    }
  };

  return (
    <AnimatePresence>

      {sidebarOpen && (

        <>
          {/* =================================== */}
          {/* OVERLAY */}
          {/* =================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
            fixed inset-0
            bg-black/50
            z-40
            lg:hidden
          "
          />

          {/* =================================== */}
          {/* SIDEBAR */}
          {/* =================================== */}

          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.35 }}
            className="
            fixed top-0 left-0
            w-[280px]
            h-screen
            bg-gradient-to-b
            from-black
            via-gray-900
            to-black
            z-50
            text-white
            flex flex-col
            shadow-2xl
            lg:hidden
          "
          >

            {/* =============================== */}
            {/* HEADER */}
            {/* =============================== */}

            <div
              className="
              h-[85px]
              px-5
              border-b border-white/10
              flex items-center justify-between
            "
            >

              <div className="flex items-center gap-3">

                {/* LOGO */}

                <div
                  className="
                  w-11 h-11
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-500
                  to-indigo-500
                  flex items-center justify-center
                "
                >

                  <ShieldCheck size={23} />

                </div>

                {/* TEXT */}

                <div>

                  <h1 className="font-bold text-xl">

                    SkillBridge

                  </h1>

                  <p className="text-xs text-gray-400">

                    Admin Panel

                  </p>

                </div>

              </div>

              {/* CLOSE BUTTON */}

              <button
                onClick={() =>
                  setSidebarOpen(false)
                }
              >

                <X size={24} />

              </button>

            </div>

            {/* =============================== */}
            {/* PROFILE */}
            {/* =============================== */}

            <div
              className="
              px-5 py-6
              border-b border-white/10
            "
            >

              <div className="flex items-center gap-4">

                <img
                  src={userData?.photoUrl}
                  alt=""
                  className="
                  w-14 h-14
                  rounded-full
                  object-cover
                  border-2 border-purple-500
                "
                />

                <div>

                  <h2 className="font-bold text-lg">

                    {userData?.name}

                  </h2>

                  <p className="text-sm text-gray-400">

                    Administrator

                  </p>

                </div>

              </div>

            </div>

            {/* =============================== */}
            {/* LINKS */}
            {/* =============================== */}

            <div
              className="
              flex-1
              px-4 py-6
              space-y-3
            "
            >

              {navLinks.map((item, index) => (

                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex items-center gap-4
                    px-5 py-4
                    rounded-2xl
                    transition-all duration-300
                    font-medium
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg"
                        : "hover:bg-white/10"
                    }
                  `
                  }
                >

                  {item.icon}

                  <span>

                    {item.title}

                  </span>

                </NavLink>

              ))}

            </div>

            {/* =============================== */}
            {/* LOGOUT */}
            {/* =============================== */}

            <div
              className="
              p-5
              border-t border-white/10
            "
            >

              <button
                onClick={handleLogout}
                className="
                w-full
                bg-red-500 hover:bg-red-600
                py-4
                rounded-2xl
                flex items-center justify-center gap-3
                font-semibold
                transition-all duration-300
              "
              >

                <LogOut size={20} />

                Logout

              </button>

            </div>

          </motion.div>
        </>

      )}

    </AnimatePresence>
  );
};

export default MobileSidebar;