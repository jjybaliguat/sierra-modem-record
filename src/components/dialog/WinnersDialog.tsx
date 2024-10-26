import React, { useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useWinnersStore, WinType } from '@/lib/store/winners';
import { toast } from 'sonner';

function WinnersDialog() {

    const buttonRef = useRef<HTMLButtonElement>(null);
    const {winners, getWinnerByWinType, clearWinners} = useWinnersStore()

  return (
    <>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Show Winners
                </Button>
            </DialogTrigger>
              <DialogClose ref={buttonRef} asChild>
                  <Button type="button" variant="secondary" className='hidden'>
                  Close
                  </Button>
              </DialogClose>
            <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Raffle Winners</DialogTitle>
                  <DialogDescription>
                      
                  </DialogDescription>
                  </DialogHeader>

                  <Accordion type="single" collapsible className="w-full">
                    {Object.values(WinType).map((winType)=>(
                        <AccordionItem key={winType} value={winType}>
                            <AccordionTrigger>{winType}</AccordionTrigger>
                            <AccordionContent>
                                {getWinnerByWinType(winType).map((winner, index)=>(
                                    <h1 key={index}>{index+1}. <span className='text-primary font-bold'>{winner.raffleCode}</span> - {`${winner.name} (${winner.phone}) - ${winner.branch}`}</h1>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))
                    }
                    <div className='flex justify-end'>
                        <AccordionItem value="action" className='w-[80px]'>
                            <AccordionTrigger>Action</AccordionTrigger>
                            <AccordionContent>
                                <Button size="sm" variant="destructive" onClick={()=>{
                                    clearWinners();
                                    toast.success("Cleared Winners!!");
                                }}>Reset</Button>
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                </Accordion>
            </DialogContent>
          </Dialog>
    </>
  )
}

export default WinnersDialog