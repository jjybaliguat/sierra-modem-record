"use client"

import { EntryProps } from '@/types'
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
import { editEntry, getSingleEntry } from '@/app/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function EditDialog({
    data,
    setSingleEntry
}: {data: EntryProps,
    setSingleEntry: any
}) {

    const [editedData, setEditedData] = useState({
        clientName: '',
        phone: '',
        address: ''
    })

    useEffect(()=>{
        setEditedData({
            clientName: data?.clientName,
            phone: data?.phone,
            address: data?.address
        })
    }, [data])
    const router = useRouter()
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isSaving, setIsSaving] = useState(false)

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        setIsSaving(true)
       try {
        const response: any = await editEntry({
            ...editedData,
            id: data.id
        })
        if(!response.error){
            toast.success("Entry updated!");
        }else{
            toast.error("Error while updating!");
        }
        setIsSaving(false)
        router.refresh()
        if(buttonRef.current){
            buttonRef?.current.click()
        }
        setSingleEntry(null)
       } catch (error) {
        setIsSaving(false)
        console.log(error)
       }
    }
    
    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
            <DialogClose ref={buttonRef} asChild>
                <Button type="button" variant="secondary" className='hidden'>
                Close
                </Button>
            </DialogClose>
          <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
              <DialogTitle>Edit Entry</DialogTitle>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    defaultValue={editedData.clientName === '' ? data?.clientName : editedData.clientName}
                    className="col-span-3"
                    onChange={(e)=>setEditedData({...editedData, clientName: e.target.value})}
                    required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                    Address
                    </Label>
                    <Input
                    id="address"
                    defaultValue={editedData.address === '' ? data?.address : editedData.address}
                    className="col-span-3"
                    onChange={(e)=>setEditedData({...editedData, address: e.target.value})}
                    required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    Phone
                    </Label>
                    <Input
                    id="phone"
                    defaultValue={editedData.phone === '' ? data?.phone : editedData.phone}
                    className="col-span-3"
                    onChange={(e)=>setEditedData({...editedData, phone: e.target.value})}
                    required
                    />
                </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isSaving? "Saving.." : "Save"}</Button>
            </DialogFooter>
                </form>
          </DialogContent>
        </Dialog>
      )
}

export default EditDialog