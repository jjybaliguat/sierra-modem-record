"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"

export function ToggleBioDeviceMode({
    onChange,
    disabled,
    checked
} : {
    onChange: any,
    disabled?: boolean
    checked?: boolean
}) {
    const [enrollmentMode, setEnrollmentMode] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch id="enroll-mode"
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor="enroll-mode">Toggle Biometric Device To Enrollment Mode</Label>
    </div>
  )
}
