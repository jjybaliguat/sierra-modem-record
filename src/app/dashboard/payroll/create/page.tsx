"use client"

import BackButton from '@/components/buttons/BackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Employees } from '@/types/employees'
import { formatCurrency } from '@/utils/formatCurrency'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/DatePicker'
import { getEmployeeAttendanceTotalHours, getEmployeeLatestPayslip } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/utils/formatDate'
import { Label } from '@/components/ui/label'
import { AttendanceLogsCollapsible } from '@/components/collapsible/AttendaceLogsCollapsible'
import { Attendance } from '@/types/attendance'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const CreatePayroll = () => {
  const {data: session} = useSession()
  const {data: employees, isLoading} = useSWR(session?.user.id? "getEmployee" : null, getEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(null)
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([])

  const [periodStart, setPeriodStart] = useState<Date>(new Date())
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date())
  const [totalHours, setTotalHours] = useState(0)
  const [regularHours, setRegularHours] = useState(0)
  const [otHours, setOtHours] = useState(0)
  const [rdotHours, setRdotHours] = useState(0)
  const [basicSalary, setBasicSalary] = useState(0)
  const [otPay, setOtPay] = useState(0)
  const [adjustments, setAdjustments] = useState({
    incentive: 0,
    paidLeaves: 0,
    holidayPay: 0,
    foodAllowance: 0,
    otherPay: 0,
  })
  const [grossPay, setGrossPay] = useState(0)
  const [netPay, setNetPay] = useState(0)
  const [deductions, setDeductions] = useState({
    taxDeduction: 0,
    sssDeduction: 0,
    philHealthDeduction: 0,
    pagIbigDeduction: 0,
    caDeduction: 0,
    otherDeduction: 0
  })
  const [totalDeduction, setTotalDeduction] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [lastPayslipPeriod, setLastPayslipPeriod] = useState({
    periodStart: "",
    periodEnd: ""
  })
  const router = useRouter()

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
        const response: any = await getEmployeeAttendanceTotalHours(session?.user.id, selectedEmployee?.id!, format(periodStart, "yyyy-MM-dd"), format(periodEnd, "yyyy-MM-dd"))
      setTotalHours(response.totalHours? response.totalHours : 0)
      setRegularHours(response.regularHours? response.regularHours : 0)
      setOtHours(response.overtimeHours? response.overtimeHours : 0)
      setRdotHours(response.rdotHours? response.rdotHours : 0)
      setAttendanceLogs(response.attendanceLogs)
      console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    selectedEmployee && setDeductions({...deductions, caDeduction: selectedEmployee?.cashAdvance[0]?.amount? selectedEmployee?.cashAdvance[0]?.amount : 0})

    async function getEmployeeLastPayslip(){
      try {
        const response = await getEmployeeLatestPayslip(selectedEmployee?.id!)

        setLastPayslipPeriod({
          periodEnd: response?.periodEnd? response.periodEnd : "",
          periodStart: response?.periodStart? response.periodStart : ""
        })
      } catch (error) {
        console.log(error)
      }
    }
    
    getEmployeeTotalHours()
    getEmployeeLastPayslip()
  }, [periodStart, periodEnd, selectedEmployee])

  useEffect(()=>{
    setBasicSalary(regularHours * (selectedEmployee? selectedEmployee?.dailyRate / 8 : 0 / 8))
    session && setOtPay(otHours * session?.user?.overtimeRate! * (selectedEmployee? selectedEmployee?.dailyRate / 8 : 0))
  }, [regularHours, otHours, selectedEmployee])

  useEffect(()=>{
    let totalAdjustments = 0
    let totalDeductions = 0
    Object.values(adjustments).map((value)=>{
      totalAdjustments += value
    })
    Object.values(deductions).map((deduction)=> {
      totalDeductions += deduction
    })
    setTotalDeduction(totalDeductions)
    setGrossPay((basicSalary+otPay+totalAdjustments))
    setNetPay((basicSalary+otPay+totalAdjustments) - totalDeductions)
  }, [basicSalary, otPay, adjustments, deductions])

  async function GeneratePayslip(){
    setSubmitting(true)
    try {
      const response: any = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/payroll`, {
        method: "POST",
        body: JSON.stringify({
          employeeId: selectedEmployee?.id,
          regularHours,
          overtimeHours: otHours,
          basicSalary,
          overtimePay: otPay,
          ...adjustments,
          ...deductions,
          totalDeduction,
          grossPay,
          netPay,
          periodStart: format(periodStart, "yyyy-MM-dd"),
          periodEnd: format(periodEnd, "yyyy-MM-dd")
        })
      })
      const data = await response.json()
      setSubmitting(false)
      router.push(`/dashboard/payroll/${data?.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
        <div className='flex flex-col gap-2'>
            <BackButton />
            <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Create Payslip</CardTitle>
                    <Button disabled={!selectedEmployee || submitting} onClick={GeneratePayslip}>{submitting? "Generating..." : "Generate"}</Button>
                  </div>
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
                    <div>
                    {lastPayslipPeriod.periodStart !== "" && <h1>Last Payslip Period: <span className='text-primary'>{formatDate(lastPayslipPeriod.periodStart)}</span> to <span className='text-primary'>{formatDate(lastPayslipPeriod.periodEnd)}</span></h1>}
                    </div>
                    <div className='flex items-center gap-2'>
                      <h1>Period Start</h1>
                      <DatePicker date={periodStart} onSelect={setPeriodStart} />
                    </div>
                    <div className='flex items-center gap-2'>
                      <h1>Period End</h1>
                      <DatePicker date={periodEnd} onSelect={setPeriodEnd} />
                    </div>
                    <div className='mt-4'>
                      <div className='flex flex-wrap gap-4 md:items-center'>
                        <h1 className='text-sm'>Hours Worked: <span><Input value={totalHours} type='number' step="any" className='w-[100px]' onChange={(e)=> setTotalHours(Number(e.target.value))}/></span></h1>
                        <h1 className='text-sm'>Computed Hours: <span><Input type='number' step="any" value={regularHours} className='w-[100px]' onChange={(e)=> setRegularHours(Number(e.target.value))}/></span></h1>
                        <h1 className='text-sm'>Overtime Hours: <span><Input type='number' step="any" value={otHours} className='w-[100px]' onChange={(e)=> setOtHours(Number(e.target.value))}/></span></h1>
                        <h1 className='text-sm'>RDOT Hours: <span><Input type='number' step="any" value={rdotHours} className='w-[100px]' onChange={(e)=> setRdotHours(Number(e.target.value))}/></span></h1>
                      </div>
                      <div className='mt-4'>
                        <h1 className='mb-2'>Adjustments</h1>
                        <div className='flex flex-wrap gap-4 md:items-center'>
                          {Object.entries(adjustments).map(([key, value])=>(
                            <div key={key} className='flex flex-col gap-2'>
                              <Label htmlFor={`${key}`} className='capitalize'>{key}</Label>
                              <Input type='number' step="any" id={`${key}`} value={value} onChange={(e)=>setAdjustments({...adjustments, [key]: Number(e.target.value)})} className='w-[100px]' />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='mt-4'>
                        <h1 className='mb-2'>Deductions</h1>
                        <div className='flex flex-wrap gap-4 md:items-center'>
                          {Object.entries(deductions).map(([key, value])=>(
                            <div key={key} className='flex flex-col gap-2'>
                              <Label htmlFor={`${key}`} className='capitalize'>{key}</Label>
                              <Input type='number' step="any" id={`${key}`} value={value} onChange={(e)=>setDeductions({...deductions, [key]: Number(e.target.value)})} className='w-[100px]' />
                            </div>
                          ))}
                        </div>
                      </div>
                        {/* <Button variant="outline" size="sm" className='w-[100px]' onClick={()=>setEditableHours(true)}><Pencil className='h-4 w-4' />Edit</Button> */}
                    </div>
                </div>
                <div className='mt-6 overflow-x-auto'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h1 className='text-xl font-semibold'>Preview</h1>
                  </div>
                  <div className="w-[950px] p-6 rounded-lg border-2 border-dashed border-gray-500 shadow-md print-top-left bg-white text-black">
                    <div className='flex justify-between'>
                        <h1 className='text-2xl md:text-2xl font-semibold'>{session?.user.company.name}</h1>
                        <div className="flex gap-2 items-centerfont-semibol text-lg">
                            <span>Status: </span>
                            <span className="text-yellow-500 font-semibold">PENDING</span>
                        </div>
                    </div>
                    <div className='flex justify-between w-full'>
                      <h4 className="text-[14px] font-semibold mb-4">Employee Payslip</h4>
                      <h4 className="text-[14px] font-semibold mb-4">Period: {format(periodStart? periodStart : new Date(), "MMM-dd-yyyy")} to {format(periodEnd? periodEnd : new Date(), "MMM-dd-yyyy")}</h4>
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
                          <span>{formatCurrency(adjustments.paidLeaves)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Holiday Pay:</span>
                          <span>{formatCurrency(adjustments.holidayPay)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Food Allowance:</span>
                          <span>{formatCurrency(adjustments.foodAllowance)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Others:</span>
                          <span>{formatCurrency(adjustments.otherPay)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Breakdown */}
                    <div className="border-t border-gray-300 pt-4 flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-red-500">Deductions</h3>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>SSS:</span>
                          <span>{formatCurrency(deductions.sssDeduction)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>PhilHealth:</span>
                          <span>{formatCurrency(deductions.philHealthDeduction)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Pag-IBIG:</span>
                          <span>{formatCurrency(deductions.pagIbigDeduction)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Tax:</span>
                          <span>{formatCurrency(deductions.taxDeduction)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>CashAdvance:</span>
                          <span>{formatCurrency(deductions.caDeduction)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Other Deductions:</span>
                          <span>{formatCurrency(deductions.otherDeduction)}</span>
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

                <div className='mt-4'>
                  <AttendanceLogsCollapsible attendanceLogs={attendanceLogs} />
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