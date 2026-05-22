import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLectureData, fetchLectures } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../../App";
import ResourcesUpload from "./ResourcesUpload";
import QuizUpload from "./QuizUpload";

const EditLecture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId, moduleId, lectureId } = useParams();

  const { lectureData } = useSelector((state) => state.lecture);

  const [resources, setResources] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [existingVideo, setExistingVideo] = useState("");

  // Find Selected Lecture
  const selectedLecture = useMemo(() => {
    return lectureData.find((lecture) => lecture._id === lectureId);
  }, [lectureData, lectureId]);

  // States
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const [progress, setProgress] = useState(0);

  // Sync State
  useEffect(() => {
    if (selectedLecture) {
      setLectureTitle(selectedLecture.lectureTitle || "");

      setIsPreviewFree(selectedLecture.isPreviewFree || false);

      setExistingVideo(selectedLecture.videoUrl || "");

      setResources(selectedLecture.resources || []);

      setQuizData(selectedLecture.quiz || []);
    }
  }, [selectedLecture]);

  // Fetch lectures for this module on component mount
  useEffect(() => {
    if (moduleId) {
      dispatch(fetchLectures(moduleId));
    }
  }, [dispatch, moduleId]);

  // Handle Video Change
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 500MB Limit
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video size should be less than 500MB");
      return;
    }

    setVideoUrl(file);
  };

  // Update Lecture
  const handleUpdateLecture = async () => {
    if (!lectureTitle.trim()) {
      return toast.error("Lecture title is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree);

      if (videoUrl) {
        formData.append("videoUrl", videoUrl);
      }

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true,

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setProgress(percent);
          },
        }
      );

      // Update Redux State
      const updatedLectures = lectureData.map((lecture) =>
        lecture._id === lectureId ? result.data : lecture
      );

      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture Updated Successfully");

      navigate(`/create-lecture/${courseId}/${moduleId}`);

      setLoading(false);
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );

      setLoading(false);
    }
  };

  // Remove Lecture
  const handleRemoveLecture = async () => {
    try {
      setLoading1(true);

      await axios.delete(
        `${serverUrl}/api/course/removelecture/${lectureId}`,
        {
          withCredentials: true,
        }
      );

      // Remove from Redux
      const filteredLectures = lectureData.filter(
        (lecture) => lecture._id !== lectureId
      );

      dispatch(setLectureData(filteredLectures));

      toast.success("Lecture Removed Successfully");

      navigate(`/create-lecture/${courseId}/${moduleId}`);

      setLoading1(false);
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );

      setLoading1(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">

          <div className="flex items-center gap-4">

            <FaArrowLeftLong
              onClick={() => navigate(`/create-lecture/${courseId}/${moduleId}`)}
              className="text-2xl cursor-pointer text-gray-700 hover:text-black transition-all"
            />

            <h2 className="text-3xl font-bold text-gray-800">
              Edit Lecture
            </h2>

          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemoveLecture}
            disabled={loading1}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            {loading1 ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Remove Lecture"
            )}
          </button>

        </div>

        {/* Form */}
        <div className="mt-10 space-y-7">

          {/* Lecture Title */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lecture Title
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
              Upload Video
            </label>

            <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50">

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="cursor-pointer"
              />

              {videoUrl && (
                <div className="mt-4">

                  <p className="text-green-600 text-sm font-medium">
                    Selected File: {videoUrl.name}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Size: {(videoUrl.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* Existing Video */}
          {existingVideo && !videoUrl && (

            <div className="border rounded-2xl p-5 bg-gray-50 shadow-sm">

              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Current Lecture Video
              </h3>

              <video
                src={existingVideo}
                controls
                className="w-full rounded-xl max-h-[400px]"
              />

            </div>
          )}

          {/* Free Preview */}
          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree((prev) => !prev)}
              className="w-5 h-5 cursor-pointer"
            />

            <label className="text-gray-700 font-medium cursor-pointer">
              Is this lecture FREE preview?
            </label>

          </div>

          {/* Upload Progress */}
          {loading && (
            <div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

                <div
                  className="bg-black h-3 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />

              </div>

              <p className="text-sm text-gray-600 mt-2">
                Uploading Video... {progress}%
              </p>

            </div>
          )}


          <ResourcesUpload resources={resources}
            setResources={setResources} />

          <QuizUpload quizData={quizData}
            setQuizData={setQuizData} />

          {/* Update Button */}
          <button
            onClick={handleUpdateLecture}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 hover:scale-[1.01] active:scale-[0.99] disabled:bg-gray-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <ClipLoader size={24} color="white" />
                Updating Lecture...
              </>
            ) : (
              "Update Lecture"
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditLecture;