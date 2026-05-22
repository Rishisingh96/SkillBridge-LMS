// LectureResources.jsx

import React from "react";
import {
  FaDownload,
  FaFilePdf,
  FaFileCode,
  FaFileArchive,
  FaImage,
} from "react-icons/fa";

const LectureResources = ({ selectedLecture }) => {

  const resources = selectedLecture?.resources || [];

  // File Icon
  const getFileIcon = (type) => {

    switch (type) {

      case "pdf":
        return <FaFilePdf className="text-red-500 text-xl" />;

      case "image":
        return <FaImage className="text-blue-500 text-xl" />;

      case "zip":
        return <FaFileArchive className="text-yellow-500 text-xl" />;

      default:
        return <FaFileCode className="text-green-500 text-xl" />;
    }
  };

  return (

    <div className="px-5 md:px-7 pb-7">

      <div className="border-t border-gray-200 pt-7">

        {/* Heading */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Lecture Resources
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Download notes, source code, PDFs & lecture files
            </p>

          </div>

          <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl">
            {resources.length} Files
          </div>

        </div>

        {/* Resources */}
        {resources.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {resources.map((resource, index) => (

              <div
                key={index}
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

                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">

                  {/* Icon */}
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
                    {getFileIcon(resource.fileType)}
                  </div>

                  {/* Text */}
                  <div className="min-w-0">

                    <h3 className="font-semibold text-gray-800 truncate">
                      {resource.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 uppercase">
                      {resource.fileType}
                    </p>

                  </div>

                </div>

                {/* Download */}
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="
                    min-w-[45px]
                    h-[45px]
                    rounded-xl
                    bg-black
                    text-white
                    flex items-center justify-center
                    hover:scale-105
                    transition-all duration-300
                  "
                >
                  <FaDownload />
                </a>

              </div>

            ))}

          </div>

        ) : (

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
                Creator has not uploaded any resources yet.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default LectureResources;