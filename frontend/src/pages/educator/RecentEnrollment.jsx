import React from 'react'
import RecentEnrollments from '../../components/dashboard/RecentEnrollments'
import { useTheme } from '../../context/ThemeContext'

const RecentEnrollment = () => {
  const { isDark } = useTheme()

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <RecentEnrollments />
    </div>
  )
}

export default RecentEnrollment
