import React, { useState } from "react";
import logo from "../assets/logo1.png";
import { FaRegEye } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { motion } from "framer-motion";

const SignUp = () => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [confirmPassword, setConfirmPassword] = useState("");

  // Signup
  // Update handleSignup function

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));

      setLoading(false);

      toast.success("Signup Successfully");

      navigate("/");
    } catch (error) {
      console.log(error);

      setLoading(false);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Google Signup
  const googleSignUp = async () => {
    setLoading(true);

    try {
      const response = await signInWithPopup(auth, provider);

      let user = response.user;

      let name = user.displayName;
      let email = user.email;
      let photoUrl = user.photoURL;

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name, email, role, photoUrl },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));

      setLoading(false);

      toast.success("Signup Successfully");

      navigate("/");
    } catch (error) {
      console.log(error);

      setLoading(false);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-[#111111] to-[#1d1d1d] flex items-center justify-center px-4 py-10 overflow-hidden relative">
      {/* Background Blur */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full blur-[140px] opacity-20"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[140px] opacity-20"></div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[35px] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Section */}
        <div className="w-full lg:w-[50%] bg-black text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] bg-purple-500 rounded-full blur-[120px] opacity-30"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-14 h-14 object-contain" />

              <h1 className="text-3xl font-bold tracking-wide">SKILLBRIDGE</h1>
            </div>

            {/* Text */}
            <div className="mt-20">
              <h1 className="text-5xl font-extrabold leading-tight">
                Start Your
                <span className="block text-purple-400">Learning Journey</span>
              </h1>

              <p className="text-gray-400 mt-6 text-[17px] leading-8 max-w-md">
                Create your account and join thousands of learners mastering
                coding, design, development, and modern tech skills.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>

                <p className="text-gray-300">Learn from industry experts</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>

                <p className="text-gray-300">Interactive coding environment</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>

                <p className="text-gray-300">Certificates & career growth</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 mt-10">
            <p className="text-gray-500 text-sm">
              © 2026 SkillBridge. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[50%] bg-white p-8 md:p-12 flex items-center justify-center">
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Create Account
              </h1>

              <p className="text-gray-500 mt-2">
                Join SkillBridge and start learning today 🚀
              </p>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 h-[52px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 h-[52px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 h-[52px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition"
              />

              {!show ? (
                <FaRegEye
                  className="absolute right-5 top-[52px] text-gray-500 cursor-pointer text-[20px]"
                  onClick={() => setShow(true)}
                />
              ) : (
                <IoEye
                  className="absolute right-5 top-[52px] text-gray-500 cursor-pointer text-[20px]"
                  onClick={() => setShow(false)}
                />
              )}
            </div>
            {/* Confirm Password */}
            <div className="mb-5 relative">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                type={show ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 h-[52px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition"
              />

              {/* Password Match Message */}
              {confirmPassword.length > 0 && (
                <p
                  className={`text-sm mt-2 ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {password === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="mb-7">
              <label className="text-sm font-semibold text-gray-700">
                Select Role
              </label>

              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 h-[50px] rounded-2xl font-semibold transition-all duration-300 ${
                    role === "student"
                      ? "bg-black text-white shadow-lg"
                      : "border border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole("educator")}
                  className={`flex-1 h-[50px] rounded-2xl font-semibold transition-all duration-300 ${
                    role === "educator"
                      ? "bg-black text-white shadow-lg"
                      : "border border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  Educator
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full h-[55px] rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold text-lg transition-all duration-300 shadow-xl hover:scale-[1.02] flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={28} color="white" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-[1px] bg-gray-200"></div>

              <span className="text-gray-400 text-sm">OR CONTINUE WITH</span>

              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={googleSignUp}
              className="w-full h-[55px] rounded-2xl border border-gray-200 hover:border-black transition flex items-center justify-center gap-3 font-semibold text-gray-700"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>

            {/* Login */}
            <div className="mt-8 text-center text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-black font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
