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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { generateDeviceId } from "@/utils/generateDeviceId"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function CreateDeviceDialog() {
    const [deviceId, setDeviceId] = useState(generateDeviceId())
    const [isGeneratingId, setIsGeneratingId] = useState(false)
    const [creating, setCreating] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const session = useSession()
    const router = useRouter()

      const handleRegenerateId = () => {
        setIsGeneratingId(true)
        setDeviceId(generateDeviceId())
        setIsGeneratingId(false)
      }

    async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      setCreating(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
        setCreating(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/devices?id=${session.data?.user.id}`, {
            method: "POST",
            body: JSON.stringify({deviceId})
        })
        const data = await response.json()

        if(data.error){
          toast("ERROR!", {
            description: data.error,
            duration: 3000,
          })
        }else{
        setCreating(false)
        setDeviceId("")
        if(buttonRef.current){
            buttonRef?.current.click()
        }
        toast("Device has been created", {
            description: `You successfully added a device`,
            duration: 3000,
          })
          router.refresh()
        }
    } catch (error: any) {
        console.log(error)
        setCreating(false)
        toast("ERROR!", {
          description: error.error,
          duration: 3000,
        })
    }
  }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={()=>setDeviceId(generateDeviceId())}>Create Device</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Device</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-2">
                <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label htmlFor="deviceId">DeviceId <span className="text-red-500">*</span></Label>
                            <Input id="deviceId" placeholder="" value={deviceId} readOnly/>
                            <h1 onClick={handleRegenerateId} className="flex items-center gap-1 text-sm text-gray-300 cursor-pointer"><RotateCcw className={`h-4 w-4 ${isGeneratingId && "animate-spin-reverse"}`} /> Regenerate</h1>
                        </div>
                    </div>
                </div>
              <DialogFooter>
                <DialogClose ref={buttonRef}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={creating}>{creating? "Creating..." : "Create"}</Button>
              </DialogFooter>
            </form>
      </DialogContent>
    </Dialog>
  )
}
