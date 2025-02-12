"use client"

import React, { useEffect, useState } from 'react'
import { SelectDevice } from '../select/SelectDevice'
import { ToggleBioDeviceMode } from './ToggleBioDeviceMode'
import { Device } from '@/types/device'

const ToggleDeviceMode = ({
    devices
} : {
    devices: Device[]
}) => {
    const [deviceId, setDeviceId] = useState(null)
    const [enrollmentMode, setEnrollmentMode] = useState(false)


    async function handleToggleEnrollmentMode(){
       
    }

    useEffect(()=> {
        handleToggleEnrollmentMode()
    }, [enrollmentMode, deviceId])

  return (
    <div className='flex flex-col gap-4'>
        <SelectDevice devices={devices} setDeviceId={setDeviceId}/>
        <ToggleBioDeviceMode disabled={deviceId? false : true} onChange={setEnrollmentMode}  />
    </div>
  )
}

export default ToggleDeviceMode