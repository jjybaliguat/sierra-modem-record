import React from 'react'
import AttendanceLogs from '@/components/AttendanceLogs'
import TotalDevicesCard from '@/components/cards/TotalDevicesCard'
import TotalEmployeeCard from '@/components/cards/TotalEmployeeCard'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { EmployeeWeeklyAttendanceChart } from '@/components/charts/EmployeeWeeklyAttendanceChart'

const Dashboard = async() => {
  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
        <HeaderBreadCrumb />
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {/* <TotalEmployeeCard /> */}
            {/* <TotalDevicesCard /> */}
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* <EmployeeWeeklyAttendanceChart className='' /> */}
          {/* <AttendanceLogs /> */}
        </div>
    </div>
  )
}

export default Dashboard