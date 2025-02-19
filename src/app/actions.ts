"use server"

import { Employees } from "@/types/employees";
import { hashPassword } from "@/utils/hashPassword";
import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcryptjs'
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";


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
    // console.log(id)
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id
            },
            include: {
                device: true
            }
        })

        // console.log(employee)

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

export async function getEmployeeAttendancePerWeek(employeeId: string | null | undefined, week: number){
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    const startOfRequestedWeek = startOfWeek(subWeeks(today, week), { weekStartsOn: 1 });
    const endOfRequestedWeek = endOfWeek(subWeeks(today, week), { weekStartsOn: 1 });

    if(!employeeId) return null

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                employeeId,
                timeIn: {gte: startOfRequestedWeek},
                timeOut: {lte: endOfRequestedWeek}
            },
            select: {
                timeIn: true,
                timeOut: true
            }
        })

        // console.log(attendance)

        const weeklyHours = Array(7).fill(0);

                // Process attendance data
        attendance.forEach((record) => {
            if (!record.timeIn || !record.timeOut) return; // Skip if incomplete data

            const timeIn = new Date(new Date(record.timeIn).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            console.log(timeIn)
            const timeOut = new Date(new Date(record.timeOut).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            console.log(timeOut)
            const dayIndex = timeIn.getDay() - 1; // Convert Monday(1) → 0, Sunday(0) → -1
            if (dayIndex >= 0) {
                let hoursWorked = (timeOut.getTime() - timeIn.getTime()) / 3600000; // Convert ms → hours

                // Define lunch break time (12:00 PM - 1:00 PM)
                const lunchStart = new Date(timeIn);
                lunchStart.setHours(12, 0, 0, 0);
                const lunchEnd = new Date(timeIn);
                lunchEnd.setHours(13, 0, 0, 0);

                // Deduct 1 hour if work session overlaps with lunch break
                if (timeIn < lunchEnd && timeOut > lunchStart) {
                    hoursWorked -= 1;
                }

                weeklyHours[dayIndex] += Math.max(hoursWorked, 0); // Prevent negative values
                        }
                    });

        console.log(weeklyHours.map((hours) => parseFloat(hours.toFixed(2))))
    } catch (error) {
        console.log(error)
    }
}