"use client"

import React, { useEffect, useState } from 'react'
import { SelectDevice } from '../select/SelectDevice'
import { ToggleBioDeviceMode } from './ToggleBioDeviceMode'
import { Device } from '@/types/device'
import { cn } from '@/lib/utils'
import { enrollEmployeeFinger, getNextFingerPrintId, getSingleEmployee } from '@/app/actions'
import { useSession } from 'next-auth/react'

const ToggleDeviceMode = ({
    devices,
    employeeId,
    fingerId
} : {
    devices: Device[],
    fingerId?: string,
    employeeId: string,
}) => {
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [fetchingEmployee, setFetchingEmployee] = useState(true)
    const [fingerprintId, setFingerPrintId] = useState(fingerId)
    const [fetchingNextFIngerId, setFetchingNextFingerId] = useState(false)
    const [enrollmentMode, setEnrollmentMode] = useState(false)
    const [isSuccessEnrollment, setIsSuccessEnrollment] = useState(false)
    const [sendingEnrollmentRequest, setSendingEnrollmentRequest] = useState(false)
    const session: any = useSession()
    // console.log(fingerprintId)

    useEffect(()=> {
        const getEmployeeAssignedDevice = async () => {
            setFetchingEmployee(true)
            try {
                const employee: any = await getSingleEmployee(employeeId)
                if(employee?.deviceId){
                    setDeviceId(employee.deviceId)
                    setFetchingEmployee(false)
                }
                setFetchingEmployee(false)
            } catch (error) {
                console.log(error)
                setFetchingEmployee(false)
            }
        }
        getEmployeeAssignedDevice()
    }, [])

    async function handleToggleEnrollmentMode(){
       try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/device-mode?deviceId=${deviceId}`, {
            method: "PATCH",
            body: JSON.stringify({fingerId: fingerprintId, isEnrollmentMode: enrollmentMode})
        })

        const data = await response.json()
        // console.log(data)
        if(!data.error){
            if(data.isEnrollmentMode){
                setSendingEnrollmentRequest(true)
                setIsSuccessEnrollment(false)
            }
        }else{
            setSendingEnrollmentRequest(false)
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

    useEffect(()=>{
        if(!deviceId || fingerId !== "null") return
        setFetchingNextFingerId(true)
        const fetchAvailableNextFingerId = async () => {
            try {
                const id: any = await getNextFingerPrintId(session?.data?.user?.id, deviceId)
                setFingerPrintId(id)
                setFetchingNextFingerId(false)
            } catch (error) {
                console.log(error)
                setFetchingNextFingerId(false)
            }
        }
        fetchAvailableNextFingerId()
    }, [deviceId])

    useEffect(() => {
        if(!sendingEnrollmentRequest) return
        const fetchDeviceMode = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/device-mode?deviceId=${deviceId}`); // Change to your Next.js API route
                const data = await response.json();
                // console.log(data)
                if(!data.error){
                    if(!data.isEnrollment && sendingEnrollmentRequest){
                        setSendingEnrollmentRequest(false)
                        setIsSuccessEnrollment(true)
                        setEnrollmentMode(false)
                        enrollEmployeeFinger(employeeId, fingerprintId!, deviceId!)
                    }
                }else{
                }
              } catch (error) {
                console.error("Error fetching data:", error);
              }
        };
    
        fetchDeviceMode(); // Initial call
        const interval = setInterval(fetchDeviceMode, 5000); // Call every 3 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, [sendingEnrollmentRequest]);

  return (
    <div className='flex flex-col gap-8'>
        {!fetchingEmployee && <SelectDevice selected={deviceId} devices={devices} setDeviceId={setDeviceId}/> }
        <h1>Fingerprint Id: <span>{fetchingNextFIngerId? "..." : fingerprintId}</span></h1>
        <ToggleBioDeviceMode disabled={(deviceId && fingerprintId !== "null")? false : true} checked={enrollmentMode} onChange={setEnrollmentMode}  />
        {enrollmentMode && <h1>Status: <span className={cn({
            'p-2 rounded-lg': true,
            'bg-gray-500': !isSuccessEnrollment,
            'bg-green-500': isSuccessEnrollment
        })}>{isSuccessEnrollment? "Success" : "Waiting..."}</span></h1>}
    </div>
  )
}

export default ToggleDeviceMode