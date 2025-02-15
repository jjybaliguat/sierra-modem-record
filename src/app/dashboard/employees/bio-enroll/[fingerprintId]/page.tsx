import BackButton from '@/components/buttons/BackButton'
import { SelectDevice } from '@/components/select/SelectDevice'
import { ToggleBioDeviceMode } from '@/components/toggle/ToggleBioDeviceMode'
import ToggleDeviceMode from '@/components/toggle/ToggleDeviceMode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export const revalidate = 0

async function getDevices(id: string){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/devices?id=${id}`)

        const data = await response.json()

        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

const BiometricEnroll = async({
    params
} : {
    params: Promise<{fingerprintId: string}>
}) => {0
    const session: any = await getServerSession(authOptions)
    console.log(session)
    const fingerprintId = (await params).fingerprintId
    const devices = await getDevices(session.user.id)

  return (
    <>
        <BackButton />
        <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Biometric Enrollment</CardTitle>
            </CardHeader>

            <CardContent>
                <h1>Enroll ID <span className='p-1 rounded-md dark:bg-primary bg-blue-400 px-4'>{fingerprintId}</span> to your biometric device</h1>
                <div className='mt-8'>
                    <ToggleDeviceMode fingerprintId={Number(fingerprintId)} devices={devices} />
                </div>
            </CardContent>
        </Card>
    </>
  )
}

export default BiometricEnroll