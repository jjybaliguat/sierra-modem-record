"use client"

import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import { PayrollTable } from '@/components/table/PayrollTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const PayrollPage = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle>Payroll</CardTitle>
        <Button asChild>
          <Link href="/dashboard/payroll/create">Create</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <PayrollTable />
      </CardContent>
    </Card>
  )
}

export default PayrollPage