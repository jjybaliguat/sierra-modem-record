
import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Skeleton } from '../ui/skeleton'

const WeeklyAttendanceChartSkeleton = () => {
  return (
    <Card >
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>
            Showing employee attendance per week
          </CardDescription>
        </div>
        <Skeleton className='p-4 rounded-md w-[150px]' />
        <Skeleton className='p-4 rounded-md w-[150px]' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-[400px] w-full' />
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 ">
            <h1><span className="text-neutral-500">Total Hours:</span> <span className="text-primary"><Skeleton className='h-6 w-6' /></span></h1>
            <h1><span className="text-neutral-500">Regular Hours:</span> <span className="text-primary"><Skeleton className='h-6 w-6' /></span></h1>
            <h1><span className="text-neutral-500">Overtime Hours:</span> <span className="text-primary"><Skeleton className='h-6 w-6' /></span></h1>
          </div>
          <div className="mt-4">
            <p className="text-neutral-500">Regular hours is the computed hours worked including late deductions.</p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}

export default WeeklyAttendanceChartSkeleton