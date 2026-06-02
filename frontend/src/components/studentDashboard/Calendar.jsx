import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = today.getDay();
  const currentDate = today.getDate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="text-violet-600" size={18} />
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Schedule</h2>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-lg border-l-4 border-violet-500">
          <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">React Live Session</p>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">Today, 3:00 PM</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">Node.js Assignment Due</p>
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">Tomorrow, 11:59 PM</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
