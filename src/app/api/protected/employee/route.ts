import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

async function generateEmployeeCode(hireDate: Date): Promise<string> {
    const date = new Date(hireDate)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month (01-12)
  
    // Find the count of employees who joined in the same year and month
    const count = await prisma.employee.count({
      where: {
        hireDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-01`),
        },
      },
    });
  
    // Increment the count to generate a new code
    const newNumber = String(count + 1).padStart(3, "0"); // Ensure 3-digit number
  
    return `EMP-${year}${month}-${newNumber}`;
  }

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
            where: filters,
            include: {
                device: true
            }
        })
        prisma.$disconnect()
        return NextResponse.json(employees, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}

export async function POST(req: Request){
    const body = await req.json()
    const {
        employerId,
        fullName,
        email,
        phone,
        position,
        dailyRate,
        hireDate,
        deductions
    } = body

    if(!employerId || !fullName || !email || !position || !dailyRate){
        return NextResponse.json({error: "Missing Required Fields."}, {status: 400})
    }

    try {
        const empCode = await generateEmployeeCode(hireDate)
        // const fingerprintId = await getNextFingerPrintId(employerId)
        const employee = await prisma.employee.create({
            data: {...body, empCode}
        })
        prisma.$disconnect()
        return NextResponse.json(employee, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function PATCH(req: Request){
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search) 
    const id = searchParams.get('id') as string
    const body = await req.json()

    console.log(body)

    if(!id){
        return NextResponse.json({error: "Missing required fields"}, {status: 400})
    }

    try {

        const response = await prisma.employee.update({
            where: {
                id: id
            },
            data: body
        })
        console.log(response)
        prisma.$disconnect()
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}