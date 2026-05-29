import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/student/dashboard",
  },
  {
    title: "My Courses",
    icon: BookOpen,
    path: "/student/my-courses",
  },
  {
    title: "Certificates",
    icon: Award,
    path: "/student/certificates",
  },
  {
    title: "Purchase History",
    icon: Wallet,
    path: "/student/purchase-history",
  },
  {
    title: "Profile",
    icon: User,
    path: "/student/profile",
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-gray-900 border-r dark:border-gray-800 min-h-screen p-4 flex flex-col justify-between transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

      <div>

        <h1 className="text-2xl font-bold text-purple-600 mb-10">
          TuteDude
        </h1>

        <div className="space-y-2">

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

        </div>

      </div>

      <button className="flex items-center gap-2 px-4 py-3 rounded-xl border hover:bg-red-50 text-red-500">
        <LogOut size={18} />
        Logout
      </button>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default Sidebar;