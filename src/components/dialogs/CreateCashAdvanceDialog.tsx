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
import useSWR, { mutate } from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Employees } from "@/types/employees"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { createEmployeeCashAdvance } from "@/app/actions"

export function CreateCashAdvanceDialog() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(null)
    const [creating, setCreating] = useState(false)
    const session = useSession()
    const router = useRouter()
    const {data: employees, isLoading} = useSWR(session?.data?.user.id? "getEmployee" : null, getEmployees)
    const [amount, setAmount] = useState(0)
    const buttonRef = useRef<HTMLButtonElement>(null)

    async function getEmployees(){
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/employee?id=${session?.data?.user.id? session.data.user.id : ""}`)
          
          const data = await response.json()
          // console.log(data)
          return data
        } catch (error) {
          console.log(error)
          return error
        }
      }

    async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      setCreating(true)
        try {
            const response: any = await createEmployeeCashAdvance(selectedEmployee?.id!, amount)

            console.log(response)

            if(response.amount){
                if(buttonRef.current){
                    buttonRef?.current.click()
                }
                setCreating(false)
                toast("Success", {
                    description: `You successfully created a cash advance`,
                    duration: 3000,
                  })
                  mutate("getCashAdvance")
                }else if(response.count >= 1){
                    setCreating(false)
                    if(buttonRef.current){
                        buttonRef?.current.click()
                    }
                    toast("Success", {
                        description: `You successfully updated a cash advance`,
                        duration: 3000,
                      })
                      mutate("getCashAdvance")
                }else{
                    setCreating(false)
                    toast("Error", {
                        description: `Error creating cash advance.`,
                        duration: 3000,
                      })
                }
        } catch (error) {
            setCreating(false)
            console.log(error)
            toast("Error", {
                description: `Something went wrong.`,
                duration: 3000,
              })
        }
  }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Cash Advance</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
            <div className="flex items-center gap-2">
                <h1>Select Employee: </h1>
                {employees && <Select value={selectedEmployee?.id} onValueChange={(value)=>setSelectedEmployee(employees.find((employee: Employees)=>employee.id === value) || null)}>
                  <SelectTrigger
                    className="w-[160px] rounded-lg"
                    aria-label="Select employee"
                  >
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {!isLoading && employees && employees?.map((employee: Employees)=>(
                      <SelectItem key={employee.id} value={employee.id} className="rounded-lg">
                        {employee.fullName.split(" ")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>}
            </div>
            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} />
            </div>
            <div>
                <p className="text-sm">After submitting, the amount will be added to employee's existing cash advance balance.</p>
            </div>

            <DialogFooter>
                <DialogClose ref={buttonRef}>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={onSubmit} disabled={!selectedEmployee || creating}>{creating? "Submitting..." : "Submit"}</Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
