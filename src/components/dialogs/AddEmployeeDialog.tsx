"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useRef, useState } from "react"
import { mutate } from "swr"
import { toast } from "sonner"
import { DatePicker } from "../DatePicker"
import { Label } from "../ui/label"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please provide a valid email address."
  }),
  phone: z.string()
  .regex(/^(\+63|0)9\d{9}$/, "Invalid Philippine mobile number"),
  position: z.string().min(1, "Required"),
  dailyRate: z.number(),
  hireDate: z.date(),
  tinNumber: z.string(),
  sssNumber: z.string()
})

export function AddEmployeeDialog() {

    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
      dailyRate: 0,
      hireDate: new Date(),
      tinNumber: "",
      sssNumber: "",
    },
  })
 
  // 2. Define a submit handler.
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
        <Button>Add Employee</Button>
      </DialogTrigger>
      <DialogClose ref={buttonRef} asChild>
          <Button type="button" variant="secondary" className='hidden'>
          Close
          </Button>
      </DialogClose>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input placeholder="jhon doe" {...field} />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input placeholder="+63..." {...field} />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Position <span className="text-red-500">*</span></FormLabel>
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
                name="dailyRate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Daily Rate <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="tinNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tin Number (optional)</FormLabel>
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
                name="sssNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>SSS Number (optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="w-full space-y-2">
                  <Label htmlFor="hiredate">Hire Date</Label>
                  <div id="hiredate">
                    <DatePicker />
                  </div>
                </div>
                <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Creating..." : "Submit"}</Button>
            </form>
            </Form>
    </DialogContent>
    </Dialog>
  )
}
