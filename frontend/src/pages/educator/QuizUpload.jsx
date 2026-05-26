// QuizUpload.jsx

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

const QuizUpload = ({ quizData,
  setQuizData}) => {

  const { lectureId } = useParams();

  const [question, setQuestion] = useState("");

  const [options, setOptions] =
    useState([
      "",
      "",
      "",
      "",
    ]);

  const [correctAnswer, setCorrectAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Handle Option Change
  const handleOptionChange = (
    index,
    value
  ) => {

    const updatedOptions = [
      ...options,
    ];

    updatedOptions[index] = value;

    setOptions(updatedOptions);

  };

  // Add Quiz
  const handleAddQuiz = async () => {

    if (
      !question ||
      options.some(
        (option) => !option
      ) ||
      !correctAnswer
    ) {

      return toast.error(
        "Please fill all fields"
      );

    }

    try {

      setLoading(true);

      const result = await axios.post(

        `${serverUrl}/api/course/add-quiz/${lectureId}`,

        {
          question,
          options,
          correctAnswer,
        },

        {
          withCredentials: true,
        }

      );

      setQuizData(result.data.quizQuestions);

      toast.success(
        "Quiz Added Successfully"
      );

      // Reset
      setQuestion("");

      setOptions([
        "",
        "",
        "",
        "",
      ]);

      setCorrectAnswer("");

      setLoading(false);

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message ||
        "Quiz upload failed"
      );

      setLoading(false);

    }

  };

  const handleRemoveQuiz = async (
    quizId
  ) => {

    try {

      const response = await axios.delete(

        `${serverUrl}/api/course/remove-quiz/${lectureId}/${quizId}`,

        {
          withCredentials: true,
        }

      );

      // Use the updated quizQuestions from API response
      setQuizData(response.data.quizQuestions);

      toast.success(
        "Quiz Removed Successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to remove quiz"
      );

    }

  };

  return (

    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">

      {/* Heading */}
      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Add Quiz Question
        </h2>

        <p className="text-gray-500 mt-1 text-sm">
          Create MCQ quiz for this lecture
        </p>

      </div>

      {/* Existing Quiz Questions */}
      {quizData?.length > 0 && (

        <div className="mb-8">

          <h3 className="text-xl font-bold text-gray-800 mb-5">
            Added Quiz Questions
          </h3>

          <div className="space-y-4">

            {quizData.map((quiz, index) => (

              <div
                key={quiz._id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="font-semibold text-gray-800">
                      Q{index + 1}. {quiz.question}
                    </p>

                    <div className="mt-3 space-y-2">

                      {quiz.options?.map(
                        (option, i) => (

                          <p
                            key={i}
                            className={`text-sm px-3 py-2 rounded-lg ${option ===
                                quiz.correctAnswer
                                ? "bg-green-100 text-green-700 font-medium"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {option}
                          </p>

                        )
                      )}

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleRemoveQuiz(
                        quiz._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* Question */}
      <div className="mb-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Question
        </label>

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Enter Question"
          className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
        />

      </div>

      {/* Options */}
      <div className="space-y-4">

        {options.map(
          (option, index) => (

            <div key={index}>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Option {index + 1}
              </label>

              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(
                    index,
                    e.target.value
                  )
                }
                placeholder={`Enter Option ${index + 1
                  }`}
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
              />

            </div>

          )
        )}

      </div>

      {/* Correct Answer */}
      <div className="mt-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Correct Answer
        </label>

        <select
          value={correctAnswer}
          onChange={(e) =>
            setCorrectAnswer(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black bg-white"
        >

          <option value="">
            Select Correct Answer
          </option>

          {options.map(
            (option, index) => (

              <option
                key={index}
                value={option}
              >
                {option ||
                  `Option ${index + 1
                  }`}
              </option>

            )
          )}

        </select>

      </div>

      {/* Upload Button */}
      <button
        onClick={handleAddQuiz}
        disabled={loading}
        className="w-full mt-8 bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3"
      >

        {loading ? (
          <>
            <ClipLoader
              size={22}
              color="white"
            />
            Adding Quiz...
          </>
        ) : (
          "Add Quiz Question"
        )}

      </button>

    </div>

  );

};

export default QuizUpload;