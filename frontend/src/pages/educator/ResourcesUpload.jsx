// ResourcesUpload.jsx

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import { useTheme } from "../../context/ThemeContext";

const ResourcesUpload = ({ resources,
  setResources }) => {

  const { lectureId } = useParams();
  const { isDark } = useTheme();

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  // Handle File Change
  const handleFileChange = (e) => {

    const selectedFiles = Array.from(
      e.target.files
    );

    setFiles(selectedFiles);

  };

  // Handle Upload 
  const handleUploadResources = async () => {

  if (files.length === 0) {

    return toast.error(
      "Please select files"
    );

  }

  try {

    setLoading(true);

    const formData = new FormData();

    files.forEach((file) => {

      formData.append("files", file);

    });

    const result = await axios.post(

      `${BASE_URL}/api/course/upload-resource/${lectureId}`,

      formData,

      {

        withCredentials: true,

        onUploadProgress: (
          progressEvent
        ) => {

          const percent = Math.round(
            (progressEvent.loaded * 100) /
            progressEvent.total
          );

          setProgress(percent);

        },

      }

    );

    // Update UI Instantly
    setResources(result.data.resources);

    toast.success(
      "Resources Uploaded Successfully"
    );

    // Reset
    setFiles([]);

    setLoading(false);

  } catch (error) {

    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      "Upload failed"
    );

    setLoading(false);

  }

};

  // Remove Resource 
  const handleRemoveResource = async (
    resourceId
  ) => {

    try {

      const result = await axios.delete(

        `${BASE_URL}/api/course/removeresource/${lectureId}/${resourceId}`,

        {
          withCredentials: true,
        }

      );

      const updatedResources =
        resources.filter(
          (item) => item._id !== resourceId
        );

      setResources(result.data.resources);

      toast.success(
        "Resources Remove Successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to remove resource"
      );

    }

  };

  // View Resourse 
  const handleViewResource = async (
  resourceId
) => {

  try {

    const result = await axios.get(

      `${BASE_URL}/api/course/download-resource/${lectureId}/${resourceId}`,

      {
        withCredentials: true,
      }

    );

    // OPEN FILE
    window.open(
      result.data.fileUrl,
      "_blank"
    );

  } catch (error) {

    console.log(error);

    toast.error(

      error?.response?.data?.message ||

      "Failed to open resource"

    );

  }

};

  return (

    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6`}>

      {/* Heading */}
      <div className="mb-5">

        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Upload Notes & Resources
        </h2>

        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 text-sm`}>
          Upload PDFs, Images, ZIP,
          Source Code & Documents
        </p>

      </div>

      {/* Upload Box */}
      <div className={`border-2 border-dashed ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-white'} rounded-2xl p-6`}>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />

        {/* Existing Uploaded Resources */}
        {resources?.length > 0 && (

          <div className="mt-8">

            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-5`}>
              Uploaded Notes & Resources
            </h3>

            <div className="space-y-4">

              {resources.map((resource, index) => (

                <div
                  key={resource._id || index}
                  className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-5 shadow-sm`}
                >

                  <div className="flex items-center justify-between gap-5">

                    <div>

                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {resource.title ||
                          `Resource ${index + 1}`}
                      </p>

                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        PDF / Notes File
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={()=>
                          handleViewResource(resource._id)
                        }
                        
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleRemoveResource(
                            resource._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* File List */}
        {files.length > 0 && (

          <div className="mt-5 space-y-3">

            {files.map((file, index) => (

              <div
                key={`${file.name}-${file.size}-${index}`}
                className={`flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-3 rounded-xl`}
              >

                <div>

                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} text-sm`}>
                    {file.name}
                  </p>

                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Progress */}
      {loading && (

        <div className="mt-6">

          <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>

            <div
              className="bg-black h-3 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Uploading Resources...
            {" "}
            {progress}%
          </p>

        </div>

      )}

      {/* Upload Button */}
      <button
        onClick={handleUploadResources}
        disabled={loading}
        className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3"
      >

        {loading ? (
          <>
            <ClipLoader
              size={22}
              color="white"
            />
            Uploading...
          </>
        ) : (
          "Upload Resources"
        )}

      </button>

    </div>

  );

};

export default ResourcesUpload;