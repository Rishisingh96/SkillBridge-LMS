// src/component/Lecture/LecturePlayer.jsx

import React, {
  useEffect,
  useRef,
} from "react";

import LectureResources from "./LectureResources";
import QuizResult from "./QuizResult";
import Comment from "../../pages/student/Comment";

const LecturePlayer = ({
  lecture,
}) => {

  const videoRef = useRef(null);

  useEffect(() => {

    if (
      !lecture?.video?.fileUrl
    ) return;

    const video =
      videoRef.current;

    // Direct MP4 playback
    video.src = lecture.video.fileUrl;

  }, [lecture]);

  // =========================
  // DISABLE RIGHT CLICK
  // =========================

  const handleContextMenu = (
    e
  ) => {

    e.preventDefault();

  };

  // =========================
  // DISABLE SOME SHORTCUTS
  // =========================

  const handleKeyDown = (e) => {

    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
    }

    // CTRL + S
    if (
      e.ctrlKey &&
      e.key === "s"
    ) {
      e.preventDefault();
    }

    // CTRL + U
    if (
      e.ctrlKey &&
      e.key === "u"
    ) {
      e.preventDefault();
    }

  };

  return (

    <div className="bg-white rounded-[24px] shadow-lg border border-gray-200 overflow-hidden">

      {/* VIDEO */}
      <div
        className="w-full bg-black"
        onContextMenu={
          handleContextMenu
        }
      >

        {lecture?.video?.fileUrl ? (

          <video
            ref={videoRef}

            controls

            autoPlay={false}

            controlsList="
              nodownload
              noplaybackrate
              nofullscreen
            "

            disablePictureInPicture

            onKeyDown={
              handleKeyDown
            }

            className="
              w-full
              h-[250px]
              md:h-[500px]
              bg-black
            "
          />

        ) : (

          <div className="
            h-[400px]
            flex
            items-center
            justify-center
            bg-black
          ">

            <p className="
              text-white
              text-sm
            ">
              Select a lecture to start watching
            </p>

          </div>

        )}

      </div>

      {/* LECTURE INFO */}
      <div className="p-5 md:p-7">

        <div className="
          flex
          items-center
          gap-2
          mb-3
        ">

          <span className="
            bg-black
            text-white
            text-xs
            px-3
            py-1
            rounded-full
          ">
            Lecture
          </span>

          <span className="
            text-sm
            text-gray-500
          ">
            {lecture?.lectureTitle}
          </span>

        </div>

        <h1 className="
          text-2xl
          md:text-3xl
          font-bold
          text-gray-900
          leading-tight
        ">

          {
            lecture?.lectureTitle ||
            "Lecture Title"
          }

        </h1>

        <p className="
          text-gray-600
          leading-7
          mt-4
          text-[15px]
        ">

          {
            lecture?.description ||
            "No description available for this lecture."
          }

        </p>

      </div>

      {/* RESOURCES */}
      <LectureResources
        lecture={lecture}
      />

      {/* QUIZ */}
      <QuizResult
        lectureId={lecture}
      />

      {/* COMMENTS */}
      <div className="
        p-5
        md:p-7
      ">

        <Comment
          lectureId={
            lecture?._id
          }
        />

      </div>

    </div>

  );

};

export default LecturePlayer;