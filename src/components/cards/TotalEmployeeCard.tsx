import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = 0;

async function GetTotalEmployees(session: any) {
    try {
      if(session.user){
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee/count?id=${session.user.id}`)
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

const TotalEmployeeCard = async() => {
  const session = await getServerSession(authOptions)
  const count = await GetTotalEmployees(session)

  return (
    <Card className="rounded-xl">
        <CardHeader>
            <CardTitle>Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            <Users className='h-9 w-9 text-emerald-300' />
            <h1 className='text-2xl font-bold'>{count}</h1>
          </div>
        </CardContent>
    </Card>
  )
}

export default TotalEmployeeCard