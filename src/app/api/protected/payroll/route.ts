import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const userId = searchParams.get('id') as string

    try {
        const payroll = await prisma.payroll.findMany({
            where: {
                employee: {
                    employerId: userId
                }
            },
            include: {
                employee: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        console.log(payroll)
        return NextResponse.json(payroll, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req: Request){
    const body = await req.json()
    const {periodStart, periodEnd} = body
    const {employeeId, caDeduction} = body

    try {
        const payroll = await prisma.payroll.create({
            data: {
                ...body,
                periodStart: new Date(periodStart),
                periodEnd: new Date(periodEnd),
            }
        })

        await prisma.cashAdvance.updateMany({
            where: {
                employeeId: employeeId
            },
            data: {
                amount: {
                    decrement: caDeduction
                }
            }
        })

        console.log(payroll)

        return NextResponse.json(payroll, {status: 201})
    } catch (error) {
        console.log(error)
    }
}

export async function DELETE(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const id = searchParams.get('id') as string

    if(!id){
        return NextResponse.json({error: "Missing id field"}, {status: 400})
    }

    try {
        await prisma.payroll.delete({
            where: {
                id
            }
        })
        return NextResponse.json({message: `Payroll ${id} deleted`}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error."}, {status: 500})
    }
}