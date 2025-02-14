import { CreateDeviceDialog } from '@/components/dialogs/CreateDeviceDialog'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { DevicesTable } from '@/components/table/DevicesTable'
import { EmployeesTable } from '@/components/table/EmployeesTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

async function getDevices(id: string){
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/devices?id=${id}`)
    const data = await response.json()
    // console.log(data)

    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

const UserDevices = async() => {
  const session: any = await getServerSession(authOptions)
  const devices = await getDevices(session.user.id)
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
      <HeaderBreadCrumb />
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Devices & Users</CardTitle>
          <CreateDeviceDialog />
        </CardHeader>
        <CardContent className='w-full'>
            <DevicesTable devices={devices} />
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDevices