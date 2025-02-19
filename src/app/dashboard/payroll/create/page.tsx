import BackButton from '@/components/buttons/BackButton'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const CreatePayroll = () => {
  return (
    <>
        <div className='flex flex-col gap-2'>
            <BackButton />
            <Card>
                <CardHeader>
                    <CardTitle>Create Payslip</CardTitle>
                </CardHeader>
            </Card>
        </div>
    </>
  )
}

export default CreatePayroll