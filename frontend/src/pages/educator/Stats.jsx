import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatsCards from '../../components/dashboard/StatsCards'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'

const Stats = () => {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  return (
    <div className="p-6">
      <StatsCards stats={stats} />
    </div>
  )
}

export default Stats
