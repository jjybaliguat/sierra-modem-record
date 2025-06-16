import { ModemStatus, PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)
    const userId = searchParams.get("userId") as string

    // console.log(userId)

    const body = await req.json()
    const {modemId, assignedDate, name} = body
    try {
        const result = await prisma.$transaction(async (tx) => {
            const client = await tx.client.create({
                data: {
                    ...body,
                    assignedDate: new Date(assignedDate)
                }
            })

            const modem = await tx.modem.update({
                where: { id: modemId },
                data: { status: ModemStatus.ASSIGNED },
                include: { client: true }
            })

            await prisma.modemLogs.create({
                data: {
                    userId,
                    modemId,
                    message: `${modem.type} Modem ${modem.serial? modem.serial: "No Serial"} assigned to client ${name}`
                }
            })

            return modem
        })

        // console.log(result)

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)
    const modemId = searchParams.get("modemId") as string
    const userId = searchParams.get("userId") as string
    const {reason} = await req.json()
    try {
        const result = await prisma.$transaction(async (tx) => {
            const client = await prisma.client.findUnique({
                where: {
                    modemId
                }
            })
            await prisma.client.delete({
            where: {
                modemId,
            },
            })
            const updatedModem = await prisma.modem.update({
            where: { id: modemId },
            data: {
                status: ModemStatus.AVAILABLE,
            },
            include: {
                client: true,
            },
            })

            await prisma.modemLogs.create({
                data: {
                    userId,
                    modemId,
                    message: `${updatedModem.type} modem ${updatedModem.serial? updatedModem.serial : "No Serial"} has been unassigned to client ${client?.name}. Reason: ${reason}`
                }
            })

            return updatedModem
        })

        

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.error('Unassign Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}