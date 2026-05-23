import React, { useState } from "react";

import {
  FaDownload,
  FaFilePdf,
  FaFileCode,
  FaFileArchive,
  FaImage,
} from "react-icons/fa";

import axios from "axios";

import { toast } from "react-toastify";

import { serverUrl } from "../../App";

import { ClipLoader } from "react-spinners";

const LectureResources = ({ lecture  }) => {


  // RESOURCES
  const resources =
    lecture?.resources || [];

  // LOADING STATE
  const [loadingId, setLoadingId] =
    useState(null);

  // DOWNLOAD RESOURCE
  const handleDownload = async (
    lectureId,
    resourceId
  ) => {

    try {

      setLoadingId(resourceId);

      const response = await axios.get(

        `${serverUrl}/api/course/download-resource/${lectureId}/${resourceId}`,

        {
          withCredentials: true,
        }

      );

      // =========================
      // DIRECT DOWNLOAD
      // =========================
      const link =
        document.createElement("a");

      link.href =
        response.data.fileUrl;

      document.body.appendChild(
        link
      );

      link.click();

      setTimeout(() => {

        link.remove();

      }, 100);

      toast.success(
        "Download started"
      );

    } catch (error) {

      console.log(error);

      toast.error(

        error?.response?.data?.message ||

        "Download failed"

      );

    } finally {

      setLoadingId(null);

    }

  };

  // FILE ICON
  const getFileIcon = (type) => {

    switch (type) {

      case "pdf":
        return (
          <FaFilePdf className="text-red-500 text-xl" />
        );

      case "image":
        return (
          <FaImage className="text-blue-500 text-xl" />
        );

      case "zip":
        return (
          <FaFileArchive className="text-yellow-500 text-xl" />
        );

      default:
        return (
          <FaFileCode className="text-green-500 text-xl" />
        );
    }
  };

  return (

    <div className="px-5 md:px-7 pb-7">

      <div className="border-t border-gray-200 pt-7">

        {/* =========================
            HEADING
        ========================== */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Lecture Resources
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Download notes, source code,
              PDFs & lecture files
            </p>

          </div>

          <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl">

            {resources.length} Files

          </div>

        </div>

        {/* =========================
            RESOURCE LIST
        ========================== */}
        {resources.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {resources.map((resource) => (

              <div
                key={resource._id}
                className="
                  bg-[#fafafa]
                  border border-gray-200
                  rounded-2xl
                  p-4
                  flex items-center justify-between
                  hover:shadow-md
                  transition-all duration-300
                "
              >

                {/* =========================
                    LEFT SECTION
                ========================== */}
                <div className="flex items-center gap-4 min-w-0">

                  {/* FILE ICON */}
                  <div
                    className="
                      w-12 h-12
                      rounded-xl
                      bg-white
                      border border-gray-200
                      flex items-center justify-center
                      shadow-sm
                    "
                  >

                    {getFileIcon(
                      resource.fileType
                    )}

                  </div>

                  {/* FILE INFO */}
                  <div className="min-w-0">

                    <h3 className="font-semibold text-gray-800 truncate">

                      {resource.title}

                    </h3>

                    <p className="text-xs text-gray-500 mt-1 uppercase">

                      {resource.fileType}

                    </p>

                  </div>

                </div>

                {/* =========================
                    DOWNLOAD BUTTON
                ========================== */}
                <button

                  onClick={() =>
                    handleDownload(
                      lecture?._id,
                      resource._id
                    )
                  }

                  disabled={
                    loadingId === resource._id
                  }

                  className="
                    min-w-[45px]
                    h-[45px]
                    rounded-xl
                    bg-black
                    text-white
                    flex items-center justify-center
                    hover:scale-105
                    transition-all duration-300
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >

                  {loadingId === resource._id ? (

                    <ClipLoader
                      size={18}
                      color="white"
                    />

                  ) : (

                    <FaDownload />

                  )}

                </button>

              </div>

            ))}

          </div>

        ) : (

          // =========================
          // EMPTY STATE
          // =========================
          <div
            className="
              bg-[#fafafa]
              border border-dashed border-gray-300
              rounded-3xl
              py-12
              flex items-center justify-center
              text-center
            "
          >

            <div>

              <h3 className="text-lg font-semibold text-gray-700">

                No Resources Available

              </h3>

              <p className="text-sm text-gray-500 mt-2">

                Creator has not uploaded
                any resources yet.

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default LectureResources;