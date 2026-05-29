import React from "react";
import bg from "../../assets/lms_bg.mp4";

const Videobg = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden rounded-[28px]">
      
      {/* Background Video */}
      <video
        src={bg}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark Overlay (important for text visibility) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* Content on top */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Videobg;