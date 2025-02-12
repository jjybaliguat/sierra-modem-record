"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { useRef, useState } from "react"
import { generateDeviceId } from "@/utils/generateDeviceId"
import { RotateCcw } from "lucide-react"

export function CreateDeviceDialog() {
    const [deviceId, setDeviceId] = useState(generateDeviceId())
    const [isGeneratingId, setIsGeneratingId] = useState(false)
      const buttonRef = useRef<HTMLButtonElement>(null)
        const [isSubmitting, setIsSubmitting] = useState(false)

      const handleRegenerateId = () => {
        setIsGeneratingId(true)
        setDeviceId(generateDeviceId())
        setIsGeneratingId(false)
      }

    async function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // try {
    //     setIsSubmitting(true)
    //     await fetch(`${process.env.NEXT_PUBLIC_FRONT_END_URL}/api/protected/user`, {
    //         method: "POST",
    //         body: JSON.stringify({...values})
    //     })
    //     setIsSubmitting(false)
    //     form.reset()
    //     if(buttonRef.current){
    //         buttonRef?.current.click()
    //     }
    //     toast("User has been created", {
    //         description: `You successfully added a user`,
    //         duration: 3000,
    //       })
    //     mutate("getUsers")
    // } catch (error) {
    //     console.log(error)
    // }
  }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Device</Button>
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
            </form>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
