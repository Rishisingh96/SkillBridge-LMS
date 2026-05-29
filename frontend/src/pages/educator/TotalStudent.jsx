import React from 'react'
import TotalStudetn from '../../components/dashboard/TotalStudetn'
import { useTheme } from '../../context/ThemeContext'

const TotalStudent = () => {
  const { isDark } = useTheme()

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <TotalStudetn />
    </div>
  )
}

export default TotalStudent
