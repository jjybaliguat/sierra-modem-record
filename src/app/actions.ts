"use server"

import { PrismaClient } from "@prisma/client";


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