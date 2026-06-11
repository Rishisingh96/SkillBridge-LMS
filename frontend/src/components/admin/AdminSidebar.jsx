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
  Ticket,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { toast } from "react-toastify";

import { clearUserData } from "../../redux/slices/userSlice";
import { clearAllProgress } from "../../redux/slices/progressSlice";
import { clearModuleData } from "../../redux/slices/moduleSlice";

import { serverUrl } from "../../App";
import logo from "../../assets/logo1.png"

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userData } = useSelector(
    (state) => state.user
  );

  // ============================================
  // SIDEBAR LINKS
  // ============================================

  const navLinks = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={21} />,
    },

    {
      title: "Manage Users",
      path: "/admin/users",
      icon: <Users size={21} />,
    },

    {
      title: "Manage Courses",
      path: "/admin/courses",
      icon: <BookOpen size={21} />,
    },

    {
      title: "Create Blog",
      path: "/admin/create-blog",
      icon: <BookOpen size={21} />,
    },

    {
      title: "My Blogs",
      path: "/admin/my-blogs",
      icon: <BookOpen size={21} />,
    },

    {
      title: "Manage Coupons",
      path: "/admin/coupons",
      icon: <Ticket size={21} />,
    },

    {
      title: "Platform Stats",
      path: "/admin/stats",
      icon: <BarChart3 size={21} />,
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

      localStorage.clear();
      dispatch(clearUserData());
      dispatch(clearAllProgress());
      dispatch(clearModuleData());

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
    <>
      {/* ===================================== */}
      {/* MOBILE OVERLAY */}
      {/* ===================================== */}

      <AnimatePresence>

        {sidebarOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

        )}

      </AnimatePresence>

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className={`
        fixed lg:static top-0 left-0 z-50
        w-[290px] h-screen
        bg-gradient-to-b from-black via-gray-900 to-black
        text-white
        flex flex-col
        shadow-2xl
        transition-all duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >

        {/* =================================== */}
        {/* TOP LOGO */}
        {/* =================================== */}

        <div className="h-[85px] px-6 border-b border-white/10 flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* LOGO */}

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">

              {/* <ShieldCheck size={25} /> */}
              <img src={logo} size={25}/>

            </div>

            {/* TEXT */}

            <div>

              <h1 className="text-2xl font-bold">
                SkillBridge
              </h1>

              <p className="text-xs text-gray-400">
                Admin Panel
              </p>

            </div>

          </div>

          {/* MOBILE CLOSE */}

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="lg:hidden"
          >

            <X />

          </button>

        </div>

        {/* =================================== */}
        {/* ADMIN PROFILE */}
        {/* =================================== */}

        <div className="px-6 py-7 border-b border-white/10">

          <div className="flex items-center gap-4">

            <img
              src={userData?.photoUrl}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
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

        {/* =================================== */}
        {/* NAVIGATION LINKS */}
        {/* =================================== */}

        <div className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">

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
                font-medium
                transition-all duration-300
                group
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg"
                    : "hover:bg-white/10"
                }
              `
              }
            >

              {/* ICON */}

              <div>

                {item.icon}

              </div>

              {/* TITLE */}

              <span>

                {item.title}

              </span>

            </NavLink>

          ))}

        </div>

        {/* =================================== */}
        {/* BOTTOM SECTION */}
        {/* =================================== */}

        <div className="p-5 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="
            w-full
            bg-red-500 hover:bg-red-600
            py-4 rounded-2xl
            font-semibold
            flex items-center justify-center gap-3
            transition-all duration-300
            shadow-lg
          "
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </motion.aside>
    </>
  );
};

AdminSidebar.displayName = "AdminSidebar";
export default AdminSidebar;