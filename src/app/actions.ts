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
      prisma.$disconnect()

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

export async function getEmployeeAttendancePerWeek(employeerId: string | null | undefined, employeeId: string | null | undefined, week: number){
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    const startOfRequestedWeek = startOfWeek(subWeeks(today, week), { weekStartsOn: 1 });
    const endOfRequestedWeek = endOfWeek(subWeeks(today, week), { weekStartsOn: 1 });

    if(!employeeId || !employeerId) return null

    try {
        const employer = await prisma.user.findUnique({
            where: {
                id: employeerId
            },
            select: {
                workStartTime: true,
                workEndTime: true,
                gracePeriodInMinutes: true,
                lateDeducInMinutes: true,
                minutesThresholdAfterLate: true,
                overtimeThresholdInMinutes: true
            }
        })
        // console.log(employer)
        if(!employer) return null
        const timeParts: number[] | undefined = employer?.workStartTime?.split(":").map(Number);
        const timeEndParts: number[] | undefined = employer?.workEndTime?.split(":").map(Number);
        if(!timeParts) return null
        if(!timeEndParts) return null
        // Create a new Date object with the correct time, forcing UTC
        const workStartTime: Date = today;
        workStartTime.setUTCHours(timeParts[0], timeParts[1], 0, 0); // Ensure it's in UTC
        workStartTime.setUTCSeconds(0)
        const workEndTime: Date = new Date(today);
        workEndTime.setUTCHours(timeEndParts[0], timeEndParts[1], 0, 0); // Ensure it's in UTC
        workEndTime.setUTCSeconds(0)

        const workGracePeriodTime = new Date(workStartTime)
        const workGracePeriodThresholdTime = new Date(workStartTime)
        workGracePeriodTime.setUTCMinutes(workGracePeriodTime.getMinutes() + employer?.gracePeriodInMinutes!)
        workGracePeriodTime.setUTCSeconds(0)
        workGracePeriodThresholdTime.setUTCMinutes(employer?.minutesThresholdAfterLate!)
        workGracePeriodThresholdTime.setUTCSeconds(0)
        const overTimeThresholdTime = new Date(workEndTime)
        overTimeThresholdTime.setUTCMinutes(overTimeThresholdTime.getMinutes() + employer?.overtimeThresholdInMinutes!)
        overTimeThresholdTime.setUTCSeconds(0)

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

        console.log(attendance)

        const weeklyHours = Array(7).fill(0);
        let regularHours = 0
        let overtimeHours = 0;

                // Process attendance data
        attendance.forEach((record) => {
            if (!record.timeIn || !record.timeOut) return null; // Skip if incomplete data

            let timeIn = new Date(new Date(record.timeIn).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            const timeOut = new Date(new Date(record.timeOut).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            // console.log(timeOut)
            const dayIndex = timeIn.getDay() - 1; // Convert Monday(1) → 0, Sunday(0) → -1
            if (dayIndex >= 0) {
                let deductionHours = 0;
                let timeInHours = timeIn.getUTCHours() + (timeIn.getUTCMinutes() / 60)
                let timeOutHours = timeOut.getUTCHours() + (timeOut.getUTCMinutes() / 60)
                let workStartHours = workStartTime.getUTCHours() + (workStartTime.getUTCMinutes() / 60)
                let workEndHours = workEndTime.getUTCHours() + (workEndTime.getUTCMinutes() / 60)
                const overtimeThresholdHours = workEndHours + (employer?.overtimeThresholdInMinutes! / 60)
                let thresholdAfterLateTime = workGracePeriodThresholdTime.getUTCHours() + (workGracePeriodThresholdTime.getUTCMinutes() / 60)
                let gracePeriodInMinutesTime = workGracePeriodTime.getUTCHours() + (workGracePeriodTime.getUTCMinutes() / 60)
                let overtimeThresholdInHours = overTimeThresholdTime.getUTCHours() + (overTimeThresholdTime.getUTCMinutes() / 60)

                
                // console.log(overtimeThreshold)
                if (timeInHours <= gracePeriodInMinutesTime) {
                    deductionHours = 0
                }else if(timeInHours > gracePeriodInMinutesTime && timeInHours <= thresholdAfterLateTime){
                    deductionHours = Math.max(employer?.lateDeducInMinutes! / 60, 0);
                }else if(timeInHours > thresholdAfterLateTime && timeInHours <= (workStartHours + 1)){
                    deductionHours = 1;
                }else{
                    deductionHours = (timeInHours - workStartHours)
                }

                let hoursWorked = 0; // Convert ms → hours
                let regularHoursWorked = 0; // Convert ms → hours
                
                // Define lunch break time (12:00 PM - 1:00 PM)
                const lunchStart = new Date(timeIn);
                lunchStart.setUTCHours(12, 0, 0, 0);
                const lunchStartHours = lunchStart.getUTCHours() + (lunchStart.getUTCMinutes() / 60)
                const lunchEnd = new Date(timeIn);
                lunchEnd.setUTCHours(13, 0, 0, 0);
                const lunchEndHours = lunchEnd.getUTCHours() + (lunchEnd.getUTCMinutes() / 60)
          
                // Deduct 1 hour if lunch is included in the work period
                // console.log(timeOutHours)
                if(timeOutHours >= overtimeThresholdHours){
                    overtimeHours += 1;
                    hoursWorked = (timeOutHours - workStartHours) - deductionHours
                    regularHoursWorked = (workEndHours - workStartHours) - deductionHours
                }else if (timeOutHours < workEndHours){
                    regularHoursWorked = (timeOutHours - workStartHours) - deductionHours
                    hoursWorked = (timeOutHours - workStartHours) - deductionHours
                }else if(timeOutHours > workEndHours){
                    regularHoursWorked = (workEndHours - workStartHours) - deductionHours
                    hoursWorked = (workEndHours - workStartHours) - deductionHours
                }
                
                if (timeInHours < lunchStartHours && timeOutHours > lunchEndHours) {
                  hoursWorked -= 1;
                  regularHoursWorked -= 1;
                }
                console.log(regularHoursWorked)
                regularHours += Math.max(regularHoursWorked, 0)
                weeklyHours[dayIndex] += Math.max(hoursWorked, 0); // Prevent negative values
              }
            });

                prisma.$disconnect()
                return {
                    weeklyHours: weeklyHours.map((hours) => parseFloat(hours.toFixed(1))),
                    regularHours: parseFloat(regularHours.toFixed(1)),
                    overtimeHours: overtimeHours
                }
    } catch (error) {
        console.log(error)
        return null
    }
}