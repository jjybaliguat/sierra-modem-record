import { ModemStatus, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)
    const modemId = searchParams.get("id") as string
    const userId = searchParams.get("userId") as string
    const {type, remark, defectType} = await req.json()

    let modem;

    if(!modemId){
        return NextResponse.json({message: "Missin required params"}, {status: 400})
    }
    try {
        switch(type){
            case "AVAILABLE":
                modem = await prisma.modem.update({
                    where: {
                        id: modemId
                    },
                    data: {
                        status: ModemStatus.AVAILABLE,
                        defectType: null,
                        remarks: remark
                    }
                })
                await prisma.modemLogs.create({
                    data: {
                        modemId,
                        userId,
                        message: `${modem.type} modem ${modem.serial? modem.serial: "No Serial"} marked as Available. Remark: ${remark}`
                    }
                })

                return NextResponse.json({message: `${modem.type} modem ${modem.serial? modem.serial: "No Serial"} marked as available.`}, {status: 200})
            case "DEFECTIVE":
                modem = await prisma.modem.update({
                    where: {
                        id: modemId
                    },
                    data: {
                        status: ModemStatus.DEFECTIVE,
                        defectType,
                        remarks: remark
                    }
                })
                await prisma.modemLogs.create({
                    data: {
                        modemId,
                        userId,
                        message: `${modem.type} modem ${modem.serial? modem.serial: "No Serial"} marked as defective. Remark: ${remark}`
                    }
                })

                return NextResponse.json({message: `${modem.type} modem ${modem.serial? modem.serial: "No Serial"} marked as defective.`}, {status: 200})
            case "PENDING_INSPECTION":
                modem = await prisma.modem.update({
                    where: {
                        id: modemId
                    },
                    data: {
                        status: ModemStatus.PENDING_INSPECTION,
                        defectType: null,
                        remarks: remark
                    }
                })
                await prisma.modemLogs.create({
                    data: {
                        modemId,
                        userId,
                        message: `${modem.type} modem ${modem.serial? modem.serial : "No Serial"} moved to Pending Inspection. Remark: ${remark}`
                    }
                })

                return NextResponse.json({message: `${modem.type} modem ${modem.serial? modem.serial : "No Serial"} moved to Pending Inspection.`}, {status: 200})
            default:
                return NextResponse.json({ message: "Invalid condition" }, { status: 400 });
        }
    } catch (error) {
        console.error("[RETURN MODEM ERROR]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}