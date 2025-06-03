import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const empCode = new URLSearchParams(url.search).get("id") as string;

  // Helper to get local YYYY-MM-DD string
  const getLocalDateStr = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split("T")[0];

    const dateList = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(); // fresh copy each time
        date.setDate(date.getDate() - i);
        date.setHours(9, 0, 0, 0); // set to 1 AM local time
        return date
        // console.log(new Date(date.getFullYear(), date.getMonth(), date.getDay()))
        // return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // drops time part, keeps local
        });

  try {
     const employee = await prisma.employee.findUnique({
        where: {
            empCode
        }
    })
    if(employee){
            // Define range: oldest to today
        // const startDate = new Date(dateList[6]);
        // startDate.setHours(9, 0, 0, 0);
        // const endDate = new Date(dateList[0]);
        // endDate.setHours(20, 59, 59, 999);

        // const today = new Date();
        // const endDate = new Date(today); // today
        // endDate.setHours(23, 59, 59, 999);
        // const startDate = new Date(today);
        // startDate.setDate(today.getDate() - 9); // 6 days range including today

        const attendanceRecords = await prisma.attendance.findMany({
        where: {
            employee: { empCode },
        },
        take: 10,
        orderBy: {
            timeIn: "desc",
        },
        });

        // const results = dateList.map((date) => {
        // const localDateStr = getLocalDateStr(date);

        // const record = attendanceRecords.find((r) => {
        //     const recordDateStr = getLocalDateStr(new Date(r.timeIn));
        //     return recordDateStr === localDateStr;
        // });

        // console.log(record)

        // return {
        //     timeIn: record?.timeIn ?? null,
        //     timeOut: record?.timeOut ?? null,
        //     status: record?.status ?? null,
        //     createdAt: date,
        // };
        // });

        return NextResponse.json(attendanceRecords, { status: 200 });
    }else{
        return NextResponse.json({message: "Employee Code Not Found"}, {status: 400})
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
