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

function IntroVideoDialog({
    btnRef
  }: {
    btnRef: any
  }) {
    const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
    <Dialog>
          <DialogTrigger asChild>
            <Button ref={btnRef}  variant="default">Watch Video</Button>
          </DialogTrigger>
            <DialogClose ref={buttonRef} asChild>
                <Button type="button" variant="secondary" className='hidden'>
                Close
                </Button>
            </DialogClose>
          <DialogContent className="w-full h-screen">
            <video className='w-full h-full' autoPlay>
                <source src='/raffle-intro-video.mp4' type='video/mp4' />
            </video>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default IntroVideoDialog