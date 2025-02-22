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

const CashAdvancePage = async() => {
  const session: any = await getServerSession(authOptions)
  return (
    <Card>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle>Cash Advance</CardTitle>
        <CreateCashAdvanceDialog />
      </CardHeader>
      <CardContent>
        <CashAdvanceTable userId={session.user.id} />
      </CardContent>
    </Card>
  )
}

export default CashAdvancePage