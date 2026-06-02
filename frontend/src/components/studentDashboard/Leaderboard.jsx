import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const leaders = [
    { name: 'Rishi Singh', points: 1250, rank: 1, icon: Trophy },
    { name: 'Shivam Dubey', points: 980, rank: 2, icon: Medal },
    { name: 'Aswarya shinah', points: 875, rank: 3, icon: Award },
    { name: 'You', points: 720, rank: 4, icon: null },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Leaderboard</h2>
      <div className="space-y-3">
        {leaders.map((leader, index) => {
          const Icon = leader.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg ${
                leader.name === 'You'
                  ? 'bg-violet-100 dark:bg-violet-900/30 border-2 border-violet-500'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                {Icon ? <Icon className={leader.rank === 1 ? 'text-yellow-500' : leader.rank === 2 ? 'text-gray-400' : 'text-amber-600'} size={16} md:size={20} /> : <span className="font-bold text-gray-500 dark:text-gray-400 text-xs md:text-sm">{leader.rank}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-xs md:text-sm truncate ${leader.name === 'You' ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}`}>{leader.name}</p>
              </div>
              <span className={`font-bold text-xs md:text-sm ${leader.name === 'You' ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}`}>{leader.points} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard
