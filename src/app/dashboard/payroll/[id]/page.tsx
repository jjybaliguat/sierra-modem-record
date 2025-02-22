import { getPayrollById } from '@/app/actions'
import BackButton from '@/components/buttons/BackButton'
import PayslipDetailsCard from '@/components/cards/PayslipDetails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

const PayslipDetails = async({
    params
}: {
    params: Promise<{id: string}>
}) => {
    const id = (await params).id
    const payroll: any = await getPayrollById(id)
    const session: any = await getServerSession(authOptions)
    // console.log(payroll)
  return (
    <>
        <div className='flex flex-col gap-2'>
            <BackButton />
            <Card>
                <CardHeader>
                    <CardTitle>Payslip Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PayslipDetailsCard user={session.user} payroll={payroll} />
                </CardContent>
            </Card>

        </div>
    </>
  )
}

export default PayslipDetails