"use server"

import { EntryProps } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function generateProductCode() {
    const counter = await prisma.counter.update({
      where: { id: '66d77a4d13045f9f3d416c04' },
      data: { value: { increment: 1 } },
    });
  
    const code = `${String(counter.value).padStart(5, '0')}`;
    return code;
  }

export async function createEntry(formData: any){
    const entries = []
    try {
        for (let i = 0; i < formData.numEntries; i++) {
            const code = await generateProductCode();
            const entry = {
                raffleCode: code,
                clientName: formData.clientName,
                address: formData.address,
                phone: formData.phone,
                branchId: formData.branchId
            }
            entries.push(entry)
        }

        const createEntries = await prisma.entries.createMany({
            data: entries
        })
        return createEntries
    } catch (error) {
        console.log(error)
    }
}

export async function getEntries(){
    try {
        const data = await prisma.entries.findMany({
            orderBy: {
                raffleCode: 'desc'
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
}