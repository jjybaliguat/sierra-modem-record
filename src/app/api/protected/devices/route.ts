import { PrismaClient, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const id = searchParams.get('id') as string
    let filters: any = {};

    if(id){
        filters.userId = id
     }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
         })
         if(user?.role === UserRole.DEVELOPER){
            filters = {}
         }
        const devices = await prisma.device.findMany({
            where: filters,
            include: {
                user: true
            }
        })

        return NextResponse.json(devices, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const userId = searchParams.get('id') as string

    const {deviceId} = await req.json()

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!user || (user.role !== UserRole.DEVELOPER)){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    if(!deviceId){
        return NextResponse.json({error: "Missing required field"}, {status: 400})
    }

    try {
        const device = await prisma.device.create({
            data: {
                deviceId
            }
        })

        return NextResponse.json(device, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}