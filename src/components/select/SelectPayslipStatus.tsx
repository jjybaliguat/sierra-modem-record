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

export enum PayslipStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED"
  }

export function SelectPayslipStatus({
    onSelectChange,
    selected
} : {
    onSelectChange: any,
    selected: PayslipStatus
}) {
  return (
    <Select value={selected} onValueChange={onSelectChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          {Object.values(PayslipStatus).map((type)=>(
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
