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
import { useRef, useState } from "react"
import { toast } from "sonner"
import { mutate } from "swr"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  deviceId: z.string().min(2, {
    message: "Name must be at least 3 characters.",
  }),
  deviceName: z.string().min(1, "Required")
})

export function ConnectDeviceDialog() {
      const session = useSession()
      const buttonRef = useRef<HTMLButtonElement>(null)
        const [isSubmitting, setIsSubmitting] = useState(false)
        // 1. Define your form.
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deviceId: "",
            deviceName: ""
        },
      })

async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        setIsSubmitting(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/devices?deviceId=${values.deviceId}`, {
            method: "PATCH",
            body: JSON.stringify({
              userId: session.data?.user.id,
              name: values.deviceName
            })
        })
        const data = await response.json()

        if(!data.error){
          setIsSubmitting(false)
          form.reset()
          if(buttonRef.current){
              buttonRef?.current.click()
          }
          toast("Device has been added", {
              description: `You successfully added a device`,
              duration: 3000,
            })
          mutate("getDevices")
        }else{
          toast("Error", {
            description: data.error,
            duration: 3000,
          })
          setIsSubmitting(false)
        }
    } catch (error: any) {
        console.log(error)
        toast("Error", {
          description: error.error,
          duration: 3000,
        })
    }
  }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Connect Your Device</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>
            Add your purchased biometric device by entering the device ID found below it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>DeviceId <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                            
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="deviceName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Device Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                            
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="flex justify-end mt-8">
                  <DialogClose>
                    <Button variant="outline" type="button" ref={buttonRef}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting? "Adding..." : "Add"}</Button>
                </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
