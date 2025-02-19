"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { toast } from "sonner"
import { mutate } from 'swr'
import { Input } from '@/components/ui/input'
import { getSession, signOut, useSession } from 'next-auth/react'
import { authOptions } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { changePassword } from '@/app/actions'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Invalid Email Address"
  }),
  name: z.string().min(3, "Atleast 2 characters"),
  companyName: z.string().min(1, "Company Name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
})

const passwordSchema = z.object({
    oldPassword: z.string({
        message: "Old Password is required"
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Path of the error
    message: "Passwords must match",
  });

type Props = {}

const ProfilePage = (props: Props) => {

    const {data: session, update} = useSession()
    const user = session?.user
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: user?.name,
          email: user?.email
        },
      })

    const form2 = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        },
      })
      

    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitting2, setIsSubmitting2] = useState(false)
    const [error, setError] = useState('')

      // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
        setIsSubmitting(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/user?id=${user?.id}`, {
            method: "PATCH",
            body: JSON.stringify({...values})
        })
        const data = await response.json()
        setIsSubmitting(false)
        update({
            user: {
                ...user,
                name: data.name,
                email: data.email
            }
        })
        if(buttonRef.current){
            buttonRef?.current.click()
        }
        toast("Profile has been updated", {
            description: `You successfully updated your profile`,
            duration: 3000,
          })
    } catch (error) {
        console.log(error)
    }
  }

  async function handleChangePass(values: z.infer<typeof passwordSchema>){
    try {
        setIsSubmitting2(true)
        const response: any = await changePassword({id: user?.id, oldPassword: values.oldPassword, password: values.password})
        
        if(response.error){
            setError(response.error)
            setIsSubmitting2(false)
        }else{
            setError('')
            setIsSubmitting2(false)
            toast("Password has been updated", {
                description: `You successfully changed your password`,
                duration: 3000,
              })
            await signOut()
        }
    } catch (error: any) {
        setIsSubmitting2(false)
        setError(error.error)
        console.log(error)
    }
  }

  return (
    <>
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <HeaderBreadCrumb />
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>Profile</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='flex flex-wrap gap-8'>
                    <Card className='w-full sm:max-w-[400px]'>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {user && <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                    defaultValue={user?.name}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Name</FormLabel>
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
                                    defaultValue={user?.email}
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
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
                                    defaultValue={user?.company?.name}
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Company Name</FormLabel>
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
                                    defaultValue={user?.company?.address}
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Company Address</FormLabel>
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
                                    defaultValue={user?.company?.contact}
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Company Contact</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <div className='flex justify-end'>
                                        <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Updating..." : "Update"}</Button>
                                    </div>
                                </form>
                            </Form>}
                        </CardContent>
                    </Card>
                    <Card className='w-full sm:max-w-[400px]'>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className='text-red-500 font-bold text-center'>{error}</h1>
                        <Form {...form2}>
                                <form onSubmit={form2.handleSubmit(handleChangePass)} className="space-y-4">
                                    <FormField
                                    control={form2.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form2.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form2.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder="" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <div className='flex justify-end'>
                                        <Button disabled={isSubmitting2} type="submit">{isSubmitting2 ? "Updating..." : "Update"}</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    </div>
    </>
  )
}

export default ProfilePage