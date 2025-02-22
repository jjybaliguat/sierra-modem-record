import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AttendanceLogsTable } from './table/AttendanceLogsTable'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function GetAttendanceLogs(id: string){
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/attendance?id=${id}&limit=20`) 
    const data = await response.json()
    
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

const AttendanceLogs = async() => {
  const session: any = await getServerSession(authOptions)
    const attLogs: any = await GetAttendanceLogs(session.user.id)
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-xl'>Attendance Logs</CardTitle>
            <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
            <AttendanceLogsTable attLogs={attLogs} />
        </CardContent>
    </Card>
  )
}

export default AttendanceLogs