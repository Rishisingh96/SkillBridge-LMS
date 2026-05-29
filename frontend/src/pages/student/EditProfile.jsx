import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCamera,
  FaUser,
  FaPhone,
} from "react-icons/fa6";

import { motion } from "framer-motion";

import { toast } from "react-toastify";

import { updateProfileData } from "../../redux/slices/userSlice";
import Nav from "../../components/navbar/Navbar";

const EditProfile = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // =========================================================
  // REDUX
  // =========================================================

  const { userData, loading } = useSelector(
    (state) => state.user
  );

  // =========================================================
  // STATES
  // =========================================================

  const [name, setName] = useState(
    userData?.name || ""
  );

  const [bio, setBio] = useState(
    userData?.bio || ""
  );

  const [phone, setPhone] = useState(
    userData?.phone || ""
  );

  const [gender, setGender] = useState(
    userData?.gender || ""
  );

  const [dateOfBirth, setDateOfBirth] =
    useState(
      userData?.dateOfBirth
        ? userData.dateOfBirth.split("T")[0]
        : ""
    );

  const [photoUrl, setPhotoUrl] =
    useState(null);

  const [previewImage, setPreviewImage] =
    useState(userData?.photoUrl || null);

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );
      return;
    }

    setPhotoUrl(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleEditProfile = async (
    e
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);

      formData.append("bio", bio);

      formData.append("phone", phone);

      formData.append("gender", gender);

      formData.append(
        "dateOfBirth",
        dateOfBirth
      );

      if (photoUrl instanceof File) {
        formData.append(
          "photo",
          photoUrl
        );
      }

      await dispatch(
        updateProfileData(formData)
      ).unwrap();

      toast.success(
        "Profile updated successfully"
      );

      navigate("/profile");
    } catch (error) {
      toast.error(
        error || "Failed to update profile"
      );
    }
  };

  return (
    <>
      <Nav />
      <div className="relative min-h-screen overflow-hidden bg-[#0B1120] text-white pt-[90px] pb-10 px-4 md:px-6">

      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="fixed -z-10 top-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="fixed -z-10 bottom-[-150px] left-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* ========================================================= */}
      {/* CARD */}
      {/* ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          relative
          z-10
          mx-auto
          max-w-4xl
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          shadow-[0_10px_80px_rgba(0,0,0,0.45)]
        "
      >

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="relative border-b border-white/10 px-5 py-6 md:px-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              absolute
              left-5
              top-6
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-white/5
              transition-all
              hover:bg-white/10
            "
          >
            <FaArrowLeft />
          </button>

          <div className="text-center">

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Edit Profile
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your account information
            </p>

          </div>

        </div>

        {/* ========================================================= */}
        {/* FORM */}
        {/* ========================================================= */}

        <form
          onSubmit={
            handleEditProfile
          }
          className="space-y-8 p-5 md:p-8"
        >

          {/* ========================================================= */}
          {/* PROFILE IMAGE */}
          {/* ========================================================= */}

          <div className="flex flex-col items-center">

            <div className="relative">

              {previewImage ? (

                <img
                  src={previewImage}
                  alt="profile"
                  className="
                    h-32
                    w-32
                    rounded-3xl
                    border
                    border-white/10
                    object-cover
                    shadow-2xl
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-br
                    from-violet-600
                    to-cyan-500
                    text-4xl
                    font-bold
                  "
                >
                  {name?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

              )}

              {/* CAMERA */}

              <label
                htmlFor="image"
                className="
                  absolute
                  -bottom-2
                  -right-2
                  flex
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-600
                  shadow-lg
                  transition-all
                  hover:bg-violet-500
                "
              >
                <FaCamera />
              </label>

            </div>

            <input
              id="image"
              type="file"
              hidden
              accept="image/*"
              onChange={
                handleImageChange
              }
            />

            <p className="mt-4 text-sm text-gray-400">
              Upload profile picture
            </p>

          </div>

          {/* ========================================================= */}
          {/* INPUTS */}
          {/* ========================================================= */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* NAME */}

            <div className="space-y-2">

              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>

              <div className="relative">

                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    pl-12
                    pr-4
                    text-white
                    outline-none
                    transition-all
                    placeholder:text-gray-500
                    focus:border-violet-500/50
                  "
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="space-y-2">

              <label className="text-sm font-medium text-gray-300">
                Phone Number
              </label>

              <div className="relative">

                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    pl-12
                    pr-4
                    text-white
                    outline-none
                    transition-all
                    placeholder:text-gray-500
                    focus:border-violet-500/50
                  "
                />

              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* BIO */}
          {/* ========================================================= */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-gray-300">
              Bio
            </label>

            <textarea
              rows={5}
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              placeholder="Tell something about yourself..."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-4
                py-4
                text-white
                outline-none
                transition-all
                placeholder:text-gray-500
                focus:border-violet-500/50
                resize-none
              "
            />

            <div className="flex justify-end">

              <span className="text-xs text-gray-500">
                {bio.length}/500
              </span>

            </div>

          </div>

          {/* ========================================================= */}
          {/* DOB + GENDER */}
          {/* ========================================================= */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* DOB */}

            <div className="space-y-2">

              <label className="text-sm font-medium text-gray-300">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  text-white
                  outline-none
                  focus:border-violet-500/50
                "
              />

            </div>

            {/* GENDER */}

            <div className="space-y-2">

              <label className="text-sm font-medium text-gray-300">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  text-white
                  outline-none
                  focus:border-violet-500/50
                "
              >

                <option
                  value=""
                  className="bg-[#0B1120]"
                >
                  Select Gender
                </option>

                <option
                  value="male"
                  className="bg-[#0B1120]"
                >
                  Male
                </option>

                <option
                  value="female"
                  className="bg-[#0B1120]"
                >
                  Female
                </option>

                <option
                  value="other"
                  className="bg-[#0B1120]"
                >
                  Other
                </option>

              </select>

            </div>

          </div>

          {/* ========================================================= */}
          {/* BUTTONS */}
          {/* ========================================================= */}

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">

            {/* CANCEL */}

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="
                h-14
                flex-1
                rounded-2xl
                border
                border-white/10
                bg-white/5
                font-medium
                text-gray-300
                transition-all
                hover:bg-white/10
              "
            >
              Cancel
            </button>

            {/* SAVE */}

            <motion.button
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={loading}
              className="
                h-14
                flex-1
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-cyan-500
                font-semibold
                text-white
                shadow-xl
                shadow-violet-500/20
                transition-all
                hover:opacity-95
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </motion.button>

          </div>

        </form>

      </motion.div>

    </div>
    </>
  );
};

export default EditProfile;