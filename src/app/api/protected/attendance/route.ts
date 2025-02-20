import { AttendanceError } from "@/types/attendance";
import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const id = searchParams.get('id') as string
    const filters: any = {};
    if(!id){
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }else{
        filters.employerId = id
    }

    try {
        const attendanceLogs = await prisma.attendance.findMany({
            where: {
                employee: filters
            },
            include: {
                employee: true
            },
            orderBy: {
                timeIn: "desc"
            }
        })
        prisma.$disconnect()
        return NextResponse.json(attendanceLogs, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const deviceToken = searchParams.get('deviceToken') as string
    const {fingerId, timeIn} = await req.json()
    // const filters: any = {};
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            // Get start and end of today
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        // Get 12:00 PM timestamp for today
        // const thresholdLogin = new Date(now);
        // thresholdLogin.setHours(8, , 0, 0);

    if(!deviceToken){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    if(!fingerId){
        return NextResponse.json({error: "Missing required field."}, {status: 400})
    }

    try {
        const employee = await prisma.employee.findFirst({
            where: {
                deviceId: deviceToken,
                fingerprintId: fingerId,
                fingerEnrolled: true
            }
        })

        if(!employee){
            return NextResponse.json({error: `Employee with fingerId ${fingerId} not found.`}, {status: 404})
        }
        // Check if there's already a time-in record for today
        const existingRecord = await prisma.attendance.findFirst({
            where: {
            deviceId: deviceToken,
            fingerprintId: fingerId,
            timeIn: { gte: startOfDay, lte: endOfDay }, // Check today's records
            },
        });

        if (existingRecord) {
            // If timeOut is already recorded, prevent duplicate updates
            if (existingRecord.timeOut) {
              return NextResponse.json({error: AttendanceError.SIGNED_OUT_ALREADY}, {status: 400})
            }

            const lastLoginTime = new Date(existingRecord.timeIn);
            const diffInMinutes = (now.getTime() - lastLoginTime.getTime()) / (1000 * 60);

                    // Prevent duplicate login if already signed in before 12:00 PM
            if (diffInMinutes < 30) {
                return NextResponse.json({ error: AttendanceError.SIGNED_IN_ALREADY }, { status: 400 });
            }
        
            // Update timeOut with the exact time of API call
            const updatedAttendance = await prisma.attendance.update({
              where: { id: existingRecord.id },
              data: { timeOut: now }, // Exact time when API is called
            });
        
            return NextResponse.json({name: employee?.fullName?.split(" ")[0], timeOut: updatedAttendance.timeOut});
          }

        const device = await prisma.device.findUnique({
            where: {
                deviceId: deviceToken
            },
            include: {
                user: true
            }
        })

        if(!device){
            return NextResponse.json({error: `No device found with deviceId ${deviceToken}`})
        }

        const cutoffTime = new Date(timeIn);
        cutoffTime.setHours(8, Number(device.user?.gracePeriodInMinutes), 0, 0); // Set to 08:30 AM

        // Determine status
        const status = timeIn > cutoffTime ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        const attendance = await prisma.attendance.create({
            data: {
                fingerprintId: fingerId,
                employeeId: employee?.id as string,
                timeIn: timeIn? timeIn : now,
                status,
                deviceId: deviceToken,
            },
            include: {
                employee: true
            }
        })
        prisma.$disconnect()
        return NextResponse.json({name: attendance.employee.fullName?.split(" ")[0], timeIn: attendance.timeIn}, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error."})
    }
}