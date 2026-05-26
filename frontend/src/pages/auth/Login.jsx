import React, { useState } from "react";

import axios from "axios";

import logo from "../../assets/logo1.png";

import { FaRegEye } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";

import { FcGoogle } from "react-icons/fc";

import { useNavigate } from "react-router-dom";

import { ClipLoader } from "react-spinners";

import { serverUrl } from "../../App";

import { toast } from "react-toastify";

import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../../utils/firebase";

import { useDispatch } from "react-redux";

import { setUserData } from "../../redux/slices/userSlice";

import { motion } from "framer-motion";

const Login = () => {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ============================================
  // LOGIN FUNCTION
  // ============================================

  const hangleLogin = async () => {
    setLoading(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(result.data);

      dispatch(setUserData(result.data.user));

      toast.success("Login Successfully");

      navigate("/");

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      toast.error(errorMessage);
    }
  };

  // ============================================
  // GOOGLE LOGIN
  // ============================================

  const googleLogin = async () => {
    setLoading(true);

    try {
      const response = await signInWithPopup(
        auth,
        provider
      );

      let user = response.user;

      let name = user.displayName;

      let email = user.email;

      let photoUrl = user.photoURL;

      let role = "student";

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        {
          name,
          email,
          photoUrl,
          role,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(
        setUserData(result.data.user || result.data)
      );

      toast.success("Login Successfully");

      navigate("/");

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center px-4 py-8 overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-500 opacity-30 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 opacity-30 blur-[120px] rounded-full"></div>

      {/* MAIN CONTAINER */}

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-6xl min-h-[700px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >

        {/* ========================================= */}
        {/* LEFT SECTION */}
        {/* ========================================= */}

        <div className="w-full lg:w-[50%] bg-white px-8 md:px-14 py-10 flex flex-col justify-center">

          {/* LOGO MOBILE */}

          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img
              src={logo}
              alt="logo"
              className="w-14"
            />

            <h1 className="text-2xl font-bold">
              SKILLBRIDGE
            </h1>
          </div>

          {/* TEXT */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-3 text-[15px]">
              Login to continue your learning journey
              with SkillBridge LMS Platform.
            </p>
          </div>

          {/* EMAIL */}

          <div className="flex flex-col gap-2 mb-5">
            <label
              htmlFor="email"
              className="font-semibold text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full h-[55px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition bg-[#f8fafc]"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              value={email}
            />
          </div>

          {/* PASSWORD */}

          <div className="flex flex-col gap-2 mb-3 relative">
            <label
              htmlFor="password"
              className="font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full h-[55px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition bg-[#f8fafc]"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              value={password}
            />

            {!show ? (
              <FaRegEye
                className="absolute right-5 bottom-5 text-gray-500 cursor-pointer text-[20px]"
                onClick={() =>
                  setShow((prev) => !prev)
                }
              />
            ) : (
              <IoEye
                className="absolute right-5 bottom-5 text-gray-500 cursor-pointer text-[20px]"
                onClick={() =>
                  setShow((prev) => !prev)
                }
              />
            )}
          </div>

          {/* FORGOT PASSWORD */}

          <div className="flex justify-end mb-7">
            <span
              className="text-sm text-indigo-600 cursor-pointer hover:underline"
              onClick={() =>
                navigate("/forget-password")
              }
            >
              Forgot Password?
            </span>
          </div>

          {/* LOGIN BUTTON */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={hangleLogin}
            className="w-full h-[58px] rounded-2xl bg-black text-white font-semibold text-[17px] shadow-xl flex items-center justify-center"
          >
            {loading ? (
              <ClipLoader
                size={28}
                color="white"
              />
            ) : (
              "Login"
            )}
          </motion.button>

          {/* DIVIDER */}

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-[1px] bg-gray-200"></div>

            <span className="text-gray-400 text-sm">
              OR CONTINUE WITH
            </span>

            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* GOOGLE BUTTON */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={googleLogin}
            className="w-full h-[58px] rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3 font-semibold text-gray-700 shadow-sm"
          >
            <FcGoogle className="text-2xl" />

            Continue with Google
          </motion.button>

          {/* SIGNUP */}

          <div className="mt-8 text-center text-gray-500">
            Don’t have an account?{" "}

            <span
              onClick={() => navigate("/signup")}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT SECTION */}
        {/* ========================================= */}

        <div className="hidden lg:flex w-[50%] bg-gradient-to-br from-black via-[#111827] to-indigo-950 relative items-center justify-center overflow-hidden">

          {/* GLOW */}

          <div className="absolute w-[350px] h-[350px] bg-indigo-500 opacity-20 blur-[120px] rounded-full"></div>

          <div className="absolute top-10 right-10 w-[150px] h-[150px] border border-white/10 rounded-full"></div>

          <div className="absolute bottom-10 left-10 w-[120px] h-[120px] border border-white/10 rounded-full"></div>

          {/* CONTENT */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col items-center text-center px-10"
          >

            <img
              src={logo}
              alt="logo"
              className="w-56 drop-shadow-2xl"
            />

            <h1 className="text-5xl font-bold text-white mt-6 tracking-wide">
              SKILLBRIDGE
            </h1>

            <p className="text-gray-300 mt-5 leading-relaxed text-[16px] max-w-md">
              Learn modern skills from top educators,
              grow your career, and build your future
              with our professional LMS platform.
            </p>

            {/* STATS */}

            <div className="grid grid-cols-3 gap-5 mt-10 w-full">

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <h1 className="text-2xl font-bold text-white">
                  10K+
                </h1>

                <p className="text-gray-300 text-sm mt-1">
                  Students
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <h1 className="text-2xl font-bold text-white">
                  500+
                </h1>

                <p className="text-gray-300 text-sm mt-1">
                  Courses
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <h1 className="text-2xl font-bold text-white">
                  99%
                </h1>

                <p className="text-gray-300 text-sm mt-1">
                  Success
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;