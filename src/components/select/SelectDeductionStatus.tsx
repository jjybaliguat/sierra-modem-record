// import * as React from "react"

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Device } from "@/types/device"
// import { DeductionStatus, DeductionType } from "@prisma/client"

// export function SelectDeductionStatus({
//     onSelectChange,
//     selected
// } : {
//     onSelectChange: (value: DeductionStatus) => void,
//     selected: DeductionStatus
// }) {
//   return (
//     <Select value={selected} onValueChange={onSelectChange}>
//       <SelectTrigger className="w-[100px]">
//         <SelectValue placeholder="Type" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Type</SelectLabel>
//           {Object.values(DeductionStatus).map((status)=>(
//             <SelectItem key={status} value={status}>{status}</SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   )
// }
