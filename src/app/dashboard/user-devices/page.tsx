import { CreateDeviceDialog } from '@/components/dialogs/CreateDeviceDialog'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { EmployeesTable } from '@/components/table/EmployeesTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const UserDevices = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
      <HeaderBreadCrumb />
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Devices & Users</CardTitle>
          <CreateDeviceDialog />
        </CardHeader>
        <CardContent className='w-full'>
            {/* <EmployeesTable /> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDevices