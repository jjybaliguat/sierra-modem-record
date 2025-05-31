import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient

export async function PATCH(req: Request){
    const body = await req.json()
    const url = new URL(req.url)
    const params = new URLSearchParams(url.search)
    const id = params.get('id')
    const {name, email} = body

    if(!id){
        return NextResponse.json({message: "Missing id field"}, {status: 400})
    }
    try {
        const user = await prisma.subUser.update({
            where: {
                id: id
            },
            data: {
                name,
                email
            },
            include: {
                parent: {
                    include: {
                        company: true
                    }
                }
            }
        })
            
        return NextResponse.json(user, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    } 
}