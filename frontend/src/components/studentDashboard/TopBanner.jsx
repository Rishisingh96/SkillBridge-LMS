import React from 'react';
import { Sparkles } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles size={24} />
        <span className="text-sm font-semibold opacity-90">Welcome back!</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Ready to continue learning?</h1>
      <p className="text-violet-100">You have 2 courses in progress. Keep up the great work!</p>
    </div>
  );
};

export default TopBanner
