import { User } from "next-auth"

export interface Device {
    id: string
    deviceId: string
    name: string
    user: User
}