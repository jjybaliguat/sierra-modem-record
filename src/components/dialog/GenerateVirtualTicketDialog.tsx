"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EntryProps } from '@/types'
import Image from 'next/image'
import { usePDF } from 'react-to-pdf';
import generatePDF from 'react-to-pdf';

function GenerateVirtualTicketDialog({
    data
} : { data: EntryProps[] | null}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { toPDF, targetRef } = usePDF({filename: 'raffle-entries.pdf'});
  return (
    <>
    <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">View Virtual Ticket</Button>
          </DialogTrigger>
            <DialogClose ref={buttonRef} asChild>
                <Button type="button" variant="secondary" className='hidden'>
                Close
                </Button>
            </DialogClose>
          <DialogContent className="w-full lg:w-[70vw]">
          <DialogTitle>Virtual Ticket</DialogTitle>
            <div ref={targetRef} className='flex flex-wrap gap-2 p-8'>
                {data?.map((entry: EntryProps)=>(
                    <div className='relative w-[300px] h-[100px]'>
                        <Image 
                        src="/raffleticket.png"
                        alt='raffle-ticket-layout'
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "center"
                        }}
                        className='w-full h-full'
                        />
                        <p className='absolute top-4 left-2 text-[8px]'>{entry.clientName}</p>
                        <p className='absolute top-1/2 transform -translate-y-1 left-2 text-[8px]'>{entry.phone}</p>
                        <p className='absolute bottom-3 left-2 text-[8px]'>{entry.address}</p>
                        <p className='absolute bottom-1 left-1/2 right-1/2 text-[10px] transform text-black font-bold'>{entry.raffleCode}</p>
                    </div>
                ))}
            </div>
            <DialogFooter>
              <Button onClick={() => toPDF()}>Print/Download</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default GenerateVirtualTicketDialog