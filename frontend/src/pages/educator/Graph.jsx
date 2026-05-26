import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GraphSection from '../../components/dashboard/GraphSection'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'

const Graph = () => {
  const dispatch = useDispatch()
  const { stats } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  return (
    <div className="p-6">
      <GraphSection enrollmentByCourse={stats.enrollmentByCourse} />
    </div>
  )
}

export default Graph
