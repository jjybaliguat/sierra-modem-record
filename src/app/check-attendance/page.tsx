'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Attendance, AttendanceStatus } from '@/types/attendance'
import { formatDate } from '@/utils/formatDate'
import { formatDateTime } from '@/utils/formatDateTime'
import { cn } from '@/lib/utils'

export default function AttendancePage() {
  const [employeeCode, setEmployeeCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState<Attendance[] | null>(null)

  const handleCheck = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/check-attendance?id=${employeeCode}`)
        const attendance = await response.json()
         // Remove Sunday records
        const filtered = attendance.filter((record: Attendance) => {
        const day = new Date(record.createdAt).getDay()
        return day !== 0 // 0 = Sunday
        })

        setData(filtered)
    } catch (error) {
        console.log(error)
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Check Attendance</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Employee ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row items-center gap-4">
              <Input
                placeholder="e.g., EMP20231001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">Check</Button>
            </form>
          </CardContent>
        </Card>

        {data && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Attendance Records (last 7 days)</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((attendance, idx) => (
                  <TableRow key={attendance.id} className={cn({
                    'bg-red-500': !attendance.timeIn
                  })}>
                    <TableCell>{formatDate(attendance.createdAt)}</TableCell>
                    <TableCell>{attendance.timeIn? formatDateTime(attendance.timeIn) : "Absent"}</TableCell>
                    <TableCell>{attendance.timeOut ? formatDateTime(attendance.timeOut) : "-----"}</TableCell>
                    <TableCell className={
                      attendance.status === AttendanceStatus.ONTIME? 'text-green-600' :
                      attendance.status === AttendanceStatus.LATE? 'text-yellow-600' :
                      'text-red-600'
                    }>
                      {attendance.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
