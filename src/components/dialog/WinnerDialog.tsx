"use client"
import React, { useRef } from 'react'
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
import { Button } from '../ui/button'
import Image from 'next/image';
import { EntryProps } from '@/types';

function WinnerDialog({
  btnRef,
  winner
}: {
  btnRef: any,
  winner: EntryProps | null | undefined
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
        <Dialog>
          <DialogDescription></DialogDescription>
            <DialogTrigger asChild>
                <Button ref={btnRef} className='hidden' variant="outline"></Button>
            </DialogTrigger>
            <DialogClose ref={buttonRef} asChild>
                <Button type="button" variant="secondary" className='hidden'>
                Close
                </Button>
            </DialogClose>
          <DialogContent className="sm:max-w-[425px] z-100">
                <DialogHeader>
                <DialogTitle className='text-center text-2xl'>Congratulations</DialogTitle>
                {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription> */}
                </DialogHeader>
                <div className='mt-4 flex flex-col items-center gap-2'>
                  {winner?.id ? (
                    <>
                      <h1 className='text-center text-4xl font-bold tracking-widest'>{winner?.raffleCode}</h1>
                      <h1 className='text-center text-3xl font-bold text-primary'>{winner?.clientName}</h1>
                      <h1 className='text-center'>{winner?.address}</h1>
                      <h1 className='text-center'>{winner?.branch?.branchName} Branch</h1>
                    </>
                  ) : (
                    <>
                      <h1 className='text-3xl'>INVALID DRAW!</h1>
                      <h1>Entry Code Not Found</h1>
                    </>
                  )}
                </div>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default WinnerDialog