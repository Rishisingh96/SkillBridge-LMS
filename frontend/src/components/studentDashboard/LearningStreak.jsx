import React from 'react';
import { Flame } from 'lucide-react';

const LearningStreak = () => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Flame size={28} />
        <span className="text-sm font-semibold opacity-90">Learning Streak</span>
      </div>
      <h2 className="text-4xl font-bold mb-1">7 Days</h2>
      <p className="text-orange-100 text-sm">Keep it going! You're on fire!</p>
      <div className="flex gap-1 mt-4">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <div
            key={day}
            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-semibold"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningStreak;
