import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../studentDashboard/Sidebar";
import Nav from "../navbar/Navbar";
import { useTheme } from "../../context/ThemeContext";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      {/* Navigation Bar */}
      <Nav />
      
      <div className="flex flex-1 overflow-hidden py-10">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <header className={`lg:hidden flex items-center gap-4 px-4 border-b py-12 ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <FiMenu size={22} />
            </button>
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-semibold`}>
              Student Panel
            </span>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

StudentLayout.displayName = "StudentLayout";
export default StudentLayout;
