import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Server } from 'lucide-react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function GetTotalDevices(session: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/devices/count?id=${session.user.id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

const TotalDevicesCard = async() => {
  const session = await getServerSession(authOptions)
  const count = await GetTotalDevices(session)

  return (
    <Card className="rounded-xl">
        <CardHeader>
            <CardTitle>Total Devices</CardTitle>
        </CardHeader>
        <CardContent>
            <div className='flex items-center gap-4'>
              <Server className='h-9 w-9 text-sky-300' />
              <h1 className='text-2xl font-bold'>{count}</h1>
            </div>
        </CardContent>
    </Card>
  )
}

export default TotalDevicesCard