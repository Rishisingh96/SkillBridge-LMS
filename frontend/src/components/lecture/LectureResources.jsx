import React, { useState } from "react";

import {
  FaDownload,
  FaFilePdf,
  FaFileCode,
  FaFileArchive,
  FaImage,
} from "react-icons/fa";

import {
  HiOutlineSparkles,
} from "react-icons/hi";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import axios from "axios";

import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

import { ClipLoader } from "react-spinners";

import { useTheme } from "../../context/ThemeContext";

const LectureResources = ({ lecture }) => {

  // =========================================================
  // STATES
  // =========================================================

  const [loadingId, setLoadingId] =
    useState(null);

  const { isDark } = useTheme();

  // =========================================================
  // DATA
  // =========================================================

  const resources =
    lecture?.resources || [];

  // =========================================================
  // DOWNLOAD RESOURCE
  // =========================================================

  const handleDownload = async (
    lectureId,
    resourceId
  ) => {

    try {

      setLoadingId(resourceId);

      const response = await axios.get(

        `${BASE_URL}/api/course/download-resource/${lectureId}/${resourceId}`,

        {
          withCredentials: true,
        }

      );

      const resource =
        resources.find(
          (r) => r._id === resourceId
        );

      const fileResponse =
        await fetch(
          response.data.fileUrl
        );

      const blob =
        await fileResponse.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        resource?.title || "download";

      document.body.appendChild(link);

      link.click();

      setTimeout(() => {

        link.remove();

        window.URL.revokeObjectURL(url);

      }, 100);

      toast.success(
        "Download Started 🚀"
      );

    } catch (error) {

      console.log(error);

      toast.error(

        error?.response?.data?.message ||

        "Download Failed"

      );

    } finally {

      setLoadingId(null);

    }
  };

  // =========================================================
  // FILE ICONS
  // =========================================================

  const getFileIcon = (type) => {

    switch (type) {

      case "pdf":
        return (
          <FaFilePdf className="text-red-500 text-2xl" />
        );

      case "image":
        return (
          <FaImage className="text-sky-500 text-2xl" />
        );

      case "zip":
        return (
          <FaFileArchive className="text-yellow-500 text-2xl" />
        );

      default:
        return (
          <FaFileCode className="text-emerald-500 text-2xl" />
        );
    }
  };

  return (

    <section
      className={`
        relative
        overflow-hidden
        rounded-[2rem]
        border
        ${isDark ? 'border-white/10' : 'border-gray-200/60'}
        ${isDark ? 'bg-white/5' : 'bg-white/70'}
        backdrop-blur-2xl
        ${isDark ? 'shadow-[0_10px_60px_rgba(0,0,0,0.35)]' : 'shadow-[0_10px_60px_rgba(0,0,0,0.08)]'}
        p-5
        sm:p-7
        lg:p-8
      `}
    >

      {/* =========================================================
          BACKGROUND GRADIENTS
      ========================================================= */}

      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-violet-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-72
          h-72
          bg-cyan-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-gradient-to-r
              from-violet-500/10
              to-cyan-500/10
              border
              border-violet-500/20
              ${isDark ? 'text-violet-300' : 'text-violet-600'}
              text-sm
              font-semibold
              mb-4
            "
          >

            <HiOutlineSparkles />

            Premium Resources

          </div>

          <h2
            className={`
              text-3xl
              sm:text-4xl
              font-black
              tracking-tight
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            Lecture Resources
          </h2>

          <p
            className={`
              mt-3
              text-sm
              sm:text-base
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
              max-w-2xl
              leading-relaxed
            `}
          >
            Download notes, PDFs, source
            code, images, archives &
            premium lecture materials with
            one click.
          </p>

        </div>

        {/* FILE COUNT */}
        <motion.div

          whileHover={{
            scale: 1.04,
          }}

          className={`
            self-start
            lg:self-auto
            px-5
            py-3
            rounded-2xl
            border
            ${isDark ? 'border-white/10' : 'border-gray-200'}
            ${isDark ? 'bg-white/5' : 'bg-white/80'}
            backdrop-blur-xl
            shadow-lg
          `}
        >

          <h3
            className={`
              text-2xl
              font-black
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            {resources.length}
          </h3>

          <p
            className={`
              text-xs
              uppercase
              tracking-widest
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
              mt-1
            `}
          >
            Total Files
          </p>

        </motion.div>

      </div>

      {/* =========================================================
          RESOURCE GRID
      ========================================================= */}

      {resources.length > 0 ? (

        <motion.div
          layout
          className="
            relative
            z-10
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          <AnimatePresence>

            {resources.map(
              (resource, index) => (

                <motion.div

                  key={resource._id}

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}

                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}

                  whileHover={{
                    y: -6,
                  }}

                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    ${isDark ? 'border-white/10' : 'border-gray-200/70'}
                    ${isDark ? 'bg-[#0F172A]/80' : 'bg-white/80'}
                    backdrop-blur-2xl
                    p-5
                    ${isDark ? 'shadow-[0_10px_40px_rgba(0,0,0,0.25)]' : 'shadow-[0_10px_40px_rgba(0,0,0,0.06)]'}
                    transition-all
                    duration-500
                  `}
                >

                  {/* HOVER GLOW */}
                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      duration-500
                      bg-gradient-to-br
                      from-violet-500/10
                      to-cyan-500/10
                    "
                  />

                  {/* TOP */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    {/* LEFT */}
                    <div
                      className="
                        flex
                        items-start
                        gap-4
                        min-w-0
                      "
                    >

                      {/* ICON */}
                      <div
                        className={`
                          shrink-0
                          w-14
                          h-14
                          rounded-2xl
                          bg-gradient-to-br
                          ${isDark ? 'from-white/10 to-white/5' : 'from-white to-gray-100'}
                          border
                          ${isDark ? 'border-white/10' : 'border-gray-200'}
                          flex
                          items-center
                          justify-center
                          shadow-lg
                        `}
                      >

                        {getFileIcon(
                          resource.fileType
                        )}

                      </div>

                      {/* INFO */}
                      <div className="min-w-0">

                        <h3
                          className={`
                            text-base
                            sm:text-lg
                            font-bold
                            ${isDark ? 'text-white' : 'text-gray-900'}
                            truncate
                          `}
                        >
                          {resource.title}
                        </h3>

                        <p
                          className={`
                            mt-2
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            ${isDark ? 'bg-white/10' : 'bg-gray-100'}
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            ${isDark ? 'text-gray-300' : 'text-gray-600'}
                          `}
                        >
                          {resource.fileType}
                        </p>

                      </div>

                    </div>

                    {/* DOWNLOAD */}
                    <motion.button

                      whileTap={{
                        scale: 0.92,
                      }}

                      whileHover={{
                        scale: 1.05,
                      }}

                      onClick={() =>
                        handleDownload(
                          lecture?._id,
                          resource._id
                        )
                      }

                      disabled={
                        loadingId ===
                        resource._id
                      }

                      className="
                        shrink-0
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-500
                        text-white
                        flex
                        items-center
                        justify-center
                        shadow-xl
                        shadow-violet-500/25
                        hover:shadow-violet-500/40
                        transition-all
                        duration-300
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                      "
                    >

                      {loadingId ===
                      resource._id ? (

                        <ClipLoader
                          size={18}
                          color="white"
                        />

                      ) : (

                        <FaDownload className="text-lg" />

                      )}

                    </motion.button>

                  </div>

                  {/* BOTTOM BAR */}
                  <div
                    className={`
                      relative
                      z-10
                      mt-6
                      pt-4
                      border-t
                      ${isDark ? 'border-white/10' : 'border-gray-200/70'}
                      flex
                      items-center
                      justify-between
                    `}
                  >

                    <span
                      className={`
                        text-xs
                        ${isDark ? 'text-gray-400' : 'text-gray-500'}
                      `}
                    >
                      Ready to download
                    </span>

                    <span
                      className={`
                        text-xs
                        font-semibold
                        ${isDark ? 'text-violet-300' : 'text-violet-600'}
                      `}
                    >
                      Secure File
                    </span>

                  </div>

                </motion.div>
              )
            )}

          </AnimatePresence>

        </motion.div>

      ) : (

        // =========================================================
        // EMPTY STATE
        // =========================================================

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className={`
            relative
            z-10
            rounded-[2rem]
            border
            border-dashed
            ${isDark ? 'border-white/10' : 'border-gray-300'}
            ${isDark ? 'bg-white/5' : 'bg-white/50'}
            backdrop-blur-xl
            py-20
            px-6
            text-center
          `}
        >

          <div
            className="
              mx-auto
              w-20
              h-20
              rounded-3xl
              bg-gradient-to-br
              from-violet-500/20
              to-cyan-500/20
              flex
              items-center
              justify-center
              text-3xl
              mb-6
            "
          >
            📂
          </div>

          <h3
            className={`
              text-2xl
              font-bold
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            No Resources Available
          </h3>

          <p
            className={`
              mt-3
              text-sm
              sm:text-base
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
              max-w-md
              mx-auto
              leading-relaxed
            `}
          >
            The educator hasn’t uploaded
            any lecture resources yet.
            Files, notes & premium
            materials will appear here.
          </p>

        </motion.div>

      )}

    </section>

  );

};

export default LectureResources;