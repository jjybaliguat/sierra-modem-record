import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const deviceToken = searchParams.get('deviceToken') as string
    let filters: any = {};
    if(deviceToken){
        filters.deviceId = deviceToken
    }
    if(!deviceToken){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const device = await prisma.device.findUnique({
            where: filters
        })

        if(!device){
            return NextResponse.json({error: `Device with id ${deviceToken} not found.`})
        }

        return NextResponse.json({isEnrollment: device?.isEnrollmentMode, fingerId: device.toEnrollId}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function PATCH(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const deviceId = searchParams.get('deviceId') as string
    const {fingerId, isEnrollmentMode} = await req.json();
    try {
        const device = await prisma.device.update({
            where: {
                deviceId
            },
            data: {
                isEnrollmentMode,
                toEnrollId: fingerId
            }
        })

        console.log(device)

        return NextResponse.json(device, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error."}, {status: 500})
    }
}