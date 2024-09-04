"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EntryProps } from "@/types"
import { deleteEntry, getSingleEntry } from "@/app/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { authOptions } from "@/lib/auth"
import EditDialog from "../dialog/EditDialog"

export const columns: ColumnDef<EntryProps>[] = [
  {
    id: "select",
    header: "Select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "raffleCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Raffle Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("raffleCode")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("clientName")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div>{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "branch",
    header: "Branch",
    accessorFn: (row) => row.branch.branchName,
    cell: ({ row }) => (
      <div>{row.getValue("branch")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div>{row.getValue("phone")}</div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           {/* <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem> */}
  //           <DropdownMenuSeparator />
  //           {/* <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem> */}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]

export function EntriesTable({
  data
}: {data: EntryProps[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [filterIndex, setFilterIndex] = React.useState(0)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const router = useRouter()
  const session = useSession(authOptions)
  const user = session.data?.user
  const [openEdit, setOpenEdit] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [singleEntry, setSingleEntry] = React.useState<any>(null)
  // let selectedIds = []

  React.useEffect(()=>{
    setSelectedIds((prevSelectedIds: any) => {
      // Create a new array based on the previous state
      const newSelectedIds: any = [];

      Object.entries(rowSelection).map(([key, value]) => {
        const keyAsNumber = Number(key);

        newSelectedIds.push(data[keyAsNumber].id)
      })
      
      // Object.keys(rowSelection).forEach(function (key: any, value) {
      //     // Avoid duplicates
      //     if (!newSelectedIds.includes(data[key].id)) {
      //         newSelectedIds.push(data[key].id);
      //     }
      // });
      
      return newSelectedIds;
  });

    // console.log('Updated selectedIds:', selectedIds);
  }, [rowSelection])

  React.useEffect(()=>{
    if(selectedIds.length == 1){
      getEntry()
    }
  }, [selectedIds])

  async function getEntry(){
    try {
      const data = await getSingleEntry(selectedIds[0])
      setSingleEntry(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteEntries(){
    try {
      const response: any = await deleteEntry(selectedIds)
      // console.log(response)
      if(response.error){
        toast.error('Something Went Wrong');
      }else{
        toast.success(`${selectedIds.length > 1 ? "Entries" : "Entry"} deleted successfully!`);
      }
      setRowSelection({})
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <>
    <div className="w-full">
        <div className="flex justify-center">
            <h1 className="text-xl font-bold">Raffle Entries</h1>
        </div>
      <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter By <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuCheckboxItem
                className="capitalize"
                checked={filterIndex === 0}
                onCheckedChange={()=>setFilterIndex(0)}
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="capitalize"
                checked={filterIndex === 1}
                onCheckedChange={()=>setFilterIndex(1)}
              >
                Branch
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {filterIndex === 0 ? (
              <Input
              placeholder="Search by name"
              value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("clientName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          ) : (
            <Input
              placeholder="Search by branch"
              value={(table.getColumn("branch")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("branch")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {selectedIds.length > 0 &&
        <div className="flex items-center gap-2 mb-4">
        <Button variant="destructive" size="sm" onClick={deleteEntries}>Delete</Button>
        {/* <Button size="sm">Print</Button> */}
        {selectedIds.length == 1 && <EditDialog setSingleEntry={setSingleEntry} data={singleEntry} />}
        </div>
      }
      <div className="rounded-md border text-neutral-300">
        <Table>
          <TableHeader>
            {data && table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if(cell.column.id === "select"){
                      if((row.getValue('branch')) === user?.branchName){
                        return (
                          <TableCell key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                        )
                      }else{
                        return <TableCell key={cell.id}
                        >
                        </TableCell>
                      }
                    }else{
                      return (
                        <TableCell key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                      )
                    }
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}
