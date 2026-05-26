// utils/calculateProgress.js
export const calculateProgress = (completedLectures, totalLectures) => {
  if (totalLectures === 0) return 0;
  return Math.round((completedLectures / totalLectures) * 100);
};