import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GraphSection from '../../components/dashboard/GraphSection'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'
import { useTheme } from '../../context/ThemeContext'

const Graph = () => {
  const dispatch = useDispatch()
  const { stats } = useSelector((state) => state.dashboard)
  const { isDark } = useTheme()

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <GraphSection enrollmentByCourse={stats.enrollmentByCourse} />
    </div>
  )
}

export default Graph
