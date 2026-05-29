import React from 'react';
import { Play, BookOpen } from 'lucide-react';

const ContinueLearning = () => {
  const courses = [
    {
      title: 'React JS Masterclass',
      progress: 65,
      lastLesson: 'Hooks Deep Dive',
      image: 'https://via.placeholder.com/150x100/6366f1/ffffff?text=React'
    },
    {
      title: 'Node.js Backend Development',
      progress: 40,
      lastLesson: 'Express Middleware',
      image: 'https://via.placeholder.com/150x100/22c55e/ffffff?text=Node'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <img src={course.image} alt={course.title} className="w-24 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last: {course.lastLesson}</p>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
            <button className="w-10 h-10 bg-violet-600 hover:bg-violet-700 rounded-lg flex items-center justify-center text-white transition-colors">
              <Play size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning
