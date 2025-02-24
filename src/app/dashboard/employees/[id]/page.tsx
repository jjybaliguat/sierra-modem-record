import React from 'react'
import UpdateEmployeeForm from '@/components/forms/UpdateEmployee'
import { getSingleEmployee } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AttendanceLogsCollapsible } from '@/components/collapsible/AttendaceLogsCollapsible'

export const revalidate = 0;

const EmployeeDetail = async({
    params
} : {
    params: Promise<{id: string}>
}) => {
    const id = (await params).id
    const employee: any = await getSingleEmployee(id)
  return (
    <div className='flex flex-col gap-4'>
      <UpdateEmployeeForm employee={employee} />
      <Card>
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceLogsCollapsible attendanceLogs={employee.attendance} />
        </CardContent>
      </Card>
    </div>
  )
}

export default EmployeeDetail