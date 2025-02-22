import { Device } from "./device"

export interface Employees{
    id: string,
    employerId: string,
    empCode: string,
    fullName: string
    email: string
    phone?: string
    department?: string
    position: string
    dailyRate: number
    hireDate: Date
    tinNumber: string,
    sssNumber: string,
    pagIbigNumber: string,
    philHealthNumber: string,
    isActive: Boolean
    fingerprintId: number,
    fingerEnrolled: boolean,
    deviceId: string,
    device: Device,
    cashAdvance: {
        id: string,
        amount: number
    }[]
}