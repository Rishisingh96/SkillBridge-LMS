import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiBarChart,
  FiUsers,
  FiGrid,
  FiTrendingUp,
  FiBook,
  FiPlusCircle,
  FiLogOut,
  FiAward,
  FiX,
  FiMoon,
  FiSun,
  FiTag,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  {
    label: "ProfileView",
    path: "/educator/profile",
    icon: <FiUser size={18} />,
  },
  {
    label: "GraphView",
    path: "/educator/graph",
    icon: <FiBarChart size={18} />,
  },
  {
    label: "RecentEnrollment",
    path: "/educator/recent-enrollment",
    icon: <FiUsers size={18} />,
  },
  {
    label: "StatsCard",
    path: "/educator/stats",
    icon: <FiGrid size={18} />,
  },
  {
    label: "CoursePerformance",
    path: "/educator/course-performance",
    icon: <FiTrendingUp size={18} />,
  },
  {
    label: "My Courses",
    path: "/educator/courses",
    icon: <FiBook size={18} />,
  },
  {
    label: "Create Course",
    path: "/educator/create-course",
    icon: <FiPlusCircle size={18} />,
  },
  {
    label: "Coupons",
    path: "/educator/coupons",
    icon: <FiTag size={18} />,
  },
];

const EducatorSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-r
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo / Brand */}
        <div className={`flex items-center justify-between px-5 py-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <FiAward size={22} className="text-indigo-400" />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-base tracking-tight`}>
              Educator Panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {/* Close button — only on mobile */}
            <button
              onClick={onClose}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} lg:hidden`}
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* User info */}
        {userData && (
          <div className={`px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {userData?.name?.charAt(0).toUpperCase() || "E"}
              </div>
              <div className="overflow-hidden">
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium truncate`}>
                  {userData?.name || "Educator"}
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs truncate`}>
                  {userData?.email || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Back to student */}
        <div className="px-3 pb-5 space-y-1">
          <button
            onClick={() => {
              navigate("/");
              onClose?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} transition-colors`}
          >
            <FiLogOut size={18} />
            Back to Student View
          </button>
        </div>
      </aside>
    </>
  );
};

export default EducatorSidebar;