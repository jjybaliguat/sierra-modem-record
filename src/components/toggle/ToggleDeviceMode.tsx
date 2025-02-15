"use client"

import React, { useEffect, useState } from 'react'
import { SelectDevice } from '../select/SelectDevice'
import { ToggleBioDeviceMode } from './ToggleBioDeviceMode'
import { Device } from '@/types/device'
import { cn } from '@/lib/utils'

const ToggleDeviceMode = ({
    devices,
    fingerprintId
} : {
    devices: Device[],
    fingerprintId: Number
}) => {
    const [deviceId, setDeviceId] = useState(null)
    const [enrollmentMode, setEnrollmentMode] = useState(false)
    const [isSuccessEnrollment, setIsSuccessEnrollment] = useState(false)


    async function handleToggleEnrollmentMode(){
       try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/device-mode?deviceId=${deviceId}`, {
            method: "POST",
            body: JSON.stringify({fingerId: fingerprintId, isEnrollmentMode: enrollmentMode})
        })

        const data = await response.json()
        // console.log(data)
        if(!data.error){
            // alert("ok")
            if(data.isEnrollmentMode){
                setIsSuccessEnrollment(true)
            }else{
                setIsSuccessEnrollment(false)
            }
        }else{
            setIsSuccessEnrollment(false)
            // alert(data.error)
        }
       } catch (error) {
            console.log(error)
       }
    }

    useEffect(()=> {
        if(deviceId){
            handleToggleEnrollmentMode()
        }
    }, [enrollmentMode])

  return (
    <div className='flex flex-col gap-8'>
        <SelectDevice devices={devices} setDeviceId={setDeviceId}/>
        <ToggleBioDeviceMode disabled={deviceId? false : true} onChange={setEnrollmentMode}  />
        <h1>Status: <span className={cn({
            'p-2 rounded-lg': true,
            'bg-gray-500': !isSuccessEnrollment,
            'bg-green-500': isSuccessEnrollment
        })}>{isSuccessEnrollment? "Success" : "Waiting..."}</span></h1>
    </div>
  )
}

export default ToggleDeviceMode