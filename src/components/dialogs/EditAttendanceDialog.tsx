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
import { Attendance } from "@/types/attendance"

export function EditAttendanceDialog({
    attendance
} : {
    attendance: Attendance
}) {
    // Helper function to parse date and time separately
    const parseDate = (isoString: string | null) => isoString ? new Date(isoString).toISOString().split("T")[0] : "";
    const parseTime = (isoString: string | null) => {
      if (!isoString) return ""; // Handle null timeOut
      const timePart = new Date(isoString).toISOString().split("T")[1];
      return timePart.substring(0, 8); // Extract HH:mm:ss
    };

  // Function to combine date & time and return UTC format
  const formatToUTC = (dateString: string, timeString: string) => {
    const date = new Date(dateString + "T" + timeString + "Z");
    return date.toISOString(); // Ensure UTC format
  };

    const [dateIn, setDateIn] = useState(parseDate(attendance.timeIn))
    const [dateOut, setDateOut] = useState(parseDate(attendance.timeOut))
    const [timeIn, setTimeIn] = useState(parseTime(attendance.timeIn))
    const [timeOut, setTimeOut] = useState(parseTime(attendance.timeOut))
    const [submitting, setSubmitting] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    
    async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      setSubmitting(true)
      const newTimeInUTC = formatToUTC(dateIn, timeIn);
      const newTimeOutUTC = formatToUTC(dateOut, timeOut);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
        setSubmitting(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/protected/attendance?id=${attendance.id}`, {
            method: "PATCH",
            body: JSON.stringify({timeIn: newTimeInUTC,  timeOut: newTimeOutUTC})
        })
        const data = await response.json()

        if(data.error){
          toast("ERROR!", {
            description: data.error,
            duration: 3000,
          })
        }else{
        setSubmitting(false)
        if(buttonRef.current){
            buttonRef?.current.click()
        }
        toast("Success", {
            description: `Attendance has been updated`,
            duration: 3000,
          })
         mutate("getAttendance")
        }
    } catch (error: any) {
        console.log(error)
        setSubmitting(false)
        toast("ERROR!", {
          description: error.error,
          duration: 3000,
        })
    }
  }
     
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance ({attendance.employee.fullName.split(" ")[0]})</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-2">
                <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                        {/* Time In Section */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Time In</label>
                            <Input type="date" value={dateIn} onChange={(e) => setDateIn(e.target.value)} />
                            <Input type="time" step="1" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} />
                        </div>

                        {/* Time Out Section */}
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-sm font-medium">Time Out</label>
                            <Input type="date" value={dateOut} onChange={(e) => setDateOut(e.target.value)} />
                            <Input type="time" step="1" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-4 mt-8">
                    <DialogClose ref={buttonRef}>
                    Cancel
                    </DialogClose>
                    <Button type="submit" disabled={submitting}>{submitting? "Updating..." : "Update"}</Button>
                </div>
            </form>
      </DialogContent>
    </Dialog>
  )
}
