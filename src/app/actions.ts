"use server"

import { authOptions } from "@/lib/auth";
import { EntryProps } from "@/types";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

async function generateProductCode() {
    const counter = await prisma.counter.update({
      where: { id: '66d77a4d13045f9f3d416c04' },
      data: { value: { increment: 1 } },
    });
  
    const code = `${String(counter.value).padStart(4, '0')}`;
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
            },
            include: {
                branch: true,
            }
        })
        if(data){
            return data
        }else{
            return null
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteEntry(ids: string[]){
    try {
        const response = await prisma.entries.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export async function getSingleEntry(id: string){
    try {
        const data = await prisma.entries.findUnique({
            where: {
                id
            }
        })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function editEntry(formData: any){
    try {
        const response = await prisma.entries.update({
            where: {
                id: formData.id
            },
            data: {
                clientName: formData.clientName,
                phone: formData.phone,
                address: formData.address
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export async function getEntriesCount(){
    try {
        const count = await prisma.entries.count()
        return count
    } catch (error) {
        console.log(error)
    }
}