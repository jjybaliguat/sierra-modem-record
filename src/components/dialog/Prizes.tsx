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

function Prizes({
  label,
  img,
  title,
  alt
}: {
  label: string,
  img: string,
  title: string,
  alt: string
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{label}</Button>
          </DialogTrigger>
            <DialogClose ref={buttonRef} asChild>
                <Button type="button" variant="secondary" className='hidden'>
                Close
                </Button>
            </DialogClose>
          <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription> */}
                </DialogHeader>
                <div>
                    <Image
                        src={img}
                        alt={alt}
                        width={500}
                        height={500}
                    />
                </div>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default Prizes