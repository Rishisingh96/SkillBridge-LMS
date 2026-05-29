import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../studentDashboard/Sidebar";
import { useTheme } from "../../context/ThemeContext";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} overflow-hidden`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className={`lg:hidden flex items-center gap-4 px-4 py-3 border-b ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`text-gray-400 hover:text-white`}
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
  );
};

export default StudentLayout;
