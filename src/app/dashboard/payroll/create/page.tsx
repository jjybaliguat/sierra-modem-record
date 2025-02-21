"use client"

import BackButton from '@/components/buttons/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Employees } from '@/types/employees'
import { formatCurrency } from '@/utils/formatCurrency'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { useReactToPrint } from "react-to-print";
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/DatePicker'
import { getEmployeeAttendanceTotalHours } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { Label } from '@/components/ui/label'

const CreatePayroll = () => {
  const {data: session} = useSession()
  const {data: employees, isLoading} = useSWR(session?.user.id? "getEmployee" : null, getEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(null)
  const contentRef = useRef<HTMLDivElement>(null); 
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: `Payslip-${selectedEmployee?.fullName}`});

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [totalHours, setTotalHours] = useState(0)
  const [regularHours, setRegularHours] = useState(0)
  const [otHours, setOtHours] = useState(0)
  const [basicSalary, setBasicSalary] = useState(0)
  const [otPay, setOtPay] = useState(0)
  const [adjustments, setAdjustments] = useState({
    incentive: 0,
    paidLeave: 0,
    holidayPay: 0,
    others: 0,
  })
  const [grossPay, setGrossPay] = useState(0)
  const [netPay, setNetPay] = useState(0)
  const [deductions, setDeductions] = useState({
    tax: 0,
    sss: 0,
    philHealth: 0,
    pagIbig: 0,
    others: 0
  })
  const [totalDeduction, setTotalDeduction] = useState(0)

  async function getEmployees(){
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee?id=${session?.user.id? session.user.id : ""}`)
      
      const data = await response.json()
      // console.log(data)
      return data
    } catch (error) {
      console.log(error)
      return error
    }
  }

  useEffect(()=>{
    const getEmployeeTotalHours = async () => {
      try {
        if(!session) return null
        const response: any = await getEmployeeAttendanceTotalHours(session?.user.id, selectedEmployee?.id!, startDate, endDate)

      setTotalHours(response.totalHours)
      setRegularHours(response.regularHours)
      setOtHours(response.overtimeHours)
      } catch (error) {
        console.log(error)
      }
    }
    getEmployeeTotalHours()
  }, [startDate, endDate, selectedEmployee])

  useEffect(()=>{
    setBasicSalary(regularHours * (selectedEmployee?.dailyRate! / 8))
    setOtPay(otHours * session?.user?.overtimeRate! * (selectedEmployee?.dailyRate! / 8))
  }, [regularHours, otHours])

  useEffect(()=>{
    let totalAdjustments = 0
    let totalDeductions = 0
    Object.values(adjustments).map((value)=>{
      totalAdjustments += value
    })
    Object.values(deductions).map((deduction)=> {
      totalDeductions += deduction
    })
    setTotalDeduction(totalDeduction)
    setGrossPay((basicSalary+otPay+totalAdjustments))
    setNetPay((basicSalary+otPay+totalAdjustments) - totalDeductions)
  }, [basicSalary, otPay, adjustments, deductions])

  return (
    <>
        <div className='flex flex-col gap-2'>
            <BackButton />
            <Card>
                <CardHeader>
                    <CardTitle>Create Payslip</CardTitle>
                </CardHeader>
                <CardContent>
                {employees && <Select value={selectedEmployee?.id} onValueChange={(value)=>setSelectedEmployee(employees.find((employee: Employees)=>employee.id === value) || null)}>
                  <SelectTrigger
                    className="w-[160px] rounded-lg"
                    aria-label="Select employee"
                  >
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {!isLoading && employees && employees?.map((employee: Employees)=>(
                      <SelectItem key={employee.id} value={employee.id} className="rounded-lg">
                        {employee.fullName.split(" ")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>}
                {/* {selectedEmployee && 
                  <div className='flex flex-col gap-4 border border-neutral-300 dark:border-black p-4 mt-6'>
                    <div className=''>
                      <h1 className='text-3xl md:text-5xl font-medium'>{session?.user.company.name}</h1>

                    </div>
                    <div className='grid md:grid-cols-6 grid-cols-1 gap-2'>
                      <p>Employee Name: <span className='text-primary'>{selectedEmployee.fullName}</span></p>
                      <p>Position: <span className='text-primary'>{selectedEmployee.position}</span></p>
                      <p>Daily Rate: <span className='text-primary'>{formatCurrency(selectedEmployee.dailyRate)}</span></p>
                    </div>
                  </div>
                } */}

                {selectedEmployee && 
                <div>
                <div className='flex flex-col gap-2 mt-4'>
                    <div className='flex items-center gap-2'>
                      <h1>Period Start</h1>
                      <DatePicker date={startDate} onSelect={setStartDate} />
                    </div>
                    <div className='flex items-center gap-2'>
                      <h1>Period End</h1>
                      <DatePicker date={endDate} onSelect={setEndDate} />
                    </div>
                    <div>
                      <div className='grid grid-cols-2 md:flex md:flex-row gap-4 md:items-center'>
                        <h1 className='text-sm'>Hours Worked: <span><Input value={totalHours} type='number' className='w-[100px]' onChange={(e)=> setTotalHours(Number(e.target.value))}/></span></h1>
                        <h1 className='text-sm'>Computed Hours: <span><Input value={regularHours} className='w-[100px]' onChange={(e)=> setRegularHours(Number(e.target.value))}/></span></h1>
                        <h1 className='text-sm'>Overtime Hours: <span><Input value={otHours} className='w-[100px]' onChange={(e)=> setOtHours(Number(e.target.value))}/></span></h1>
                      </div>
                      <div className='mt-4'>
                        <h1 className='mb-2'>Adjustments</h1>
                        <div className='grid grid-cols-2 md:flex md:flex-row gap-4 md:items-center'>
                          <div className='flex flex-col gap-2'>
                            <Label htmlFor='incentive'>Incentive</Label>
                            <Input id="incentive" value={adjustments.incentive} onChange={(e)=>setAdjustments({...adjustments, incentive: Number(e.target.value)})} className='w-[100px]' />
                          </div>
                          <div className='flex flex-col gap-2'>
                            <Label htmlFor='incentive'>Paid Leaves</Label>
                            <Input id="incentive" value={adjustments.paidLeave} onChange={(e)=>setAdjustments({...adjustments, paidLeave: Number(e.target.value)})} className='w-[100px]' />
                          </div>
                          <div className='flex flex-col gap-2'>
                            <Label htmlFor='incentive'>Holiday Pay</Label>
                            <Input id="incentive" value={adjustments.holidayPay} onChange={(e)=>setAdjustments({...adjustments, holidayPay: Number(e.target.value)})} className='w-[100px]' />
                          </div>
                          <div className='flex flex-col gap-2'>
                            <Label htmlFor='incentive'>Others</Label>
                            <Input id="incentive" value={adjustments.others} onChange={(e)=>setAdjustments({...adjustments, others: Number(e.target.value)})} className='w-[100px]' />
                          </div>
                        </div>
                      </div>
                      <div className='mt-4'>
                        <h1>Deductions</h1>
                      </div>
                        {/* <Button variant="outline" size="sm" className='w-[100px]' onClick={()=>setEditableHours(true)}><Pencil className='h-4 w-4' />Edit</Button> */}
                    </div>
                </div>
                <div className='mt-6 overflow-x-auto'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h1 className='text-xl font-semibold'>Preview</h1>
                    <Button onClick={()=>reactToPrintFn()} variant="outline">Print Payslip</Button>
                  </div>
                  <div ref={contentRef} className="w-[800px] p-6 rounded-lg border-2 border-dashed border-gray-500 shadow-md">
                    <h1 className='text-xl md:text-2xl font-semibold'>{session?.user.company.name}</h1>
                    <div className='flex justify-between w-full'>
                      <h4 className="text-[14px] font-semibold mb-4">Employee Payslip</h4>
                      <h4 className="text-[14px] font-semibold mb-4">Period: {formatDate(startDate)} to {formatDate(endDate)}</h4>
                    </div>

                    {/* Employee Information */}
                    <div className="mb-4">
                      <p><span className="text-[14px] font-semibold">Name:</span> {selectedEmployee?.fullName}</p>
                      <p><span className="text-[14px] font-semibold">Position:</span> {selectedEmployee?.position}</p>
                      <p><span className="text-[14px] font-semibold">Department:</span> {selectedEmployee?.department || "NA"}</p>
                    </div>

                    <div className='border-t py-4 border-gray-300 flex gap-8'>
                        {/* Work Hours Breakdown */}
                      <div className="">
                        <h3 className="text-[14px] text-lg font-semibold mb-2">Hours Worked</h3>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Regular Hours: </span>
                          <span> {regularHours}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Overtime Hours: </span>
                          <span> {otHours}</span>
                        </div>
                      </div>

                      {/* Salary Breakdown */}
                      <div className="">
                        <h3 className="text-lg font-semibold mb-2">Earnings</h3>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Basic Salary:</span>
                          <span>{formatCurrency(basicSalary? basicSalary : 0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Overtime Pay:</span>
                          <span>{formatCurrency(otPay? otPay : 0)}</span>
                        </div>
                      </div>
                      {/* Adjustments */}
                      <div className="">
                        <h3 className="text-xl font-semibold mb-2">Adjustments</h3>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Incentive:</span>
                          <span>{formatCurrency(adjustments.incentive)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Paid Leaves:</span>
                          <span>{formatCurrency(adjustments.paidLeave)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Holiday Pay:</span>
                          <span>{formatCurrency(adjustments.holidayPay)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Others:</span>
                          <span>{formatCurrency(adjustments.others)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Breakdown */}
                    <div className="border-t border-gray-300 pt-4 flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-red-500">Deductions</h3>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>SSS:</span>
                          <span>{formatCurrency(deductions.sss)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>PhilHealth:</span>
                          <span>{formatCurrency(deductions.philHealth)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Pag-IBIG:</span>
                          <span>{formatCurrency(deductions.pagIbig)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Tax:</span>
                          <span>{formatCurrency(deductions.tax)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Other Deductions:</span>
                          <span>{formatCurrency(deductions.others)}</span>
                        </div>
                      </div>

                        <div className='flex justify-end'>
                          <div className='flex flex-col gap-2 '>
                          {/* Total Deduction */}
                          <div className="text-[14px] border-t border-gray-300 mt-3 pt-3 flex justify-between font-semibold text-red-600">
                            <span>Total Deductions: </span>
                            <span>{formatCurrency(totalDeduction)}</span>
                          </div>
                          {/* Gross Salary */}
                            <div className="text-[14px] border-t border-gray-300 mt-3 pt-2 flex justify-between font-semibold">
                              <span>Gross Pay:</span>
                              <span>{formatCurrency(grossPay)}</span>
                            </div>
                          {/* Net Salary */}
                            <div className="border-t border-gray-300 pt-2 flex justify-between font-semibol text-lg">
                              <span>Net Pay: </span>
                              <span className='text-green-600'> {formatCurrency(netPay)}</span>
                            </div>
                          </div>
                        </div>
                    </div>


                  </div>
                </div>
                </div>
                } 
                </CardContent>
            </Card>
        </div>
    </>
  )
}

export default CreatePayroll