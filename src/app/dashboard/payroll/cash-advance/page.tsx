import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const CashAdvancePage = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle>Cash Advance</CardTitle>
        <Button asChild>
          <Link href="/dashboard/payroll/cash-advance/create">Create</Link>
        </Button>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  )
}

export default CashAdvancePage