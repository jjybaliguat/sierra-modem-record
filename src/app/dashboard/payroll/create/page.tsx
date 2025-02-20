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

const CreatePayroll = () => {
  const {data: session} = useSession()
  const {data: employees, isLoading} = useSWR(session?.user.id? "getEmployee" : null, getEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(null)
  const contentRef = useRef<HTMLDivElement>(null); 
  const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: `Payslip-${selectedEmployee?.fullName}`});

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

  // Sample Salary Breakdown
  const salary = {
    basic: 50000,     // Basic Salary
    allowance: 10000, // Allowance
    deductions: 5000, // Deductions (e.g., tax, SSS, Pag-IBIG, PhilHealth)
  };

  const totalEarnings = salary.basic + salary.allowance;
  const netSalary = totalEarnings - salary.deductions;
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
                <div className='mt-6 overflow-x-auto'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h1 className='text-xl font-semibold'>Preview</h1>
                    <Button onClick={()=>reactToPrintFn()} variant="outline">Print Payslip</Button>
                  </div>
                  <div ref={contentRef} className="w-[800px] p-6 rounded-lg border-2 border-dashed border-gray-500 shadow-md">
                    <h1 className='text-xl md:text-2xl font-semibold'>{session?.user.company.name}</h1>
                    <div className='flex justify-between w-full'>
                      <h4 className="text-[14px] font-semibold mb-4">Employee Payslip</h4>
                      <h4 className="text-[14px] font-semibold mb-4">Period: </h4>
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
                        <div className="text-[14px] flex justify-between">
                          <span>Regular Hours:</span>
                          <span>0 hrs</span>
                        </div>
                        <div className="text-[14px] flex justify-between">
                          <span>Overtime Hours: </span>
                          <span> 0 hrs</span>
                        </div>
                      </div>

                      {/* Salary Breakdown */}
                      <div className="">
                        <h3 className="text-lg font-semibold mb-2">Earnings</h3>
                        <div className="text-[14px] flex justify-between">
                          <span>Basic Salary:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex justify-between">
                          <span>Overtime Pay:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                      </div>
                      {/* Adjustments */}
                      <div className="">
                        <h3 className="text-lg font-semibold mb-2">Adjustments</h3>
                        <div className="text-[14px] flex justify-between">
                          <span>Incentive:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex justify-between">
                          <span>Paid Leaves:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex justify-between">
                          <span>Holiday Pay:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Others:</span>
                          <span>{formatCurrency(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Breakdown */}
                    <div className="border-t border-gray-300 pt-4 flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-red-500">Deductions</h3>
                        <div className="text-[14px] flex">
                          <span>With Tax:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>SSS:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>PhilHealth:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Pag-IBIG:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Tax:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                        <div className="text-[14px] flex items-center gap-2">
                          <span>Other Deductions:</span>
                          <span>-{formatCurrency(0)}</span>
                        </div>
                      </div>

                        <div className='flex justify-end'>
                          <div className='flex flex-col gap-2 '>
                          {/* Total Deduction */}
                          <div className="text-[14px] border-t border-gray-300 mt-3 pt-3 flex justify-between font-semibold text-red-600">
                            <span>Total Deductions: </span>
                            <span>-{formatCurrency(0)}</span>
                          </div>
                          {/* Gross Salary */}
                            <div className="text-[14px] border-t border-gray-300 mt-3 pt-2 flex justify-between font-semibold">
                              <span>Gross Pay:</span>
                              <span>-{formatCurrency(0)}</span>
                            </div>
                          {/* Net Salary */}
                            <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-green-600 text-lg">
                              <span>Net Salary:</span>
                              <span>{formatCurrency(0)}</span>
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