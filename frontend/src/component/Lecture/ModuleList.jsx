// src/component/Lecture/ModuleList.jsx
import React, { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";

/**
 * Props:
 *  - moduleData       : array of modules (from Redux)
 *  - selectedLecture  : currently selected lecture object
 *  - onSelectLecture  : (lecture) => void
 *  - mode             : "watch" | "preview"
 *    "watch"   → ViewLecture — sab lectures clickable, active = black bg
 *    "preview" → ViewCourse  — sirf isPreviewFree wale clickable, locked icon
 */

const ModuleList = ({
  moduleData,
  selectedLecture,
  onSelectLecture,
  mode = "watch",
}) => {
  const [openModule, setOpenModule] = useState(null);

  const totalLectures =
    moduleData?.reduce((total, m) => total + m.lectures.length, 0) || 0;

  return (
    <div className="bg-white rounded-[24px] border border-gray-200 shadow-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Lectures</h2>
          <p className="text-sm text-gray-500 mt-1">{totalLectures} Lectures</p>
        </div>
        <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl">
          Course
        </div>
      </div>

      {/* Module accordion */}
      <div className="flex flex-col gap-5">
        {moduleData?.map((module, moduleIndex) => (
          <div
            key={module._id}
            className="border rounded-2xl p-4 bg-[#fafafa]"
          >
            {/* Module header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpenModule(openModule === module._id ? null : module._id)
              }
            >
              <div>
                <h2 className="text-lg font-bold text-black">
                  Module {moduleIndex + 1}: {module.title}
                </h2>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
              <span className="text-2xl font-bold">
                {openModule === module._id ? "−" : "+"}
              </span>
            </div>

            {/* Lectures list */}
            {openModule === module._id && (
              <div className="flex flex-col gap-3 mt-4">
                {module.lectures?.map((lecture, lectureIndex) => {
                  const isActive = selectedLecture?._id === lecture?._id;
                  const isLocked = mode === "preview" && !lecture.isPreviewFree;
                  const isFree   = mode === "preview" && lecture.isPreviewFree;

                  return (
                    <button
                      key={lecture._id}
                      disabled={isLocked}
                      onClick={() => !isLocked && onSelectLecture(lecture)}
                      className={`
                        w-full flex items-center justify-between
                        px-4 py-4 rounded-2xl border transition-all duration-300 text-left
                        ${isLocked
                          ? "bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed"
                          : isActive
                          ? "bg-black text-white border-black shadow-lg"
                          : "bg-white border-gray-200 hover:border-black"
                        }
                      `}
                    >
                      {/* Left — icon + title */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-11 h-11 rounded-xl flex items-center justify-center
                            ${isActive ? "bg-white/20" : "bg-gray-100"}
                          `}
                        >
                          {isLocked ? (
                            <MdOutlineLock className="text-[18px] text-gray-400" />
                          ) : (
                            <FaPlayCircle
                              className={`text-[18px] ${isActive ? "text-white" : "text-black"}`}
                            />
                          )}
                        </div>

                        <div>
                          <h3
                            className={`text-[15px] font-semibold
                              ${isActive ? "text-white" : "text-gray-800"}
                            `}
                          >
                            {lecture.lectureTitle}
                          </h3>
                          <p
                            className={`text-xs mt-1
                              ${isActive ? "text-gray-300" : "text-gray-500"}
                            `}
                          >
                            Lecture {lectureIndex + 1}
                          </p>
                        </div>
                      </div>

                      {/* Right — badge */}
                      <span
                        className={`
                          text-xs font-semibold px-3 py-1 rounded-full
                          ${isActive
                            ? "bg-white text-black"
                            : isFree
                            ? "bg-green-100 text-green-700"
                            : isLocked
                            ? "bg-gray-200 text-gray-500"
                            : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {isLocked ? "Locked" : isFree ? "Free" : "Watch"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;