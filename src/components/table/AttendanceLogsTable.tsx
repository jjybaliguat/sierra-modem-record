import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { cn } from "@/lib/utils";
import { Attendance, AttendanceStatus } from "@/types/attendance"
import { formatDateTime } from "@/utils/formatDateTime";
import { format } from "date-fns";

  
  export function AttendanceLogsTable({
    attLogs
  } : {
    attLogs: Attendance[]
  }) {

    return (
      attLogs && attLogs.length > 0 ?
      <>
        <div className="flex flex-col gap-2 md:hidden">
          {attLogs.map((att)=>(
          <div key={att.id} className={cn({
            "rounded-md p-2 shadow-lg outline outline-1 outline-gray-100 dark:outline-gray-600": true,
            // "bg-amber-300 dark:bg-amber-600": !att.timeOut,
            // "bg-green-500 dark:bg-green-800": att.timeOut
          })}>
            <div className="flex items-center gap-4">
              <h1 className={cn({
              "font-medium text-xl": true,
              "text-amber-300 dark:text-amber-600": !att.timeOut,
              "text-green-500 dark:text-green-800": att.timeOut
            })}>{att.employee.fullName.split(" ")[0]}</h1>
              <p className={cn({
                "text-green-500 dark:text-green-800 text-[12px] font-bold": true,
              "text-rose-500": att.status === AttendanceStatus.ABSENT,
              "text-orange-700 dark:text-orange-500": att.status === AttendanceStatus.LATE,
              })}>{att.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[12px]">TimeIn: {formatDateTime(att.timeIn)}</p>
              <p className="text-[12px]">TimeOut: {att.timeOut && formatDateTime(att.timeOut)}</p>
            </div>
          </div>
        ))
        }
        </div>
        <div className="hidden md:block">
          <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">FingerId</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>TimeIn</TableHead>
              <TableHead>TimeOut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attLogs?.map((att: Attendance) => (
              <TableRow key={att.id} className={cn({
                "bg-amber-300 dark:bg-amber-600": !att.timeOut,
                "bg-green-500 dark:bg-green-800": att.timeOut
              })}>
                <TableCell className="font-medium">{att.fingerprintId}</TableCell>
                <TableCell>{att.employee.fullName.split(" ")[0]}</TableCell>
                <TableCell>{att.status}</TableCell>
                <TableCell>{formatDateTime(att.timeIn)}</TableCell>
                <TableCell>{att.timeOut && formatDateTime(att.timeOut)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {/* <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow> */}
          </TableFooter>
        </Table>
        </div>
      </>
       : 
      <div className="flex justify-center w-full">
        <h1 className="text-center text-xl">No Attendance logs as of now.</h1>
      </div>
    )
  }
  