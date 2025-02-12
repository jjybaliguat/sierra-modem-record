import { PrismaClient } from "@prisma/client";
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
        const employees = await prisma.employee.findMany({
            where: filters
        })

        return NextResponse.json(employees, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req: Request){
    const {
        employerId,
        empCode,
        fullName,
        email,
        phone,
        position,
        dailyRate,
        fingerprintId
    } = await req.json()

    if(!employerId || !empCode || !fullName || !email || !position || !dailyRate || !fingerprintId){
        return NextResponse.json({message: "Missing Required Fields."}, {status: 400})
    }

    try {
        return NextResponse.json({message: "OK"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}