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
    params: Promise<{id: string, fingerId?: string}>
}) => {0
    const session: any = await getServerSession(authOptions)
    // console.log(session)
    const id = (await params).id
    const fingerId = (await params).fingerId
    const devices = await getDevices(session.user.id)

  return (
    <>
        <BackButton />
        <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Biometric Enrollment</CardTitle>
            </CardHeader>

            <CardContent>
                <h1>Enroll User ID: <span className='p-1 rounded-md dark:bg-primary bg-blue-400 px-4'>{id}</span> to your biometric device</h1>
                <div className='mt-8'>
                    <ToggleDeviceMode employeeId={id} devices={devices} fingerId={fingerId} />
                </div>
            </CardContent>
        </Card>
    </>
  )
}

export default BiometricEnroll