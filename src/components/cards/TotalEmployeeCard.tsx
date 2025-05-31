"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users } from 'lucide-react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'

const TotalEmployeeCard = () => {
  const {data: session} = useSession()
  const userId = session?.user.parentId? session?.user.parentId : session?.user.id
  const {data: count, isLoading} = useSWR(userId? "getEmployeeCount" : null, GetTotalEmployees) 

  async function GetTotalEmployees() {
    if(!userId) return null
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee/count?id=${userId}`)
        const data = await response.json()
        return data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <Card className="rounded-xl">
        <CardHeader>
            <CardTitle>Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            <Users className='h-9 w-9 text-emerald-300' />
            <h1 className='text-2xl font-bold'>{(isLoading || !count) ? "..." : count}</h1>
          </div>
        </CardContent>
    </Card>
  )
}

export default TotalEmployeeCard