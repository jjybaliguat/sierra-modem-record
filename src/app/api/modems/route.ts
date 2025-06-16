// app/api/modems/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const modems = await prisma.modem.findMany({
        include: { client: true },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(modems, {status: 200})    
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
  }
}

export async function POST(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)
    const userId = searchParams.get("userId") as string
    const body = await req.json()
    const {serial} = body
    try {
        if(serial !== "") {
          const isSerialExist = await prisma.modem.findUnique({
            where: {
              serial
            }
          })
          if(isSerialExist){
            return NextResponse.json({message: "Serial Number Already Exist."}, {status: 400})
          }
        }
        const result = await prisma.$transaction(async (tx) => {
          const modem = await prisma.modem.create({
              data: body
          })

          await prisma.modemLogs.create({
            data: {
              userId,
              modemId: modem.id,
              message: `${modem.type} modem ${modem.serial? modem.serial : "No Serial"} has been added`
            }
          })

          return modem
        })

        return NextResponse.json(result, {status: 201})
    } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function PATCH(req: Request){
  const url = new URL(req.url)
  const searchParams = new URLSearchParams(url.search)
  const id = searchParams.get("id") as string
  const userId = searchParams.get("userId") as string
  const body = await req.json()
  const {dispatchedDate, dispatchedTo} = body
  try {
    const modem = await prisma.modem.update({
      where: {
        id
      },
      data: {
        ...body,
        dispatchedDate: new Date(dispatchedDate)
      }
    })
    await prisma.modemLogs.create({
      data: {
        userId,
        modemId: id,
        message: `${modem.type} modem ${modem.serial? modem.serial : "No Serial"} has been dispatched to ${dispatchedTo}`
      }
    })

    return NextResponse.json({message: "Modem updated successfully"}, {status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
  }
}

export async function DELETE(req: Request){
  const url = new URL(req.url)
  const searchParams = new URLSearchParams(url.search)
  const id = searchParams.get("id") as string

  if(!id){
    return NextResponse.json({message: "Missing id field"}, {status: 400})
  }
  try {
    await prisma.modem.delete({
      where: {
        id
      }
    })

    return NextResponse.json({message: "Modem deleted successfully."}, {status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
  }
}
