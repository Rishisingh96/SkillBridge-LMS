// QuizResult.jsx

import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const QuizResult = ({
  selectedLecture,
}) => {

  const quizQuestions =
    selectedLecture?.quizQuestions ||
    [];

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [showResult, setShowResult] =
    useState(false);

  // Handle Answer Select
  const handleSelectAnswer = (
    questionIndex,
    option
  ) => {

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

  };

  // Calculate Score
  const score =
    quizQuestions.filter(
      (question, index) =>
        selectedAnswers[index] ===
        question.correctAnswer
    ).length;

  return (

    <div className="px-5 md:px-7 pb-8">

      <div className="border-t border-gray-200 pt-7">

        {/* Heading */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Lecture Quiz
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Test your knowledge after watching this lecture
            </p>

          </div>

          <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl">
            {quizQuestions.length} Questions
          </div>

        </div>

        {/* Quiz Questions */}
        {quizQuestions.length > 0 ? (

          <div className="space-y-6">

            {quizQuestions.map(
              (question, questionIndex) => (

                <div
                  key={questionIndex}
                  className="
                    bg-[#fafafa]
                    border border-gray-200
                    rounded-3xl
                    p-5
                  "
                >

                  {/* Question */}
                  <h3 className="text-lg font-bold text-gray-900 leading-7">

                    Q{questionIndex + 1}.
                    {" "}
                    {question.question}

                  </h3>

                  {/* Options */}
                  <div className="mt-5 space-y-3">

                    {question.options.map(
                      (option, optionIndex) => {

                        const isSelected =
                          selectedAnswers[
                            questionIndex
                          ] === option;

                        const isCorrect =
                          question.correctAnswer ===
                          option;

                        const isWrong =
                          showResult &&
                          isSelected &&
                          !isCorrect;

                        return (

                          <button
                            key={optionIndex}
                            onClick={() =>
                              handleSelectAnswer(
                                questionIndex,
                                option
                              )
                            }
                            className={`
                              w-full
                              text-left
                              px-5 py-4
                              rounded-2xl
                              border
                              transition-all duration-300
                              flex items-center justify-between

                              ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }

                              ${
                                showResult &&
                                isCorrect
                                  ? "!bg-green-500 !text-white !border-green-500"
                                  : ""
                              }

                              ${
                                isWrong
                                  ? "!bg-red-500 !text-white !border-red-500"
                                  : ""
                              }
                            `}
                          >

                            <span className="font-medium">
                              {option}
                            </span>

                            {/* Result Icon */}
                            {showResult &&
                              isCorrect && (
                                <FaCheckCircle />
                              )}

                            {showResult &&
                              isWrong && (
                                <FaTimesCircle />
                              )}

                          </button>

                        );

                      }
                    )}

                  </div>

                </div>

              )
            )}

            {/* Submit Button */}
            {!showResult && (

              <button
                onClick={() =>
                  setShowResult(true)
                }
                className="
                  w-full
                  bg-black
                  hover:bg-gray-900
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  text-lg
                  transition-all duration-300
                "
              >
                Submit Quiz
              </button>

            )}

            {/* Result */}
            {showResult && (

              <div
                className="
                  bg-gradient-to-r
                  from-black
                  to-gray-900
                  rounded-3xl
                  p-7
                  text-white
                  text-center
                  shadow-xl
                "
              >

                <h2 className="text-3xl font-bold">
                  Quiz Result
                </h2>

                <p className="text-gray-300 mt-3 text-lg">

                  You scored
                  {" "}
                  <span className="font-bold text-white">
                    {score}
                  </span>
                  {" "}
                  out of
                  {" "}
                  <span className="font-bold text-white">
                    {quizQuestions.length}
                  </span>

                </p>

                <div className="mt-6">

                  <button
                    onClick={() => {

                      setSelectedAnswers(
                        {}
                      );

                      setShowResult(false);

                    }}
                    className="
                      bg-white
                      text-black
                      px-6 py-3
                      rounded-2xl
                      font-semibold
                      hover:scale-105
                      transition-all duration-300
                    "
                  >
                    Retry Quiz
                  </button>

                </div>

              </div>

            )}

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
                No Quiz Available
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Creator has not added any quiz questions yet.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default QuizResult;