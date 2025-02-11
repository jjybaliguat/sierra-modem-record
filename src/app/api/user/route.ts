import { hashPassword } from "@/utils/hashPassword";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(){
    try {
        
    } catch (error) {
        
    }
}

export async function POST(req: Request){
    const {name, email, password} = await req.json()

    if(!name || !email || !password){
        return NextResponse.json({message: "Missing required fields"}, {status: 400})
    }
    try {
        const isEmailExist = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(isEmailExist){
            return NextResponse.json({message: "Email already registered."}, {status: 400})
        }
        const hashedPass = await hashPassword(password) as string
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPass,
            }
        })

        return NextResponse.json(user, {status: 201})
    } catch (error) {
        console.log(error)
        NextResponse.json({message: "Internal Server Error."}, {status: 500})
    }
}