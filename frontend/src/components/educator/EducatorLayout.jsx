import { useState } from "react";
import { Outlet } from "react-router-dom";
import EducatorSidebar from "./EducatorSidebar";
import EducatorNavbar from "./EducatorNavbar";
import { useTheme } from "../../context/ThemeContext";

const EducatorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} overflow-hidden`}>
      {/* Sidebar */}
      <EducatorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <EducatorNavbar
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EducatorLayout;