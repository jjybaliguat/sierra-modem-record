import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json({ message: "Missing id or userId" }, { status: 400 });
    }

    const body = await req.json();
    const { condition, remark } = body;

    if (!condition || !remark) {
      return NextResponse.json({ message: "Missing condition or remark" }, { status: 400 });
    }

    let modem;

    switch (condition) {
      case "GOOD":
        await prisma.client.delete({
            where: { modemId: id }
        });
        modem = await prisma.modem.update({
          where: { id },
          data: {
            status: "AVAILABLE",
            dispatchedDate: null,
            dispatchedTo: null,
          },
        });
        await prisma.modemLogs.create({
          data: {
            userId,
            modemId: id,
            message: `${modem.type} modem ${modem.serial || "No Serial"} returned to stock. Remark: ${remark}`,
          },
        });
        return NextResponse.json({ message: "Modem returned successfully" }, { status: 200 });

      case "DEFECTIVE":
        await prisma.client.delete({
            where: { modemId: id }
        });
        modem = await prisma.modem.update({
          where: { id },
          data: {
            status: "DEFECTIVE",
            dispatchedDate: null,
            dispatchedTo: null
          },
        });
        await prisma.modemLogs.create({
          data: {
            userId,
            modemId: id,
            message: `${modem.type} modem ${modem.serial || "No Serial"} marked as defective. Remark: ${remark}`,
          },
        });
        return NextResponse.json({ message: "Modem marked as defective" }, { status: 200 });

      default:
        return NextResponse.json({ message: "Invalid condition" }, { status: 400 });
    }
  } catch (error) {
    console.error("[RETURN MODEM ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}