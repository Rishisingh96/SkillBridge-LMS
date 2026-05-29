import React from 'react'
import CoursePerformanceTable from '../../components/dashboard/CoursePerformanceTable'
import { useTheme } from '../../context/ThemeContext'

const CoursePerformance = () => {
  const { isDark } = useTheme()

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <CoursePerformanceTable />
    </div>
  )
}

export default CoursePerformance
