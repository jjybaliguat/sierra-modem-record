"use client"

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
import { useRef, useState } from "react"
import { mutate } from "swr"

export function DeleteCashAdvanceConfirmationDialog({
    id
} : {
    id: string,
}) {

  const [deleting, setDeleting] = useState(false)
            const btnRef = useRef<any | null>(null)
            
            const onClose = () => {
              if(btnRef){
                btnRef.current.click()
              }
            }
      
            async function onDelete(){
              setDeleting(true)
              try {
                await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/cash-advance?id=${id}`, {
                  method: "DELETE"
                })
                setDeleting(false)
                onClose()
                mutate("getCashAdvance")
              } catch (error) {
                console.log(error)
                setDeleting(false)
              }
            }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <div>
            <p className="text-[14px]">Are you sure you cant to delete this Cash Advance Record?</p>    
            <p className="text-[14px]">This can&apos;t be undone.</p>
        </div>
        <DialogFooter className="flex gap-4 mt-4">
            <DialogClose ref={btnRef}>Cancel</DialogClose>
            <Button variant="destructive" onClick={onDelete} disabled={deleting}>{deleting? "Deleting..." : "Yes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
