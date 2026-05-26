import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  FaArrowLeftLong,
  FaCamera,
  FaUser,
} from "react-icons/fa6";

import { toast } from "react-toastify";

import { updateProfileData } from "../../redux/slices/userSlice";

const EditProfile = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ─────────────────────────────────────────
  // Redux State
  // ─────────────────────────────────────────
  const { userData, loading } = useSelector(
    (state) => state.user
  );

  // ─────────────────────────────────────────
  // Form States
  // ─────────────────────────────────────────
  const [name, setName] = useState(userData?.name || "");

  const [bio, setBio] = useState(userData?.bio || "");

  const [phone, setPhone] = useState(userData?.phone || "");

  const [gender, setGender] = useState(
    userData?.gender || ""
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    userData?.dateOfBirth
      ? userData.dateOfBirth.split("T")[0]
      : ""
  );

  // ─────────────────────────────────────────
  // Image States
  // ─────────────────────────────────────────
  const [photoUrl, setPhotoUrl] = useState(null);

  const [previewImage, setPreviewImage] = useState(
    userData?.photoUrl || null
  );

  // ─────────────────────────────────────────
  // Handle Edit Profile
  // ─────────────────────────────────────────
  const handleEditProfile = async () => {

    try {

      const formData = new FormData();

      formData.append("name", name);

      formData.append("bio", bio);

      formData.append("phone", phone);

      formData.append("gender", gender);

      formData.append("dateOfBirth", dateOfBirth);

      // Image Upload
      if (photoUrl && photoUrl instanceof File) {

        formData.append("photo", photoUrl);

      }

      // Redux Thunk
      await dispatch(
        updateProfileData(formData)
      ).unwrap();

      toast.success("Profile Updated Successfully");

      navigate("/profile");

    } catch (error) {

      toast.error(
        error || "Failed to update profile"
      );

    }
  };

  // ─────────────────────────────────────────
  // Handle Image Change
  // ─────────────────────────────────────────
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      // File Size Validation
      if (file.size > 5 * 1024 * 1024) {

        toast.error(
          "File size must be less than 5MB"
        );

        return;
      }

      setPhotoUrl(file);

      // Preview
      const reader = new FileReader();

      reader.onloadend = () => {

        setPreviewImage(reader.result);

      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* ───────────────── HEADER ───────────────── */}
        <div className="bg-gradient-to-r from-black to-gray-700 p-6 relative">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
          >
            <FaArrowLeftLong className="text-black text-xl" />
          </button>

          <h1 className="text-3xl font-bold text-white text-center pt-8 pb-4">
            Edit Profile
          </h1>

        </div>

        {/* ───────────────── FORM ───────────────── */}
        <form
          className="p-6 space-y-5"
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
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />

              ) : (

                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl">

                  {name?.charAt(0)?.toUpperCase() || "U"}

                </div>
              )}

              {/* Camera Icon */}
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-black text-white p-3 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
              >

                <FaCamera className="text-lg" />

              </label>

            </div>

            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <p className="text-sm text-gray-500">
              Click camera icon to change photo
            </p>

          </div>

          {/* Full Name */}
          <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Full Name
            </label>

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
              />

            </div>

          </div>

          {/* Bio */}
          <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Bio / Description
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              rows={4}
              placeholder="Tell us about yourself..."
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 resize-none"
            />

            <p className="text-xs text-gray-500 text-right">
              {bio.length}/500
            </p>

          </div>

          {/* Phone */}
          <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
            />

          </div>

          {/* DOB + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Date of Birth */}
            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
              />

            </div>

            {/* Gender */}
            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
              >

                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            {/* Cancel */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >

              Cancel

            </button>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-black to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfile;