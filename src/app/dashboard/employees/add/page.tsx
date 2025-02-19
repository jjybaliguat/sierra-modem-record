"use client"

import React, { useRef, useState } from 'react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from "date-fns"
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, DeleteIcon, PlusIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BackButton from '@/components/buttons/BackButton'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import { DeductionStatus, DeductionType } from '@prisma/client'
import { SelectDeductionType } from '@/components/select/SelectDeductionType'
import { SelectDeductionStatus } from '@/components/select/SelectDeductionStatus'

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
  dailyRate: z.coerce.number(),
  hireDate: z.date(),
  tinNumber: z.string(),
  sssNumber: z.string()
})

// interface Deductions {
//     type: DeductionType | "",
//     precentage: number | "",
//     status: DeductionStatus
// }


const AddEmployee = () => {
    const buttonRef = useRef<HTMLButtonElement>(null)
        const [isSubmitting, setIsSubmitting] = useState(false)

        // const [deductions, setDeductions] = useState<Deductions[]>([])
        const router = useRouter()
        const session = useSession()
        const user = session.data?.user
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
        // console.log(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee`)
        try {
            setIsSubmitting(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee`, {
                method: "POST",
                body: JSON.stringify({...values, employerId: user?.id})
            })
            const data = await response.json()
            if(!data.error){
                form.reset()
                if(buttonRef.current){
                    buttonRef?.current.click()
                }
                toast("Employee has been added", {
                    description: `You successfully added an employee`,
                    duration: 3000,
                })
                router.back()
                setIsSubmitting(false)
            }else{
                setIsSubmitting(false)
                toast("Error", {
                    description: data.error,
                    duration: 3000,
                })
            }
        } catch (error: any) {
            console.log(error)
            toast("Error", {
                description: error.message,
                duration: 3000,
            })
        }
      }

    //   const handleAddDeduction = () => {
    //     if(deductions){
    //         setDeductions([...deductions, {
    //             type: "",
    //             precentage: "",
    //             status: DeductionStatus.ACTIVE
    //         }])
    //     }else{
    //         setDeductions([{
    //             type: "",
    //             precentage: "",
    //             status: DeductionStatus.ACTIVE
    //         }])
    //     }
    //   }

    //   const updateItemDeduction = (index: number, updatedData: Partial<Deductions>) => {
    //     setDeductions((prevItems: any) => {
    //       const updatedItems = [...prevItems];
    //       updatedItems[index] = { ...updatedItems[index], ...updatedData };
    //         console.log(updatedItems)
    //       return updatedItems;
    //     });
    //   };

  return (
    <>
    <BackButton />
        <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Add Employee</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <div className="space-y-2">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
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
                        <FormField
                        control={form.control}
                        name="hireDate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Hire Date</FormLabel><br />
                            <FormControl>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon />
                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                        </Button>
                                </PopoverTrigger>
                                <PopoverContent forceMount side="bottom" align="start" className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormDescription>
                                
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* <div className='mt-4'>
                            <div className='mt-4 flex flex-col gap-2'>
                                <h1>Deductions:</h1>
                                {deductions?.map((deduction, index)=>(
                                    <div key={index} className='flex items-center gap-2'>
                                        <div className='flex gap-2 flex-col md:flex-row'>
                                            <SelectDeductionType selected={deductions[index].type} onSelectChange={(value: DeductionType)=>updateItemDeduction(index, {type: value})} />
                                            <div className='flex items-center gap-2'>
                                                <Input type='number' placeholder='precentage' className='w-[80px]' value={deductions[index].precentage} onChange={(e)=>updateItemDeduction(index, {precentage: Number(e.target.value)})} />
                                                <SelectDeductionStatus selected={deductions[index].status} onSelectChange={(value: DeductionStatus)=>updateItemDeduction(index, {status: value})} />
                                                <Trash2Icon className='w-5 h-5 text-red-500 cursor-pointer' onClick={()=>setDeductions((prevItems)=>prevItems.filter((_, i)=>i !== index))} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className='mt-4' type='button' variant="outline" onClick={handleAddDeduction}><PlusIcon /> Deduction</Button>
                        </div> */}
                    </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Creating..." : "Create"}</Button>
                    </div>
                </form>
            </Form>
            </CardContent>
        </Card>
    </>
  )
}

export default AddEmployee