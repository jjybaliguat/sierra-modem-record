import { EntryProps } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function createEntry(formData: any){
    let codes = []
    try {
        const data = await prisma.entries.create({
            data: {
                clientName: formData.clientName,
                address: formData.address,
                phone: formData.phone,
                branchId: formData.branchId
            }
        })
        return formData
    } catch (error) {
        console.log(error)
    }
}