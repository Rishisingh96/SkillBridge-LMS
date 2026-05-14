import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const dispatch = useDispatch();

  const { lectureData } = useSelector((state) => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Create Lecture
  const handleCreateLecture = async () => {
    // Validation
    if (!lectureTitle.trim()) {
      return toast.error("Lecture title is required");
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true },
      );

      console.log(result.data);

      // Update Redux State
      dispatch(setLectureData([...lectureData, result.data.lecture]));

      toast.success("Lecture Added Successfully");

      setLectureTitle("");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get Course Lectures
  useEffect(() => {
    const getCourseLectures = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true },
        );

        console.log(result.data);

        // lectures array from backend
        dispatch(setLectureData(result.data.lectures));
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data?.message || "Failed to fetch lectures",
        );
      }
    };

    getCourseLectures();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let's Add a Lecture
          </h1>

          <p className="text-gray-500 text-lg">
            Enter the lecture title and build your course content.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title
            </label>

            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="e.g. Introduction to MERN Stack"
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/edit-course/${courseId}`)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all"
            >
              <FaArrowLeftLong />
              Back to Course
            </button>

            {/* Create Lecture Button */}
            <button
              onClick={handleCreateLecture}
              disabled={loading}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all disabled:opacity-70"
            >
              {loading ? (
                <ClipLoader size={24} color="white" />
              ) : (
                "+ Create Lecture"
              )}
            </button>
          </div>

          {/* Lecture List */}
          <div className="space-y-3">
            {lectureData?.length > 0 ? (
              lectureData.map((lecture, index) => (
                <div
                  key={lecture._id || index}
                  className="bg-gray-100 rounded-lg flex justify-between items-center p-4 text-sm font-medium text-gray-700"
                >
                  <span>
                    Lecture {index + 1} : {lecture.lectureTitle}
                  </span>
                  <FaEdit
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/editlecture/${courseId}/${lecture._id}`)
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                No lectures added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
