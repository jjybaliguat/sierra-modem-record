import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request){
    try {
        const logs = await prisma.modemLogs.findMany({
            include: {
                Modem: true,
                User: true
            }
        })

        return NextResponse.json(logs, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}