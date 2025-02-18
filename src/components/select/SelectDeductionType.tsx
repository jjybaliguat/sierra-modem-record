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
import { DeductionType } from "@prisma/client"

export function SelectDeductionType({
    onSelectChange
} : {
    onSelectChange: any
}) {
  return (
    <Select onValueChange={onSelectChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          {Object.values(DeductionType).map((type)=>(
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
