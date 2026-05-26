import React, { useState } from "react";
import logo from "../../assets/logo1.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { setUserData } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const Nav = () => {
  const { userData } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showProfile, setShowProfile] = useState(false);
  const [showHam, setShowHam] = useState(false);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });

      localStorage.clear();

      dispatch(setUserData(null));

      toast.success("Logout Successfully");

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Logout Failed");
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full h-[68px] bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="logo"
              className="w-[48px] h-[48px] rounded-xl object-cover shadow-sm border border-gray-200"
            />

            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block tracking-tight">
              SkillBridge
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dashboard */}
            {userData?.role === "educator" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm"
              >
                Dashboard
              </button>
            )}

            {/* Login */}
            {!userData && (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm"
              >
                Login
              </button>
            )}

            {/* User Section */}
            {userData && (
              <div className="relative">
                {/* Profile Icon */}
                <div
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {userData?.photoUrl ? (
                    <img
                      src={userData?.photoUrl}
                      alt=""
                      className="w-[46px] h-[46px] rounded-full border border-gray-300 object-cover hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-[46px] h-[46px] rounded-full bg-black text-white flex items-center justify-center text-lg font-bold hover:scale-105 transition-all duration-300">
                      {userData?.name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-[60px] w-[240px] bg-white rounded-2xl shadow-xl border border-gray-200 p-3 flex flex-col gap-2 duration-300">
                    {/* User Info */}
                    <div className="border-b border-gray-100 pb-3 px-2">
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {userData?.name}
                      </h2>

                      <p className="text-sm text-gray-500 truncate">
                        {userData?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-black transition-all duration-300 font-medium"
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => navigate("/mycourses")}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-black transition-all duration-300 font-medium"
                    >
                      My Courses
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-xl bg-red-500/90 text-white hover:bg-red-500 transition-all duration-300 font-medium shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            {showHam ? (
              <RxCross2
                className="w-7 h-7 text-gray-800 cursor-pointer"
                onClick={() => setShowHam(false)}
              />
            ) : (
              <HiOutlineMenuAlt3
                className="w-7 h-7 text-gray-800 cursor-pointer"
                onClick={() => setShowHam(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 ${
          showHam ? "right-0" : "-right-full"
        } w-[75%] h-screen bg-white z-50 shadow-xl border-l border-gray-200 transition-all duration-500 lg:hidden`}
      >
        <div className="flex flex-col p-6 gap-4 mt-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <RxCross2
              className="w-7 h-7 text-gray-700 cursor-pointer"
              onClick={() => setShowHam(false)}
            />
          </div>

          {/* User Info */}
          {userData && (
            <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
              {userData?.photoUrl ? (
                <img
                  src={userData?.photoUrl}
                  alt=""
                  className="w-[55px] h-[55px] rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-[55px] h-[55px] rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="font-semibold text-gray-900">
                  {userData?.name}
                </h2>

                <p className="text-sm text-gray-500 truncate">
                  {userData?.email}
                </p>
              </div>
            </div>
          )}

          {/* Menu Items */}
          {!userData ? (
            <button
              onClick={() => {
                navigate("/login");
                setShowHam(false);
              }}
              className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition-all duration-300"
            >
              Login
            </button>
          ) : (
            <>
              {/* Dashboard */}
              {userData?.role === "educator" && (
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setShowHam(false);
                  }}
                  className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition-all duration-300"
                >
                  Dashboard
                </button>
              )}

              {/* Profile */}
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowHam(false);
                }}
                className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-950 hover:text-white text-gray-900 transition-all duration-100 font-medium shadow-sm hover:shadow-md"
              >
                My Profile
              </button>

              {/* Courses */}
              <button
                onClick={() => {
                  navigate("/mycourses");
                  setShowHam(false);
                }}
                className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-950 hover:text-white text-gray-900 transition-all duration-100 font-medium shadow-sm hover:shadow-md"
              >
                My Courses
              </button>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Nav;
