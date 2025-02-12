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

export function SelectDevice({
    setDeviceId,
    devices
}: {
    setDeviceId: any
    devices: Device[]
}) {
  return (
    <Select onValueChange={setDeviceId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select your device" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Device</SelectLabel>
          {devices.length == 0 && <h1>You do not have device yet.</h1>}
          {devices.map((device)=>(
            <SelectItem key={device.id} value={device.deviceId}>{device.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
