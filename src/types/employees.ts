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
    dailyRate: Number
    hireDate: Date
    tinNumber: string,
    sssNumber: string
    isActive: Boolean
    fingerprintId: Number,
    fingerEnrolled: boolean,
    deviceId: string,
    device: Device
}