import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditLecture = () => {
  const navigate = useNavigate();

  const { courseId, lectureId } = useParams();

  const { lectureData } = useSelector((state) => state.lecture);

  // Find Selected Lecture
  const selectedLecture = lectureData.find(
    (lecture) => lecture._id === lectureId
  );

  // States
  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || ""
  );

  const [videoFile, setVideoFile] = useState(null);

  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || false
  );

  // Handle Video
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoFile(file);
    }
  };

  // Update Lecture
  const handleUpdateLecture = () => {
    console.log({
      lectureTitle,
      videoFile,
      isPreviewFree,
    });
  };

  // Remove Lecture
  const handleRemoveLecture = () => {
    console.log("Lecture Removed");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">

          <FaArrowLeftLong
            onClick={() => navigate(`/edit-course/${courseId}`)}
            className="text-xl cursor-pointer text-gray-700"
          />

          <h2 className="text-3xl font-bold text-gray-800">
            Update Your Lecture
          </h2>

        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemoveLecture}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Remove Lecture
        </button>

        {/* Form */}
        <div className="mt-10 space-y-6">

          {/* Lecture Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>

            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter Lecture Title"
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Video *
            </label>

            <div className="border border-gray-300 rounded-xl p-4">

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="cursor-pointer"
              />

              {
                videoFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected File : {videoFile.name}
                  </p>
                )
              }

            </div>
          </div>

          {/* Free Preview */}
          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={(e) => setIsPreviewFree(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />

            <label className="text-gray-700 font-medium">
              Is this video FREE
            </label>

          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateLecture}
            className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg transition-all"
          >
            Update Lecture
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditLecture;