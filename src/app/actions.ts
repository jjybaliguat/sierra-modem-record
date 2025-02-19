"use server"

import { hashPassword } from "@/utils/hashPassword";
import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcryptjs'


const prisma = new PrismaClient()

export async function getNextFingerPrintId(employerId: string, deviceId: string): Promise<number | null> {
    const lastEmployee = await prisma.employee.findFirst({
        where: { employerId, deviceId }, // Filter by employer
        orderBy: { fingerprintId: "desc" }, // Get the highest fingerprintId
        select: { fingerprintId: true }, // Only retrieve fingerprintId
      });

      return (lastEmployee?.fingerprintId ?? 0) + 1;
}

export async function getSingleEmployee(id: string){
    console.log(id)
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id
            },
            include: {
                device: true
            }
        })

        console.log(employee)

        return employee
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function enrollEmployeeFinger(employeeId: string, fingerId: string, deviceId: string){
    try {
        await prisma.employee.update({
            where: {
                id: employeeId
            },
            data: {
                fingerprintId: Number(fingerId),
                deviceId: deviceId,
                fingerEnrolled: true
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export async function changePassword(data: {id: string | undefined, oldPassword: string, password: string}) {
    try {
        const user: any = await prisma.user.findUnique({
            where: {
                id: data.id
            },
            select: {
                password: true
            }
        })

        if(!user){
            return {error: `User with id ${data.id}  not found.`}
        }
        
        const isPasswordMatched = await bcrypt.compare(data.oldPassword, user.password)

        if(!isPasswordMatched){
            return {error: "Old Password not matched."}
        }

        const hashedPass: any = await hashPassword(data.password)
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                password: hashedPass
            }
        })

        return {message: "Password Updated Successfully."}
    } catch (error) {
        console.log(error)
        return {error: "Internal Server Error"}
    }
}