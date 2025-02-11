import React from 'react'
import AttendanceLogs from '@/components/AttendanceLogs'
import TotalDevicesCard from '@/components/cards/TotalDevicesCard'
import TotalEmployeeCard from '@/components/cards/TotalEmployeeCard'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'

const Dashboard = async() => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <HeaderBreadCrumb />
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <TotalEmployeeCard />
            <TotalDevicesCard />
        </div>
        <AttendanceLogs />
    </div>
  )
}

export default Dashboard