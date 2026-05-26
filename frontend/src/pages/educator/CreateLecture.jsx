import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaPlus, FaTrash, FaVideo } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  fetchLectures,
  createLecture,
  deleteLecture,
  clearError,
} from "../../redux/slices/lectureSlice";
import { serverUrl } from "../../App";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const dispatch = useDispatch();

  const { lectureData, loading, error } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch Lectures on component mount
  useEffect(() => {
    dispatch(fetchLectures(moduleId));
  }, [dispatch, moduleId]);

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle Create Lecture
  const handleCreateLecture = async (e) => {
    e.preventDefault();

    if (!lectureTitle.trim()) {
      return toast.error("Lecture title is required");
    }

    try {
      await dispatch(
        createLecture({
          moduleId,
          lectureData: { lectureTitle },
        })
      ).unwrap();

      toast.success("Lecture created successfully");
      setLectureTitle("");
      setShowCreateForm(false);
    } catch (error) {
      toast.error(error || "Failed to create lecture");
    }
  };

  // Handle Delete Lecture
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      await dispatch(deleteLecture(lectureId)).unwrap();
      toast.success("Lecture deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete lecture");
    }
  };

  // Handle Edit Lecture
  const handleEditLecture = (lectureId) => {
    navigate(`/educator/editlecture/${courseId}/${moduleId}/${lectureId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              onClick={() => navigate(`/educator/create-module/${courseId}`)}
              className="text-2xl cursor-pointer text-gray-700 hover:text-black transition-all"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Lecture Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage lectures for this module
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <FaPlus />
            {showCreateForm ? "Cancel" : "Add Lecture"}
          </button>
        </div>

        {/* Create Lecture Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Lecture
            </h2>
            <form onSubmit={handleCreateLecture}>
              <div className="space-y-6">
                {/* Lecture Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    placeholder="e.g. Introduction to React Components"
                    className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color="white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Lecture
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lectures List */}
        <div className="space-y-4">
          {loading && lectureData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader size={40} color="black" />
            </div>
          ) : lectureData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">
                <FaVideo />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Lectures Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first lecture for this module.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <FaPlus className="inline mr-2" />
                Create First Lecture
              </button>
            </div>
          ) : (
            lectureData.map((lecture, index) => (
              <div
                key={lecture._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Lecture Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Lecture {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">
                        {lecture.lectureTitle}
                      </h3>
                    </div>
                    {lecture.videoUrl && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaVideo className="text-green-600" />
                        <span>Video uploaded</span>
                      </div>
                    )}
                    {lecture.isPreviewFree && (
                      <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Free Preview
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditLecture(lecture._id)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLecture(lecture._id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {lectureData.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Module Statistics
                </h3>
                <p className="text-gray-500 text-sm">
                  Total lectures in this module
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {lectureData.length}
                </div>
                <div className="text-gray-500 text-sm">
                  {lectureData.length === 1 ? "Lecture" : "Lectures"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
