"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { format, isWithinInterval, parseISO } from "date-fns"
import { saveAs } from "file-saver"
import { Pagination } from "@/components/ui/pagination"

interface ModemLog {
  id: string
  modemId: string
  message: string
  userId: string
  createdAt: string
  User: {
    name: string
    email: string
  }
  Modem: {
    serial: string | null
    type: string
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ITEMS_PER_PAGE = 10

export default function ModemLogsPage() {
  const [search, setSearch] = useState("")
  const {data: logs = []} = useSWR<ModemLog[]>("/api/logs", fetcher)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const filteredLogs = logs
    .filter(log =>
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.User.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(log => {
      if (!startDate && !endDate) return true
      const logDate = parseISO(log.createdAt)
      const from = startDate ? parseISO(startDate) : undefined
      const to = endDate ? parseISO(endDate) : undefined
      return isWithinInterval(logDate, {
        start: from ?? logDate,
        end: to ?? logDate,
      })
    })

    const pageCount = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)

    const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const exportToCSV = () => {
    const csv = [
      ["Message", "Modem Serial", "User Name", "User Email", "Timestamp"],
      ...filteredLogs.map(log => [
        `"${log.message}"`,
        `"${log.Modem.serial ?? "N/A"}"`,
        `"${log.User.name}"`,
        `"${log.User.email}"`,
        `"${format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}"`,
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `modem-logs-${Date.now()}.csv`)
  }

  const handleClearFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  }

return (
    <div className="px-6 py-2 space-y-6">
        <Button size="sm" variant="outline" onClick={()=>router.back()}><ArrowLeft /> Back</Button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📜 Modem Logs</h1>
        <Button onClick={exportToCSV}>Export CSV</Button>
      </div>

      <Card className="w-full">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Search message or user..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full md:w-1/3"
            />
            <Input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full md:w-1/4"
            />
            <Input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full md:w-1/4"
            />
            <Button variant="secondary" onClick={handleClearFilter}>Clear filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Modem Serial</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.Modem.serial ?? "N/A"}</TableCell>
                  <TableCell>
                    <div className="font-medium">{log.User.name}</div>
                    <div className="text-sm text-muted-foreground">{log.User.email}</div>
                  </TableCell>
                  <TableCell>{format(new Date(log.createdAt), "PPpp")}</TableCell>
                </TableRow>
              ))}
              {paginatedLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
    </div>
  )
}