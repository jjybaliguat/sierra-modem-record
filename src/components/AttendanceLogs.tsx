"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AttendanceLogsTable } from './table/AttendanceLogsTable'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const AttendanceLogs = () => {
  const {data: session} = useSession()
  const userId = session?.user.id
  const {data: attLogs, isLoading} = useSWR(userId? "getAttendanceLogs" : null, GetAttendanceLogs)

  async function GetAttendanceLogs(){
      if(!userId) return null
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/attendance?id=${userId}&limit=20`) 
        const data = await response.json()
        
        // console.log(data)
        return data
      } catch (error) {
        console.log(error)
        return null
      }
    }
 
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-xl'>Attendance Logs</CardTitle>
            <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {(isLoading || !attLogs)? <h1>Loading...</h1> : (
            <AttendanceLogsTable attLogs={attLogs} />
          )}
        </CardContent>
    </Card>
  )
}

export default AttendanceLogs