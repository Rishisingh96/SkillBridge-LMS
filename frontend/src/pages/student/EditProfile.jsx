import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaCamera, FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners/ClipLoader";
import { setUserData } from "../../redux/slices/userSlice";


const EditProfile = () => {
  console.log("ClipLoader import:", ClipLoader);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Data
  const { userData } = useSelector((state) => state.user);

  console.log("Redux User Data :", userData);
  console.log("All imports loaded:", {
    React,
    FaArrowLeftLong,
    FaCamera,
    FaUser,
    toast,
    ClipLoader
  });

  // States
  const [name, setName] = useState(userData?.name || "");
  const [bio, setBio] = useState(userData?.bio || userData?.description || "");

  const [photoUrl, setPhotoUrl] = useState(null);

  const [previewImage, setPreviewImage] = useState(userData?.photoUrl || null);

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Edit Profile
  // =========================

  const handleEditProfile = async () => {
    console.log("Edit Button Clicked");

    try {
      setLoading(true);

      // FormData
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", bio);

      // Image check
      if (photoUrl && photoUrl instanceof File) {
        formData.append("photo", photoUrl);
      }

      console.log("Form Data Ready");

      // API Call
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        },
      );

      console.log("API Response :", result.data);

      // Redux Update
      // dispatch(setUserData(result.data.user));
      dispatch(setUserData(result.data.user));

      console.log("Redux Updated");

      // Success Toast
      toast.success("Profile Updated Successfully");

      console.log("Navigating to Profile Page");

      // Navigate
      navigate("/profile");
    } catch (error) {
      console.log("Profile Update Error :", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update profile";

      toast.error(errorMessage);
    } finally {
      setLoading(false);

      console.log("Loading Finished");
    }
  };

  // =========================
  // Handle Image Change
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    console.log("Selected File :", file);

    if (file) {
      setPhotoUrl(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);

        console.log("Preview Image Ready");
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-700 p-4 sm:p-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white p-2 sm:p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
          >
            <FaArrowLeftLong className="text-black text-lg sm:text-xl" />
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center pt-6 sm:pt-8 pb-3 sm:pb-4">
            Edit Profile
          </h1>
        </div>

        {/* Form */}
        <form
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleEditProfile();
          }}
        >
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-xl">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* Camera */}
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-black text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
              >
                <FaCamera className="text-sm sm:text-lg" />
              </label>
            </div>

            {/* File Input */}
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <p className="text-xs sm:text-sm text-gray-500">
              Click camera icon to change photo
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Bio / Description
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-black to-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-medium shadow-lg disabled:opacity-50"
              // onClick={() => navigate("/profile")}
            >
              {loading ? "Loading..." : "Save Changes"}
               {/* {loading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
