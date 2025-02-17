import { DatePicker } from '@/components/DatePicker'
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog'
import { ConnectDeviceDialog } from '@/components/dialogs/ConnectDeviceDialog'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { EmployeesTable } from '@/components/table/EmployeesTable'
import { MydevicesTable } from '@/components/table/MydevicesTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

const DevicesPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
      <HeaderBreadCrumb />
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Devices</CardTitle>
          <ConnectDeviceDialog />
        </CardHeader>
        <CardContent className='w-full'>
            <MydevicesTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default DevicesPage