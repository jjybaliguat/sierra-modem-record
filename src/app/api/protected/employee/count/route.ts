import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const id = searchParams.get('id') as string
    const filters: any = {};

    if(!id){
        return NextResponse.json({message: "Missing id parameter"}, {status: 400})
    }else{
        filters.employerId = id
    }
    
    try {
        const count = await prisma.employee.count({
            where: filters
        })

        return NextResponse.json(count, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}