import ProfileCard from '@/components/cards/ProfileCard'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import React from 'react'

const ProfilePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
      <HeaderBreadCrumb />
      <ProfileCard />
    </div>
  )
}

export default ProfilePage