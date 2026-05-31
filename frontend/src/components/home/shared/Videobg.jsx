import React, { useState, useEffect } from "react";

const Videobg = React.memo(({ children }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Lazy load video after UI renders (2 seconds delay)
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden rounded-[28px]">
      
      {/* Background Gradient Fallback (loads immediately) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      {/* Background Video (lazy loaded from public folder) */}
      {videoLoaded && (
        <video
          src="/lms_bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}

      {/* Dark Overlay (important for text visibility) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* Content on top */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
});

export default Videobg;