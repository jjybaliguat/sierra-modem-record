import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Device } from "@/types/device"

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export function SelectEmployeeStatus({
    onSelectChange,
    selected
} : {
    onSelectChange: (value: Boolean) => void,
    selected: EmployeeStatus
}) {


    const HandleChange = (status: EmployeeStatus) => {
        if(status === EmployeeStatus.ACTIVE){
            onSelectChange(true)
        }else{
            onSelectChange(false)
        }
    }

  return (
    <Select value={selected} onValueChange={(status: EmployeeStatus) => HandleChange(status)}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {Object.values(EmployeeStatus).map((status)=>(
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
