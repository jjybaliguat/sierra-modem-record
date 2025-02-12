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

const formSchema = z.object({
  deviceId: z.string().min(2, {
    message: "Name must be at least 3 characters.",
  }),
  deviceName: z.string().min(1, "Required")
})

export function ConnectDeviceDialog() {
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
            </form>
        </Form>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
