'use client'

import { useEffect, useState } from 'react'
import { Modem, Client, ModemStatus, ModemCondition, ModemType, Photo, AssignType, DefectType } from '@prisma/client'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'
import { Plus, TrashIcon } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import useSWR, { mutate } from 'swr'
import { toast } from "sonner"
import { FloatingActions } from '@/components/FloatingActions'
import { formatDate } from '@/utils/formatDate'
import Image from 'next/image'
import Link from 'next/link'
import { DatePicker } from '@/components/DatePicker'
import { Portal } from "@radix-ui/react-portal"
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

const statusColor: Record<ModemStatus, string> = {
  AVAILABLE: 'bg-green-600',
  DISPATCHED: 'bg-yellow-600',
  ASSIGNED: 'bg-blue-600',
  DEFECTIVE: 'bg-red-600',
  PENDING_INSPECTION: 'bg-yellow-600'
}

type ModemWithClient = Modem & { client: Client | null }

const fetcher = (url: string) => fetch(url, {cache: "no-store"}).then(res => res.json())

type ModemDataProps = {
  type: ModemType,
  condition: ModemCondition,
  serial: string
}

const modemTypeLabels: Record<ModemType, string> = {
  IOT: "IoT",
  HUAWEI_5V5: "Huawei 5V5",
  CHINA_MOBILE: "China Mobile",
  VSOL: "VSOL",
  ZTE: "ZTE",
  TOWER: "Tower",
  KING_CRAB: "King Crab"
}

export default function DashboardPage() {
  const session = useSession()
  const userId = session.data?.user.id
  const { data: modems = [] } = useSWR<ModemWithClient[]>('/api/modems', fetcher)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [serialSearch, setSerialSearch] = useState('')
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [openUnAssignDialog, setOpenUnAssignDialog] = useState(false)
  const [openDispatchDialog, setOpenDispatchDialog] = useState(false)
  const [openReturnDialog, setOpenReturnDialog] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openAdjustDialog, setOpenAdjustDialog] = useState(false)
  const [openImageViewer, setOpenImageViewer] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Photo>({
    id: '',
    webViewLink: '',
    webContentLink: ''
  })
  const [selectedModem, setSelectedModem] = useState<ModemWithClient | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  const [modemData, setModemData] = useState<ModemDataProps>({
    type: ModemType.IOT,
    condition: ModemCondition.SECOND_HAND,
    serial: ""
  })
  const [clientData, setClientData] = useState({
    name: '',
    address: '',
    pppoeAcc: '',
    dispatchImage: '',
    assignType: '',
    assignedDate: new Date(),
    remarks: ''
  })
  const [dispatchData, setDispatchData] = useState({
    dispatchedTo: '',
    dispatchedDate: new Date()
  })
  const [returnData, setReturnData] = useState({
    condition: '',
    remark: ''
  })
  const [adjustData, setAdjustData] = useState({
    type: '',
    remark: '',
    defectType: ""
  })
  const [unAssignReason, setUnassignReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [modemToDelete, setModemToDelete] = useState<ModemWithClient | null>(null)
  const [file, setFile] = useState<any | null>()

  const filtered = modems.filter(m => {
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter
    const matchesSerial = m.serial?.toLowerCase().includes(serialSearch.toLowerCase())
    return matchesStatus && matchesSerial
  })

  const pageCount = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleAssign = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData();
      if(file){
        formData.append("file", file)
      }
      const response: any = await fetch('/api/upload-drive', {
          method: 'POST',
          body: formData,
      });
      const uploadedPhoto = await response.json()
      if(response.ok){
        setClientData({...clientData, dispatchImage: uploadedPhoto})
          const response = await fetch(`/api/client?userId=${userId}`, {
            method: "POST",
            body: JSON.stringify({
              ...clientData,
              dispatchImage: uploadedPhoto,
              assignedDate: format(clientData.assignedDate, "yyyy-MM-dd"),
              modemId: selectedModem?.id
            })
          })
          const data = await response.json()
          if(response.ok){
            setSubmitting(false)
            setFile(null)
            toast("Modem has been assigned", {
                description: `You successfully assigned ${selectedModem?.serial} to client ${clientData.name}`,
                duration: 3000,
            })
            setClientData({
              name: '',
              address: '',
              pppoeAcc: '',
              dispatchImage: '',
              assignType: '',
              assignedDate: new Date(),
              remarks: ''
            })
            mutate("/api/modems")
            setOpenAssignDialog(false)
          }else{
            setSubmitting(false)
            toast("Error", {
                description: data.message,
                duration: 3000,
            })
          }
      }else{
        setSubmitting(false)
        toast("Error uploading image.", {
            description: "Something went wrong while uploading image. please try again later",
            duration: 3000,
        })
      }
    } catch (error) {
      console.log(error)
      setSubmitting(false)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleUnAssign = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/client?modemId=${selectedModem?.id}&userId=${userId}`, {
        method: "DELETE",
        body: JSON.stringify({
          reason: unAssignReason
        })
      })
      const data = await response.json()
      if(response.ok){
        setSubmitting(false)
        setUnassignReason('')
        toast("Modem has been Unassigned", {
            description: `You successfully Unassigned ${selectedModem?.serial} to client ${clientData.name}`,
            duration: 3000,
        })
        mutate("/api/modems")
        setOpenUnAssignDialog(false)
      }else{
        setSubmitting(false)
        toast("Error", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      console.log(error)
      setSubmitting(false)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleAddModem = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/modems?userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(modemData)
      })
      const data = await response.json()
      if(response.ok){
        setSubmitting(false)
        toast("Modem has been added", {
            description: `You successfully added ${modemData.type} modem`,
            duration: 3000,
        })
        setModemData({
          type: modemData.type,
          condition: modemData.condition,
          serial: ""
        })
        mutate("/api/modems")
      }else{
        setSubmitting(false)
        toast("Error!", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      setSubmitting(false)
      console.log(error)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleDeleteModem = async() => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/modems?id=${modemToDelete?.id}`, {
        method: "DELETE",
      })
      
      const data = await response.json()

      if(response.ok){
        setSubmitting(false)
        setOpenDeleteDialog(false)
        toast("Modem has been deleted", {
            description: `You successfully deleted ${modemToDelete?.serial} modem`,
            duration: 3000,
        })
        mutate("/api/modems")
      }else{
        setSubmitting(false)
        toast("Error!", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      setSubmitting(false)
      console.log(error)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleDispatch = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/modems?id=${selectedModem?.id}&userId=${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: ModemStatus.DISPATCHED,
          dispatchedDate: format(dispatchData.dispatchedDate, "yyyy-MM-dd"),
          dispatchedTo: dispatchData.dispatchedTo
        })
      })
      const data = await response.json()
      if(response.ok){
        setSubmitting(false)
        toast("Modem has been dispatched", {
            description: `You successfully dispatch ${modemData.type} modem to ${dispatchData.dispatchedTo}`,
            duration: 3000,
        })
        setDispatchData({
          dispatchedDate: new Date(),
          dispatchedTo: ''
        })
        setOpenDispatchDialog(false)
        mutate("/api/modems")
      }else{
        setSubmitting(false)
        toast("Error!", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      setSubmitting(false)
      console.log(error)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleReturnModem = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/modem-return?id=${selectedModem?.id}&userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(returnData)
      })

      const data = await response.json()
      if(response.ok){
        setSubmitting(false)
        toast("Modem has been returned", {
            description: `You successfully ${returnData.condition === "GOOD"? "return" : "mark"} ${selectedModem?.serial} modem ${returnData.condition === "GOOD"? "to stock" : "as defective"}`,
            duration: 3000,
        })
        setOpenReturnDialog(false)
        setReturnData({
          condition: "",
          remark: ""
        })
        mutate("/api/modems")
      }else{
        setSubmitting(false)
        toast("Error!", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      setSubmitting(false)
      console.log(error)
      toast("Internal Server Error", {
            description: "Something went wrong, please try again later.",
            duration: 3000,
        })
    }
  }

  const handleAdjustModem = async(e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/modem-adjust?id=${selectedModem?.id}&userId=${userId}`, {
        method: "POST",
        body: JSON.stringify(adjustData)
      })
      const data = await response.json()
      if(response.ok){
        setSubmitting(false)
        toast("Modem has been adjusted", {
            description: `You successfully adjust modem to ${adjustData.type}`,
            duration: 3000,
        })
        setAdjustData({
          type: "",
          remark: "",
          defectType: ''
        })
        setOpenAdjustDialog(false)
        mutate("/api/modems")
      }else{
        setSubmitting(false)
        toast("Error", {
            description: data.message,
            duration: 3000,
        })
      }
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Welcome {session.data?.user.name}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Link href="/dashboard/logs" className='underline text-md text-blue-600'>View Logs</Link>
          <Input placeholder="Search serial" value={serialSearch} onChange={e => setSerialSearch(e.target.value)} className="w-[200px]" />
          <Select onValueChange={setStatusFilter} defaultValue="ALL">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {Object.values(ModemStatus).map((value)=> (
                <SelectItem key={value} value={value}>{value.split("_").join(" ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Button onClick={() => setOpenAddDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Modem
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Modems */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Total Modems - <span className="text-2xl font-bold">{modems.length}</span></h2>
          <div className="space-y-1">
            {Object.values(ModemType).map((type) => {
                const count = modems.filter(m => m.type === type).length
                return (
                  <div key={type} className="flex justify-between text-sm text-muted-foreground">
                    <span>{modemTypeLabels[type]}</span>
                    <span>{count}</span>
                  </div>
                )
              })}
          </div>
        </Card>

        {/* Available + Type Breakdown */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Available Modems - <span className='text-xl font-bold mb-2'>{modems.filter(m => m.status === 'AVAILABLE' || m.status === "DISPATCHED").length}</span></h2>
          <div className="space-y-1">
            {Object.values(ModemType).map((type) => {
              const count = modems.filter(m => (m.status === 'AVAILABLE' || m.status === "DISPATCHED") && m.type === type).length
              return (
                <div key={type} className="flex justify-between text-sm text-muted-foreground">
                  <span>{modemTypeLabels[type]}</span>
                  <span>{count}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Dispatched */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Dispatched - <span className="text-2xl font-bold">{modems.filter(m => m.status === 'DISPATCHED').length}</span></h2>
          <div className="space-y-1">
            {Object.values(ModemType).map((type) => {
                const count = modems.filter(m => m.status === "DISPATCHED" && m.type === type).length
                return (
                  <div key={type} className="flex justify-between text-sm text-muted-foreground">
                    <span>{modemTypeLabels[type]}</span>
                    <span>{count}</span>
                  </div>
                )
              })}
          </div>
        </Card>

        {/* Assigned */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Assigned - <span className="text-2xl font-bold">{modems.filter(m => m.status === 'ASSIGNED').length}</span></h2>
          <div className="space-y-1">
            {Object.values(ModemType).map((type) => {
                const count = modems.filter(m => m.status === "ASSIGNED" && m.type === type).length
                return (
                  <div key={type} className="flex justify-between text-sm text-muted-foreground">
                    <span>{modemTypeLabels[type]}</span>
                    <span>{count}</span>
                  </div>
                )
              })}
          </div>
        </Card>
      </div>


      <div className="rounded-lg border overflow-auto bg-white dark:bg-black/60">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Serial</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Installer/Technician</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">DispatchedDate</th>
              <th className="px-4 py-2 text-left">AssignedDate</th>
              <th className="px-4 py-2 text-left">Remarks</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(modem => (
              <tr key={modem.id} className="border-t">
                <td className="px-4 py-2">{modem.serial || '-'}</td>
                <td className="px-4 py-2">{modem.type}</td>
                <td className="gap-2 px-4 py-2">
                  <Badge className={cn('text-white', statusColor[modem.status])}>{modem.status} {modem.status === "DEFECTIVE" && `- ${modem.defectType}`}</Badge>
                </td>
                <td className="px-4 py-2">{modem.dispatchedTo}</td>
                <td className="px-4 py-2">
                  {modem.client ? modem.client.name : '—'}
                </td>
                <td className="px-4 py-2">
                  {modem.client?.dispatchImage ? (
                    <div className='relative h-[50px] w-[50px] shadow-md cursor-pointer' onClick={()=>{setSelectedImage(modem.client?.dispatchImage!); setOpenImageViewer(true)} }>
                      <Image 
                        src={`https://drive.google.com/uc?export=view&id=${modem.client?.dispatchImage?.id}`}
                        alt="Installation photo"
                        fill
                        style={{
                          objectFit: "cover",
                          objectPosition: "center"
                        }}
                        className=""
                      />
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {modem.dispatchedDate? formatDate(modem.dispatchedDate) : "—"}
                </td>
                <td className="px-4 py-2">
                  {modem.client?.assignedDate? formatDate(modem.client?.assignedDate!) : "—"}
                </td>
                <td className="px-4 py-2">{modem.client? modem.client.remarks : modem.remarks? modem.remarks : "—"}</td>
                <td className="px-4 py-2">
                  <div className='flex items-center gap-2'>
                    {(modem.status === ModemStatus.AVAILABLE || modem.status === ModemStatus.DEFECTIVE || modem.status === ModemStatus.PENDING_INSPECTION) && (
                      <Button size="sm" variant="secondary" onClick={() => {setSelectedModem(modem); setOpenAdjustDialog(true)}}>Adjust</Button>
                    )}
                    {(modem.status === ModemStatus.DISPATCHED || modem.status === ModemStatus.ASSIGNED) && (
                      <Button size="sm" variant="secondary" onClick={() => {setSelectedModem(modem); setOpenReturnDialog(true)}}>Return</Button>
                    )}
                    {modem.status === ModemStatus.DISPATCHED && (
                      <Button size="sm" onClick={() => {setSelectedModem(modem); setOpenAssignDialog(true)}}>Assign</Button>
                    )}
                    {/* {modem.status === ModemStatus.ASSIGNED && (
                      <Button size="sm" onClick={() => {setSelectedModem(modem); setOpenUnAssignDialog(true)}}>Unassign</Button>
                    )} */}
                    {modem.status === ModemStatus.AVAILABLE && (
                      <Button size="sm" onClick={() => {setSelectedModem(modem); setOpenDispatchDialog(true)}}>Dispatch</Button>
                    )}
                    <Button variant="destructive" onClick={() => {setModemToDelete(modem); setOpenDeleteDialog(true)}}><TrashIcon /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />

      {/* Assignment Modal */}
      <Dialog open={openAssignDialog} onOpenChange={setOpenAssignDialog} modal={false}>
        {openAssignDialog && (
          <Portal>
            <div
              className="fixed inset-0 bg-black/50 z-[49] pointer-events-none"
              aria-hidden="true"
            />
          </Portal>
        )}
        <DialogContent className="overflow-visible z-50">
          <DialogHeader>
            <DialogTitle>Assign Modem - {selectedModem?.serial}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className='flex items-center gap-2'>
              <h1>Assigned Date</h1>
              <DatePicker date={clientData.assignedDate} onSelect={(value: Date)=>setClientData({...clientData, assignedDate: value})} />
            </div>
            <Select defaultValue="INSTALL" value={clientData.assignType} onValueChange={(value: AssignType)=>setClientData({...clientData, assignType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Assign Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INSTALL">INSTALL</SelectItem>
                <SelectItem value="CHANGE_MODEM">CHANGE MODEM</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Client Name"
              value={clientData.name}
              onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              required
            />
            <Input
              placeholder="PPPoE Account (optional)"
              value={clientData.pppoeAcc}
              onChange={(e) => setClientData({ ...clientData, pppoeAcc: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={clientData.address}
              onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              required
            />
             <Input
              placeholder="Remarks"
              value={clientData.remarks}
              onChange={(e) => setClientData({ ...clientData, remarks: e.target.value })}
            />

            {/* Drag & Drop Upload */}
            <div
              className="border border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) setFile(file)
              }}
              onClick={() => document.getElementById('client-upload')?.click()}
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                  className="mx-auto max-h-32 object-contain"
                />
              ) : (
                <p className="text-muted-foreground">Drag & drop image here or click to upload</p>
              )}
              <input
                id="client-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setFile(file)
                }}
              />
            </div>
            {submitting && <p>Uploading file may take some time. Please wait.</p>}
          </div>

          <DialogFooter>
            <Button disabled={submitting || !file} type="submit" onClick={handleAssign}>
              {submitting ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UnAssignment Modal */}
      <Dialog open={openUnAssignDialog} onOpenChange={setOpenUnAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unassign Modem - {selectedModem?.serial}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to Unassign modem to client {selectedModem?.client?.name}</p>
            <Input
              placeholder="Remark"
              value={unAssignReason}
              onChange={(e) => setUnassignReason(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="submit" onClick={()=>setOpenUnAssignDialog(false)}>Cancel</Button>
            <Button variant="destructive" disabled={submitting} type="submit" onClick={handleUnAssign}>{submitting? "Unassigning..." : "Unassign"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dispatch Modal */}
      <Dialog open={openDispatchDialog} onOpenChange={setOpenDispatchDialog} modal={false}>
        {openDispatchDialog && (
          <Portal>
            <div
              className="fixed inset-0 bg-black/50 z-[49] pointer-events-none"
              aria-hidden="true"
            />
          </Portal>
        )}
        <DialogContent className="overflow-visible z-50">
          <DialogHeader>
            <DialogTitle>Dispatch Modem - {selectedModem?.serial}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className='flex items-center gap-2'>
              <h1>Dispatch Date</h1>
              <DatePicker date={dispatchData.dispatchedDate} onSelect={(value: Date)=>setDispatchData({...dispatchData, dispatchedDate: value})} />
            </div>
            <Input placeholder="Team Name / Name" value={dispatchData.dispatchedTo} onChange={(e)=>setDispatchData({...dispatchData, dispatchedTo: e.target.value})} required />
          </div>

          <DialogFooter>
            <Button variant="outline" type="submit" onClick={()=>setOpenDispatchDialog(false)}>Cancel</Button>
            <Button disabled={submitting} type="submit" onClick={handleDispatch}>{submitting? "Please wait..." : "Dispatch"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modem Modal */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Modem</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input type='text' placeholder="Serial (optional)" value={modemData.serial} onChange={(e)=>setModemData({...modemData, serial: e.target.value})} />
            <Select defaultValue="IOT" value={modemData.type} onValueChange={(value: ModemType)=>setModemData({...modemData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Modem Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IOT">IOT</SelectItem>
                <SelectItem value="HUAWEI_5V5">HUAWEI 5V5</SelectItem>
                <SelectItem value="CHINA_MOBILE">CHINA MOBILE</SelectItem>
                <SelectItem value="VSOL">VSOL</SelectItem>
                <SelectItem value="ZTE">ZTE</SelectItem>
                <SelectItem value="TOWER">TOWER</SelectItem>
                <SelectItem value="KING_CRAB">KING CRAB</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="SECOND_HAND" value={modemData.condition} onValueChange={(value: ModemCondition)=>setModemData({...modemData, condition: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRAND_NEW">Brand New</SelectItem>
                <SelectItem value="SECOND_HAND">Second Hand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button disabled={submitting} type="submit" onClick={handleAddModem}>{submitting? "Adding..." : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Return Modem Modal */}
      <Dialog open={openReturnDialog} onOpenChange={setOpenReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Modem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReturnModem}>
            <div className="space-y-4">
              <Select required value={returnData.condition} onValueChange={(value: ModemCondition)=>setReturnData({...returnData, condition: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Modem Condition" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(['GOOD', 'DEFECTIVE', 'PENDING_INSPECTION']).map((value)=> (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Remark"
                value={returnData.remark}
                onChange={(e) => setReturnData({ ...returnData, remark: e.target.value })}
                required
              />
            </div>

            <div className='flex justify-end gap-2 mt-4'>
              <Button variant="outline" onClick={() => setOpenReturnDialog(false)}>Cancel</Button>
              <Button disabled={submitting || returnData.condition === "" || returnData.remark === ""} type="submit">{submitting? "Please wait..." : "Submit"}</Button>
            </div>
          </form>

          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button disabled={submitting} type="submit">{submitting? "Please wait..." : "Submit"}</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
      {/* Adjust Modem Modal */}
      <Dialog open={openAdjustDialog} onOpenChange={setOpenAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modem Adjustment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdjustModem}>
            <div className="space-y-4">
              <Select required value={adjustData.type} onValueChange={(value)=>setAdjustData({...adjustData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Adjustment Type" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedModem?.status === ModemStatus.DEFECTIVE || selectedModem?.status === ModemStatus.PENDING_INSPECTION) && <SelectItem value="AVAILABLE">Mark As Available</SelectItem>}
                  <SelectItem value="DEFECTIVE">Mark As Defective</SelectItem>
                  <SelectItem value="PENDING_INSPECTION">Move to Inspection</SelectItem>
                </SelectContent>
              </Select>
              {adjustData.type === "DEFECTIVE" && <Select required value={adjustData.defectType} onValueChange={(value)=>setAdjustData({...adjustData, defectType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Defect Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DefectType).map((value)=>(
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>}
              <Input
                placeholder="Remark"
                value={adjustData.remark}
                onChange={(e) => setAdjustData({ ...adjustData, remark: e.target.value })}
                required
              />
            </div>

            <div className='flex justify-end gap-2 mt-4'>
              <Button type="button" variant="outline" onClick={() => setOpenAdjustDialog(false)}>Cancel</Button>
              <Button disabled={submitting || adjustData.type === "" || (adjustData.type === "DEFECTIVE" && adjustData.defectType === "") || adjustData.remark === ""} type="submit">{submitting? "Please wait..." : "Submit"}</Button>
            </div>
          </form>

          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button disabled={submitting} type="submit">{submitting? "Please wait..." : "Submit"}</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

       {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Modem</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete modem <strong>{modemToDelete?.serial}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button disabled={submitting} variant="destructive" onClick={handleDeleteModem}>{submitting? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
       {/* View Image Dialog */}
      <Dialog open={openImageViewer} onOpenChange={setOpenImageViewer}>
        <DialogContent className="p-0 max-w-4xl">
          <DialogHeader className="p-4">
            <DialogTitle>Image Viewer</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-[70vh]">
            <Image 
              src={`https://drive.google.com/uc?export=view&id=${selectedImage.id}`}
              alt="Modem Image"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
              className="rounded-md"
            />
          </div>

          <DialogFooter className="p-4">
            <Button><Link href={selectedImage.webContentLink}>Download</Link></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FloatingActions setOpenAdd={setOpenAddDialog} setOpenAdjustment={()=>{}} />
    </div>
  )
}
