import React, { useState, useEffect } from "react";

import {
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaArrowLeft,
  FaRedo,
  FaLockOpen,
} from "react-icons/fa";

import { MdQuiz } from "react-icons/md";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import { toast } from "react-toastify";

const QuizResult = ({ lectureId, onQuizComplete }) => {

  const quizQuestions =
    lectureId?.quizQuestions || [];

  const { isDark } = useTheme();

  const [isOpen, setIsOpen] =
    useState(false);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [showResult, setShowResult] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  // Reset quiz state when lecture changes
  useEffect(() => {
    setSelectedAnswers({});
    setShowResult(false);
    setCurrentIndex(0);
    setIsOpen(false);
  }, [lectureId?._id]);

  const totalQuestions =
    quizQuestions.length;

  const currentQuestion =
    quizQuestions[currentIndex];

  const isLastQuestion =
    currentIndex === totalQuestions - 1;

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const handleSelectAnswer = (option) => {

    if (showResult) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  // =========================================================
  // SCORE
  // =========================================================

  const score = quizQuestions.filter(
    (q, i) =>
      selectedAnswers[i] ===
      q.correctAnswer
  ).length;

  const progress =
    ((currentIndex + 1) /
      totalQuestions) *
    100;

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {

    setSelectedAnswers({});

    setCurrentIndex(0);

    setShowResult(false);
  };

  // =========================================================
  // UNLOCK NEXT VIDEO
  // =========================================================

  const handleUnlockNextVideo = async () => {
    if (!lectureId?._id) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/course/mark-quiz-completed/${lectureId._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Quiz completed! Next video unlocked.");
        
        // Call parent callback to refresh modules
        if (onQuizComplete) {
          onQuizComplete();
        }
      }
    } catch (error) {
      console.error("Error marking quiz as completed:", error);
      toast.error(error.response?.data?.message || "Failed to unlock next video");
    }
  };

  return (

    <div className="px-4 md:px-7 pb-8">

      <div
        className={`
          rounded-[2rem]
          border
          ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200/70 bg-white/70'}
          backdrop-blur-2xl
          overflow-hidden
          shadow-[0_10px_50px_rgba(0,0,0,0.08)]
        `}
      >

        {/* HEADER */}
        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="
            w-full
            flex
            items-center
            justify-between
            p-5
            sm:p-6
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-500
                text-white
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <MdQuiz className="text-xl" />
            </div>

            <div className="text-left">

              <h2
                className={`
                  text-lg
                  sm:text-xl
                  font-bold
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}
              >
                Lecture Quiz
              </h2>

              <p
                className={`
                  text-sm
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}
              >
                {totalQuestions} Questions
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            {showResult && (

              <div
                className={`
                  px-4
                  py-2
                  rounded-xl
                  bg-green-500/10
                  text-sm
                  font-semibold
                  ${isDark ? 'text-green-400' : 'text-green-600'}
                `}
              >
                {score}/{totalQuestions}
              </div>
            )}

            {isOpen ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}

          </div>

        </button>

        {/* CONTENT */}
        <AnimatePresence>

          {isOpen && (

            <motion.div

              initial={{
                opacity: 0,
                height: 0,
              }}

              animate={{
                opacity: 1,
                height: "auto",
              }}

              exit={{
                opacity: 0,
                height: 0,
              }}

              className="px-5 pb-5"
            >

              {totalQuestions > 0 ? (

                <>
                  {/* RESULT */}
                  {showResult ? (

                    <div
                      className={`
                        rounded-[2rem]
                        ${isDark ? 'bg-gradient-to-br from-[#0F172A] to-[#111827]' : 'bg-gradient-to-br from-gray-100 to-gray-200'}
                        ${isDark ? 'text-white' : 'text-gray-900'}
                        p-7
                        text-center
                      `}
                    >

                      <h2 className="text-3xl font-black">
                        Quiz Completed 🎉
                      </h2>

                      <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        You scored{" "}
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {score}
                        </span>{" "}
                        out of{" "}
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {totalQuestions}
                        </span>
                      </p>

                      {/* SCORE BAR */}
                      <div className="mt-6">

                        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>

                          <motion.div

                            initial={{
                              width: 0,
                            }}

                            animate={{
                              width: `${(score / totalQuestions) * 100}%`,
                            }}

                            className="
                              h-full
                              bg-gradient-to-r
                              from-green-400
                              to-emerald-500
                            "
                          />

                        </div>

                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {Math.round(
                            (score /
                              totalQuestions) *
                              100
                          )}
                          % Correct
                        </p>

                      </div>

                      {/* REVIEW */}
                      <div className="mt-8 space-y-3 text-left">

                        {quizQuestions.map(
                          (q, i) => {

                            const correct =
                              selectedAnswers[i] ===
                              q.correctAnswer;

                            return (

                              <div
                                key={i}
                                className={`
                                  rounded-2xl
                                  ${isDark ? 'bg-white/5' : 'bg-white/70'}
                                  border
                                  ${isDark ? 'border-white/10' : 'border-gray-200'}
                                  p-4
                                `}
                              >

                                <p className="font-semibold">
                                  Q{i + 1}.{" "}
                                  {q.question}
                                </p>

                                <p
                                  className={`
                                    mt-2 text-sm
                                    ${
                                      correct
                                        ? (isDark ? "text-green-400" : "text-green-600")
                                        : (isDark ? "text-red-400" : "text-red-600")
                                    }
                                  `}
                                >
                                  {correct
                                    ? "✓ Correct"
                                    : `✗ ${selectedAnswers[i] || "Not Answered"}`}
                                </p>

                                {!correct && (

                                  <p className={`text-sm mt-1 ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                                    Correct:{" "}
                                    {
                                      q.correctAnswer
                                    }
                                  </p>
                                )}

                              </div>
                            );
                          }
                        )}

                      </div>

                      {/* RETRY */}
                      <button
                        onClick={handleRetry}
                        className={`
                          mt-7
                          inline-flex
                          items-center
                          gap-2
                          px-6
                          py-3
                          rounded-2xl
                          ${isDark ? 'bg-white text-black' : 'bg-black text-white'}
                          font-semibold
                          hover:scale-105
                          transition-all
                        `}
                      >

                        <FaRedo />

                        Retry Quiz

                      </button>

                      {/* UNLOCK NEXT VIDEO */}
                      <button
                        onClick={handleUnlockNextVideo}
                        className={`
                          mt-4
                          inline-flex
                          items-center
                          gap-2
                          px-6
                          py-3
                          rounded-2xl
                          bg-gradient-to-r
                          from-green-500
                          to-emerald-600
                          text-white
                          font-semibold
                          hover:scale-105
                          transition-all
                          shadow-xl
                        `}
                      >

                        <FaLockOpen />

                        Unlock Next Video

                      </button>

                    </div>

                  ) : (

                    // QUIZ CARD
                    <div
                      className={`
                        rounded-[2rem]
                        border
                        ${isDark ? 'border-white/10 bg-[#0F172A]/70' : 'border-gray-200 bg-white/70'}
                        backdrop-blur-xl
                        p-5
                        sm:p-7
                      `}
                    >

                      {/* TOP */}
                      <div className="flex items-center justify-between mb-4">

                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Question {currentIndex + 1} / {totalQuestions}
                        </p>

                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {Object.keys(selectedAnswers).length} Answered
                        </p>

                      </div>

                      {/* PROGRESS */}
                      <div className={`h-2 rounded-full overflow-hidden mb-7 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>

                        <motion.div

                          animate={{
                            width: `${progress}%`,
                          }}

                          className="
                            h-full
                            bg-gradient-to-r
                            from-violet-600
                            to-indigo-500
                          "
                        />

                      </div>

                      {/* QUESTION */}
                      <h3
                        className={`
                          text-xl
                          font-bold
                          leading-8
                          ${isDark ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        Q{currentIndex + 1}.{" "}
                        {
                          currentQuestion.question
                        }
                      </h3>

                      {/* OPTIONS */}
                      <div className="mt-6 space-y-3">

                        {currentQuestion.options.map(
                          (option, i) => {

                            const selected =
                              selectedAnswers[currentIndex] ===
                              option;

                            return (

                              <motion.button

                                whileTap={{
                                  scale: 0.98,
                                }}

                                key={i}

                                onClick={() =>
                                  handleSelectAnswer(
                                    option
                                  )
                                }

                                className={`
                                  w-full
                                  text-left
                                  px-5
                                  py-4
                                  rounded-2xl
                                  border
                                  transition-all
                                  font-medium
                                  ${
                                    selected
                                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white border-transparent shadow-xl"
                                      : `${isDark ? 'bg-white/5 border-white/10 hover:border-violet-500' : 'bg-white border-gray-200 hover:border-violet-400'}`
                                  }
                                `}
                              >
                                {option}
                              </motion.button>
                            );
                          }
                        )}

                      </div>

                      {/* BUTTONS */}
                      <div className="flex items-center justify-between mt-7">

                        <button
                          onClick={() =>
                            setCurrentIndex(
                              (prev) =>
                                prev - 1
                            )
                          }

                          disabled={
                            currentIndex === 0
                          }

                          className={`
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            border
                            text-sm
                            font-semibold
                            disabled:opacity-40
                            ${isDark ? 'border-white/10' : 'border-gray-200'}
                          `}
                        >

                          <FaArrowLeft />

                          Prev

                        </button>

                        {isLastQuestion ? (

                          <button
                            onClick={() =>
                              setShowResult(true)
                            }
                            className="
                              px-6
                              py-3
                              rounded-2xl
                              bg-gradient-to-r
                              from-violet-600
                              to-indigo-500
                              text-white
                              font-semibold
                              shadow-xl
                            "
                          >
                            Submit Quiz
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              setCurrentIndex(
                                (prev) =>
                                  prev + 1
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-2
                              px-6
                              py-3
                              rounded-2xl
                              bg-gradient-to-r
                              from-violet-600
                              to-indigo-500
                              text-white
                              font-semibold
                              shadow-xl
                            "
                          >

                            Next

                            <FaArrowRight />

                          </button>
                        )}

                      </div>

                    </div>
                  )}
                </>

              ) : (

                <div
                  className={`
                    rounded-3xl
                    border
                    border-dashed
                    py-14
                    text-center
                    ${isDark ? 'border-white/10' : 'border-gray-300'}
                  `}
                >

                  <h3
                    className={`
                      text-xl
                      font-bold
                      ${isDark ? 'text-white' : 'text-gray-800'}
                    `}
                  >
                    No Quiz Available
                  </h3>

                  <p
                    className={`
                      mt-2
                      text-sm
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    Quiz questions will
                    appear here.
                  </p>

                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
};

export default QuizResult;