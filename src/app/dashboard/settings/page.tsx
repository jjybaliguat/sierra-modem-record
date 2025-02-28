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
import { Button } from '@/components/ui/button'

const hoursStart = [5, 6, 7, 8, 9, 10];
const hoursEnd = [3, 4, 5, 6, 7, 8];

const SettingsPage = () => {
    const {data: session} = useSession()
    const [workStartTime, setWorkStartTime] = useState({
        hour: 8,
        minutes: 0
    })
    const [workEndTime, setWorkEndTime] = useState({
        hour: 17,
        minutes: 0
    })
    const [gracePeriod, setGracePeriod] = useState(0)
    const [lateDeduction, setLateDeduction] = useState(0)
    const [minutesThresholdAfterLate, setMinutesThresholdAfterLate] = useState(0)
    const [overtimeRate, setOvertimeRate] = useState("")

    useEffect(()=>{
        if(session){
            let workStart : number[] = []
            let workEnd : number[] = []
            setGracePeriod(session.user.gracePeriodInMinutes)
            setMinutesThresholdAfterLate(session.user.minutesThresholdAfterLate)
            setLateDeduction(session.user.lateDeducInMinutes)
            setOvertimeRate((session.user.overtimeRate).toString())
            workStart = session.user.workStartTime.split(":").map(Number)
            workEnd = session.user.workEndTime.split(":").map(Number)
            setWorkStartTime({...workStartTime, hour: workStart[0], minutes: workStart[1]})
            setWorkEndTime({...workEndTime, hour: workEnd[0], minutes: workEnd[1]})
        }
    }, [])

    const handleSubmit = async() => {
        try {
            
        } catch (error) {
            
        }
    }

    if(!session) return null
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <HeaderBreadCrumb />
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>Settings</CardTitle>
                    <Button>Update</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-6'>
                    {/* Work Start Time */}
                    <div className='flex flex-col gap-2'>
                        <h1>Work Start Time</h1>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <p>Hour</p>
                                <Select defaultValue={workStartTime.hour.toString()} onValueChange={(value)=>setWorkStartTime({...workStartTime, hour: Number(value)})}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Hour</SelectLabel>
                                        {hoursStart.map((value)=>(
                                            <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p>Minutes</p>
                                <Select defaultValue={workStartTime.minutes.toString()} onValueChange={(value)=>setWorkStartTime({...workStartTime, minutes: Number(value)})}>
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
                    {/* End of Work Start Time */}
                    {/* Work End Time */}
                    <div className='flex flex-col gap-2'>
                        <h1>Work End Time</h1>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <p>Hour</p>
                                <Select defaultValue={workEndTime.hour.toString()} onValueChange={(value)=>setWorkStartTime({...workEndTime, hour: Number(value)})}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Hour</SelectLabel>
                                        {hoursEnd.map((value)=>(
                                            <SelectItem key={value+12} value={(value+12).toString()}>{value}</SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p>Minutes</p>
                                <Select defaultValue={workEndTime.minutes.toString()} onValueChange={(value)=>setWorkStartTime({...workEndTime, minutes: Number(value)})}>
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
                            <h1>PM</h1>
                        </div>
                    </div>
                    {/* End of Work End Time */}
                    <div className='flex flex-col gap-2'>
                            <h1>Grace Period In Minutes</h1>
                            <div className='flex items-center gap-2'>
                                <Input className='w-[75px]' type='number' value={gracePeriod} onChange={(e)=>setGracePeriod(Number(e.target.value))} />
                                <h1>Minutes</h1>
                            </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                            <h1>Late Deduction in Minutes</h1>
                            <p className='text-[12px]'>Late deduction in minutes will be deducted to employee&apos;s total hours if his/her time-in is above the time-in grace period.</p>
                            <div className='flex items-center gap-2'>
                                <Input className='w-[75px]' type='number' value={lateDeduction} onChange={(e)=>setLateDeduction(Number(e.target.value))} />
                                <h1>Minutes</h1>
                            </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                            <h1>Minutes Threshold after late</h1>
                            <div className='flex items-center gap-2'>
                                <Input className='w-[75px]' type='number' value={minutesThresholdAfterLate} onChange={(e)=>setMinutesThresholdAfterLate(Number(e.target.value))} />
                                <h1>Minutes</h1>
                            </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                            <h1>Overtime Rate</h1>
                            <div className='flex items-center gap-2'>
                                <Input className='w-[75px]' type='text' value={overtimeRate} onChange={(e)=>setOvertimeRate(e.target.value)} />
                                <h1>Percent</h1>
                            </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default SettingsPage