import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatsCards from '../../components/dashboard/StatsCards'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'
import { useTheme } from '../../context/ThemeContext'

const Stats = () => {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.dashboard)
  const { isDark } = useTheme()

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <StatsCards stats={stats} />
    </div>
  )
}

export default Stats
