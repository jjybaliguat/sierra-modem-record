import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { CreateCashAdvanceDialog } from '@/components/dialogs/CreateCashAdvanceDialog'
import useSWR from 'swr'
import { getCashAdvance } from '@/app/actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CashAdvanceTable } from '@/components/table/CashAdvanceTable'
import { CashAdvanceBalanceTable } from '@/components/table/CashAdvanceBalanceTable'

const CashAdvancePage = async() => {
  const session: any = await getServerSession(authOptions)
  const userId = session?.user.parentId? session?.user.parentId : session?.user.id
  return (
    <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
      <Card className='col-span-12 md:col-span-8'>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Cash Advance</CardTitle>
          <CreateCashAdvanceDialog />
        </CardHeader>
        <CardContent>
          <CashAdvanceTable userId={userId} />
        </CardContent>
      </Card>
      <Card className='col-span-12 md:col-span-4'>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>CA Balances</CardTitle>
          {/* <CreateCashAdvanceDialog /> */}
        </CardHeader>
        <CardContent>
          <CashAdvanceBalanceTable userId={userId} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CashAdvancePage