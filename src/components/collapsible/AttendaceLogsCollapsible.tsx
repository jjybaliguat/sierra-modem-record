"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Attendance } from "@/types/attendance"
import { formatDate } from "@/utils/formatDate"
import { format } from "date-fns";

export function AttendanceLogsCollapsible({
    attendanceLogs
} : {
    attendanceLogs: Attendance[]
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="max-w-lg space-y-2"
    >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              View Attendance Logs
            </h4>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </Button>
        </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 max-h-[200px] overflow-y-auto">
        {attendanceLogs?.map((attendance)=>(
          <div key={attendance.employee.id}>
            <p className="text-[14px]">{formatDate(attendance.timeIn)}</p>
            <p className="text-[14px">TimeIn: <span className="text-primary">{format(attendance.timeIn, "pp")}</span></p>
            <p className="text-[14px">TimeOut: <span className="text-primary">{format(attendance.timeOut, "pp")}</span></p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
