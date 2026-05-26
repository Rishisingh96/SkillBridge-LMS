import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/slices/userSlice";


const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true });
        // dispatch(setUserData(result.data));
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Top Banner */}
        <div className="h-[140px] bg-gradient-to-r from-black to-gray-700 relative">

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-5 left-5 bg-white p-3 rounded-full shadow-md hover:scale-110 duration-300"
          >
            <FaArrowLeftLong className="text-black text-[20px]" />
          </button>

          {/* Profile Image */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            {userData?.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-700 shadow-lg">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 pb-10 px-8">

          {/* Name */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {userData?.name || "User"}
            </h2>

            <p className="text-gray-500 mt-2">
              Welcome to your profile dashboard
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-10 space-y-5">

            {/* Email */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
              <span className="font-semibold text-gray-700">
                Email
              </span>

              <span className="text-gray-600">
                {userData?.email || "Not Available"}
              </span>
            </div>

            {/* Description */}
            <div className="bg-gray-100 p-4 rounded-xl">
              <span className="font-semibold text-gray-700 block mb-2">
                Description
              </span>

              <p className="text-gray-600">
                {userData?.description || "No description added yet."}
              </p>
            </div>

            {/* Enrolled Courses */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
              <span className="font-semibold text-gray-700">
                Enrolled Courses
              </span>

              <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
                {userData?.enrolledCourses?.length || 0}
              </span>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-center">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 duration-300 shadow-lg cursor-pointer" onClick={() => navigate("/editprofile")} >
              
              <FiEdit className="text-[18px]" />
              
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;