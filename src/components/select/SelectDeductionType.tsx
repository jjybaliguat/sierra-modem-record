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
// import { DeductionType } from "@prisma/client"

// export function SelectDeductionType({
//     onSelectChange,
//     selected
// } : {
//     onSelectChange: (value: DeductionType) => void,
//     selected: DeductionType | ""
// }) {
//   return (
//     <Select value={selected} onValueChange={onSelectChange}>
//       <SelectTrigger className="w-[100px]">
//         <SelectValue placeholder="Type" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Type</SelectLabel>
//           {Object.values(DeductionType).map((type)=>(
//             <SelectItem key={type} value={type}>{type}</SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   )
// }
