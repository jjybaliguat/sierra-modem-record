"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import * as React from 'react'
import { useState, useEffect } from "react"
import useSWR, { mutate } from "swr"
import { useSession } from "next-auth/react"
import { Employees } from "@/types/employees"
import { getEmployeeAttendancePerWeek } from "@/app/actions"
import { Skeleton } from "../ui/skeleton"
import WeeklyAttendanceChartSkeleton from "../skeletons/WeeklyAttendanceChartSkeleton"

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type Props = {
    className: string
  }

export function EmployeeWeeklyAttendanceChart(props: Props) {
  const {data: session} = useSession()
  const {data: employees, isLoading} = useSWR("getEmployees", getEmployees)
    const [chartData, setChartData] = useState<any>(null)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
    const [weekIndex, setWeekIndex] = useState('0')
    const [totalHours, setTotalHours] = useState(0)
    const [totalRegularHours, setTotalRegularHours] = useState(0)
    const [overtimeHours, setOverTimeHours] = useState(0)
    
    async function getEmployeeWeeklyHours(){
      try {
        const response = await getEmployeeAttendancePerWeek(session?.user.id, selectedEmployeeId, Number(weekIndex))
        console.log(response)
        
        setChartData(response?.weeklyHours?.map((value: number, index: number)=>({
          day: daysOfweeks[index],
          hours: value
        })))
        let total = 0;
        response?.weeklyHours?.map((value: number)=>{
          total += value
        })
        setTotalHours(total)
        setTotalRegularHours(response?.regularHours!)
        setOverTimeHours(response?.overtimeHours!)

      } catch (error) {
        console.log(error)
        return null
      }
    }
    
    const daysOfweeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    
    useEffect(()=>{
      mutate("getEmployees")
    }, [session])

    useEffect(()=> {
      getEmployeeWeeklyHours()
    }, [selectedEmployeeId, weekIndex])
    
    useEffect(()=> {
      employees && setSelectedEmployeeId(employees[0]?.id)
    }, [employees])
    
    async function getEmployees(){
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee?id=${session?.user.id? session.user.id : ""}`)
        
        const data = await response.json()
        console.log(data)
        return data
      } catch (error) {
        console.log(error)
        return error
      }
    }
    
  if (!session || !session.user?.id || !employees) return <WeeklyAttendanceChartSkeleton />
  return (
    <Card className={props.className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>
            Showing employee attendance per week
          </CardDescription>
        </div>
        <Select defaultValue={selectedEmployeeId} value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select employee"
          >
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {!isLoading && employees && employees?.map((employee: Employees)=>(
              <SelectItem key={employee.id} value={employee.id} className="rounded-lg">
                {employee.fullName.split(" ")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={weekIndex} onValueChange={setWeekIndex}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value='0' className="rounded-lg">
              This week
            </SelectItem>
            <SelectItem value='7' className="rounded-lg">
              Last Week
            </SelectItem>
            <SelectItem value='14' className="rounded-lg">
              Last 2 Weeks
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="hours" fill="var(--color-hours)" radius={8} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 ">
            <h1><span className="text-neutral-500">Total Hours:</span> <span className="text-primary">{totalHours}</span></h1>
            <h1><span className="text-neutral-500">Regular Hours:</span> <span className="text-primary">{totalRegularHours}</span></h1>
            <h1><span className="text-neutral-500">Overtime Hours:</span> <span className="text-primary">{overtimeHours}</span></h1>
          </div>
          <div className="mt-4">
            <p className="text-neutral-500">Regular hours is the computed hours worked including late deductions.</p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
