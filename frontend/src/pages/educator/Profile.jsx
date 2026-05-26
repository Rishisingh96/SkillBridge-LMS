import React from 'react'
import { useSelector } from 'react-redux'
import ProfileCard from '../../components/dashboard/ProfileCard'

const Profile = () => {
  const { userData } = useSelector((state) => state.user)

  return (
    <div className="p-6">
      <ProfileCard userData={userData} />
    </div>
  )
}

export default Profile
