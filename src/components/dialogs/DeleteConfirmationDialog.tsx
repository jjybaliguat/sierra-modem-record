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

export function DeleteConfirmationDialog({
    onConfirm,
    title,
    deleting,
    closeRef
} : {
    onConfirm: () => void,
    title: string,
    deleting: boolean,
    closeRef: any
}) {
     
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
            <p className="text-[14px]">Are you sure you cant to delete this {title} Record?</p>    
            <p className="text-[14px]">This can&apos;t be undone.</p>
        </div>
        <DialogFooter className="flex gap-4 mt-4">
            <DialogClose ref={closeRef}>Cancel</DialogClose>
            <Button variant="destructive" onClick={onConfirm} disabled={deleting}>{deleting? "Deleting..." : "Yes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
