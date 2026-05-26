import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

const QuizResult = ({ lectureId }) => {
  const quizQuestions = lectureId?.quizQuestions || [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  // Handle Answer Select
  const handleSelectAnswer = (questionIndex, option) => {
    if (showResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // Calculate Score
  const score = quizQuestions.filter(
    (question, index) => selectedAnswers[index] === question.correctAnswer
  ).length;

  // Reset Quiz
  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResult(false);
  };

  return (
    <div className="px-5 md:px-7 pb-8">
      <div className="border-t border-gray-200 pt-6">

        {/* Toggle Header — click karo to open/close */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between
            bg-[#fafafa] hover:bg-gray-100
            border border-gray-200
            px-5 py-4 rounded-2xl
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <MdQuiz className="text-white text-[18px]" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-gray-900">Lecture Quiz</h2>
              <p className="text-xs text-gray-500">
                {quizQuestions.length > 0
                  ? `${quizQuestions.length} Questions`
                  : "No questions available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showResult && (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {score}/{quizQuestions.length} Score
              </span>
            )}
            {isOpen ? (
              <FaChevronUp className="text-gray-500 text-sm" />
            ) : (
              <FaChevronDown className="text-gray-500 text-sm" />
            )}
          </div>
        </button>

        {/* Slider Content */}
        {isOpen && (
          <div className="mt-4 space-y-4">

            {quizQuestions.length > 0 ? (
              <>
                {/* Questions */}
                {quizQuestions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="bg-[#fafafa] border border-gray-200 rounded-3xl p-5"
                  >
                    {/* Question */}
                    <h3 className="text-base font-bold text-gray-900 leading-7">
                      Q{questionIndex + 1}. {question.question}
                    </h3>

                    {/* Options */}
                    <div className="mt-4 space-y-3">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[questionIndex] === option;
                        const isCorrect = question.correctAnswer === option;
                        const isWrong = showResult && isSelected && !isCorrect;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleSelectAnswer(questionIndex, option)}
                            className={`
                              w-full text-left px-5 py-3 rounded-2xl border
                              transition-all duration-300
                              flex items-center justify-between

                              ${isSelected
                                ? "border-black bg-black text-white"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                              }
                              ${showResult && isCorrect
                                ? "!bg-green-500 !text-white !border-green-500"
                                : ""
                              }
                              ${isWrong
                                ? "!bg-red-500 !text-white !border-red-500"
                                : ""
                              }
                            `}
                          >
                            <span className="font-medium text-sm">{option}</span>

                            {showResult && isCorrect && <FaCheckCircle />}
                            {showResult && isWrong && <FaTimesCircle />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                {!showResult && (
                  <button
                    onClick={() => setShowResult(true)}
                    className="
                      w-full bg-black hover:bg-gray-800
                      text-white py-4 rounded-2xl
                      font-semibold text-base
                      transition-all duration-300
                    "
                  >
                    Submit Quiz
                  </button>
                )}

                {/* Result Card */}
                {showResult && (
                  <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-7 text-white text-center shadow-xl">
                    <h2 className="text-2xl font-bold">Quiz Result 🎉</h2>

                    <p className="text-gray-300 mt-3 text-base">
                      You scored{" "}
                      <span className="font-bold text-white text-xl">{score}</span>
                      {" "}out of{" "}
                      <span className="font-bold text-white text-xl">
                        {quizQuestions.length}
                      </span>
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-700 rounded-full h-2 w-full overflow-hidden">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${(score / quizQuestions.length) * 100}%`,
                        }}
                      />
                    </div>

                    <p className="text-gray-400 text-xs mt-2">
                      {Math.round((score / quizQuestions.length) * 100)}% correct
                    </p>

                    <button
                      onClick={handleRetry}
                      className="
                        mt-5 bg-white text-black
                        px-6 py-3 rounded-2xl
                        font-semibold text-sm
                        hover:scale-105 transition-all duration-300
                      "
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Quiz */
              <div className="bg-[#fafafa] border border-dashed border-gray-300 rounded-3xl py-10 flex items-center justify-center text-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-700">
                    No Quiz Available
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Creator has not added any quiz questions yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;