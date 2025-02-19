'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react";
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
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Invalid Email Address"
  }),
  name: z.string().min(3, "Atleast 2 characters"),
  companyName: z.string().min(1, "Company Name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
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

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMess, setErrorMess] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      address: "",
      contact: "",
    },
  })
 
  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
  // console.log(values)
  setSubmitting(true)
  setSuccessMessage("")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/user`, {
        method: "POST",
        body: JSON.stringify(values)
      })

      const data = await response.json()
      if(!data.error){
        setErrorMess("")
        setSubmitting(false)
        setSuccessMessage("Account Created!")
        form.reset()
        // console.log(data)
      }else{
        setSuccessMessage("")
        setErrorMess(data.error)
        setSubmitting(false)
      }
    } catch (error: any) {
      setSuccessMessage("")
      setErrorMess(error.error)
      console.log(error)
      setSubmitting(false)
    }
  } 
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-5xl">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="overflow-hidden">
                    <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Create Account</h1>
                            <p className="text-balance text-muted-foreground">
                                Create a LogPay Account
                            </p>
                            </div>
                            {successMessage !== "" && <div className="flex flex-col items-center gap-2">
                              <h3 className="text-green-500 text-center font-bold">{successMessage}</h3>
                              <Button type="button" onClick={()=>router.push("/")}>Back to login</Button>
                            </div>}
                            <h3 className="text-red-500 text-center font-bold">{errorMess}</h3>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="your name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Company Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Create a strong password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button disabled={submitting} type="submit" className="mt-4 w-full">
                              {submitting ? "Creating..." : "Create"}
                            </Button>
                            <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/" className="underline underline-offset-4">
                                Sign in
                            </Link>
                            </div>
                        </div>
                        </form>
                    </Form>
                    <div className="relative hidden bg-muted md:flex items-center justify-center bg-white">
                        <img
                        src="/logo.png"
                        alt="Image"
                        // className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        height={300}
                        width={300}
                        />
                    </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                    and <a href="#">Privacy Policy</a>.
                </div>
                </div>
        </div>
    </div>
  )
}
