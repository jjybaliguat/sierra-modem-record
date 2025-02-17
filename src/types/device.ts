import { User } from "next-auth"
import { Employees } from "./employees"

export interface Device {
    id: string
    deviceId: string
    name: string
    user: User,
    employees: Employees[]
}