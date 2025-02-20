"use client"

import React, { ReactNode } from 'react'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
    {
      title: "Payslip Generate",
      path: "/dashboard/payroll",
    },
    {
      title: "Cash Advance",
      path: "/dashboard/payroll/cash-advance",
    },
  ]

const PayrollLayout = ({children} : {children: ReactNode}) => {
    const pathname = usePathname()
  return (
    <>
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
    <HeaderBreadCrumb />
    <Card className='mt-2 rounded-[50px] w-full flex items-center gap-2'>
      {tabs.map((tab, index)=>(
        <Link key={index} href={tab.path} className={cn({
          "text-[14px] md:text-[16px] p-6": true,
          "border-b-2 border-primary text-primary" : pathname === tab.path,
          "rounded-bl-[38px]": index == 0
        })}>{tab.title}</Link>
      ))}
    </Card>
    {children}
    </div>
    </>
  )
}

export default PayrollLayout