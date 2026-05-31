import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
      
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="relative w-16 h-16">

          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>

          <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

        </div>

        {/* Text */}
        <p className="text-slate-600 font-medium animate-pulse">
          Loading...
        </p>

      </div>
      
    </div>
  );
};

export default Loader;