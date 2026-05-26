import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaArrowRight, FaArrowLeft, FaRedo } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

const QuizResult = ({ lectureId }) => {
  const quizQuestions = lectureId?.quizQuestions || [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // 👈 slide tracker

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  // Handle Answer Select
  const handleSelectAnswer = (option) => {
    if (showResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  // Next Question
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Prev Question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit Quiz
  const handleSubmit = () => {
    setShowResult(true);
  };

  // Calculate Score
  const score = quizQuestions.filter(
    (question, index) => selectedAnswers[index] === question.correctAnswer
  ).length;

  // Reset Quiz
  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResult(false);
    setCurrentIndex(0);
  };

  // Progress percentage
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="px-5 md:px-7 pb-8">
      <div className="border-t border-gray-200 pt-6">

        {/* Toggle Header */}
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
                {totalQuestions > 0
                  ? `${totalQuestions} Questions`
                  : "No questions available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showResult && (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {score}/{totalQuestions} Score
              </span>
            )}
            {isOpen ? (
              <FaChevronUp className="text-gray-500 text-sm" />
            ) : (
              <FaChevronDown className="text-gray-500 text-sm" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isOpen && (
          <div className="mt-4 space-y-4">

            {totalQuestions > 0 ? (
              <>
                {/* ─── Result Card ─── */}
                {showResult ? (
                  <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-7 text-white text-center shadow-xl">
                    <h2 className="text-2xl font-bold">Quiz Result 🎉</h2>
                    <p className="text-gray-300 mt-3 text-base">
                      You scored{" "}
                      <span className="font-bold text-white text-xl">{score}</span>
                      {" "}out of{" "}
                      <span className="font-bold text-white text-xl">{totalQuestions}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-700 rounded-full h-2 w-full overflow-hidden">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(score / totalQuestions) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      {Math.round((score / totalQuestions) * 100)}% correct
                    </p>

                    {/* Review Answers */}
                    <div className="mt-6 space-y-3 text-left">
                      {quizQuestions.map((q, i) => {
                        const userAns = selectedAnswers[i];
                        const isCorrect = userAns === q.correctAnswer;
                        return (
                          <div key={i} className="bg-white/10 rounded-2xl px-4 py-3">
                            <p className="text-sm font-semibold text-white">
                              Q{i + 1}. {q.question}
                            </p>
                            <p className={`text-xs mt-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                              {isCorrect ? "✓ Correct" : `✗ Your answer: ${userAns || "Not answered"}`}
                            </p>
                            {!isCorrect && (
                              <p className="text-xs text-green-300 mt-0.5">
                                Correct: {q.correctAnswer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleRetry}
                      className="
                        mt-6 bg-white text-black
                        px-6 py-3 rounded-2xl
                        font-semibold text-sm
                        hover:scale-105 transition-all duration-300
                        flex items-center gap-2 mx-auto
                      "
                    >
                      <FaRedo className="text-xs" />
                      Retry Quiz
                    </button>
                  </div>

                ) : (
                  /* ─── Slide Mode ─── */
                  <div className="bg-[#fafafa] border border-gray-200 rounded-3xl p-5">

                    {/* Top: Question Counter + Progress Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500">
                        Question {currentIndex + 1} of {totalQuestions}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {Object.keys(selectedAnswers).length}/{totalQuestions} answered
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5 overflow-hidden">
                      <div
                        className="bg-black h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Question */}
                    <h3 className="text-base font-bold text-gray-900 leading-7">
                      Q{currentIndex + 1}. {currentQuestion.question}
                    </h3>

                    {/* Options */}
                    <div className="mt-4 space-y-3">
                      {currentQuestion.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[currentIndex] === option;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleSelectAnswer(option)}
                            className={`
                              w-full text-left px-5 py-3 rounded-2xl border
                              transition-all duration-300
                              flex items-center justify-between
                              ${isSelected
                                ? "border-black bg-black text-white"
                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                              }
                            `}
                          >
                            <span className="font-medium text-sm">{option}</span>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                      {/* Prev */}
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="
                          flex items-center gap-2
                          px-4 py-2.5 rounded-xl
                          border border-gray-200
                          text-sm font-semibold text-gray-700
                          hover:bg-gray-100
                          disabled:opacity-30 disabled:cursor-not-allowed
                          transition-all duration-200
                        "
                      >
                        <FaArrowLeft className="text-xs" />
                        Prev
                      </button>

                      {/* Next or Submit */}
                      {isLastQuestion ? (
                        <button
                          onClick={handleSubmit}
                          disabled={Object.keys(selectedAnswers).length === 0}
                          className="
                            flex items-center gap-2
                            px-5 py-2.5 rounded-xl
                            bg-black text-white
                            text-sm font-semibold
                            hover:bg-gray-800
                            disabled:opacity-30 disabled:cursor-not-allowed
                            transition-all duration-200
                          "
                        >
                          Submit Quiz
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="
                            flex items-center gap-2
                            px-5 py-2.5 rounded-xl
                            bg-black text-white
                            text-sm font-semibold
                            hover:bg-gray-800
                            transition-all duration-200
                          "
                        >
                          Next
                          <FaArrowRight className="text-xs" />
                        </button>
                      )}
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-1.5 mt-5">
                      {quizQuestions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`
                            rounded-full transition-all duration-300
                            ${i === currentIndex
                              ? "w-5 h-2 bg-black"
                              : selectedAnswers[i] !== undefined
                              ? "w-2 h-2 bg-gray-400"
                              : "w-2 h-2 bg-gray-200"
                            }
                          `}
                        />
                      ))}
                    </div>

                  </div>
                )}
              </>
            ) : (
              /* No Quiz */
              <div className="bg-[#fafafa] border border-dashed border-gray-300 rounded-3xl py-10 flex items-center justify-center text-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-700">No Quiz Available</h3>
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