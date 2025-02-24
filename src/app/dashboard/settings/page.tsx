"use client"
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'

const hours = ["5", "6", "7", "8", "9", "10"];

const SettingsPage = () => {
    const {data: session} = useSession()
    const [workStartTime, setWorkStartTime] = useState({
        hour: "8",
        minutes: "0"
    })

    useEffect(()=>{
        if(session){
            let workStart : string[] = []
            workStart = session.user.workStartTime.split(":").map(String)
            setWorkStartTime({...workStartTime, hour: workStart[0], minutes: workStart[1]})
        }
    }, [])

    if(!session) return null
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <HeaderBreadCrumb />
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <h1>Work Start Time</h1>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <p>Hour</p>
                                <Select defaultValue={workStartTime.hour}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Hour</SelectLabel>
                                        {hours.map((value)=>(
                                            <SelectItem key={value} value={value}>{value}</SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p>Minutes</p>
                                <Select defaultValue={workStartTime.minutes}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Minutes</SelectLabel>
                                        {Array.from({length: 60}, (_, i)=>(
                                            <SelectItem key={i} value={i.toString()}>{i.toString()}</SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <h1>AM</h1>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                            <h1>Grace Period In Minutes</h1>
                            <div className='flex items-center gap-2'>
                                <Input className='w-[75px]' type='number' value={session?.user.gracePeriodInMinutes} />
                                <h1>Minutes</h1>
                            </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default SettingsPage