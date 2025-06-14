import { ModemStatus, PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const body = await req.json()
    const {modemId} = body
    try {
        const result = await prisma.$transaction(async (tx) => {
            const client = await tx.client.create({
                data: body
            })

            const modem = await tx.modem.update({
                where: { id: modemId },
                data: { status: ModemStatus.ASSIGNED },
                include: { client: true }
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
    try {
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

        return NextResponse.json(updatedModem, { status: 200 })
    } catch (error) {
        console.error('Unassign Error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}