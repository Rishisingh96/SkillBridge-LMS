import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/slices/userSlice";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // SignUp se email pass hua tha
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // ── Verify OTP ─────────────────────────────
  const handleVerify = async () => {
    if (!otp) return toast.error("Please enter OTP");
    if (otp.length !== 6) return toast.error("OTP must be 6 digits");

    setLoading(true);
    try {
      const result = await axios.post(
        BASE_URL + "/api/auth/verifyotp",
        { email, otp },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user));
      toast.success("Email verified successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────
  const handleResend = async () => {
    setResendLoading(true);
    try {
      await axios.post(
        BASE_URL + "/api/auth/sendotp",
        { email },
        { withCredentials: true }
      );
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Email nahi mila — signup pe bhejo
  if (!email) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-500 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 opacity-20 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-10 relative z-10"
      >

        {/* Icon */}
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-white text-3xl">✉️</span>
        </div>

        {/* Heading */}
        <div className="text-center mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Verify Your Email
          </h1>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            We sent a 6-digit OTP to
            <br />
            <span className="font-semibold text-black">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full h-[55px] px-5 rounded-2xl border border-gray-200 outline-none focus:border-black transition text-center text-2xl font-bold tracking-[0.5em] bg-gray-50"
          />
        </div>

        {/* Verify Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-[55px] rounded-2xl bg-black text-white font-semibold text-lg shadow-xl flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <ClipLoader size={26} color="white" /> : "Verify Email"}
        </motion.button>

        {/* Resend */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Didn't receive OTP?{" "}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-black font-semibold hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Back */}
        <div
          className="text-center mt-4 text-gray-400 text-sm cursor-pointer hover:text-black transition"
          onClick={() => navigate("/signup")}
        >
          ← Back to Signup
        </div>

      </motion.div>
    </div>
  );
};

export default VerifyEmail;