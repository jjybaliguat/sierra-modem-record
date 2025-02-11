import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { Badge } from "../ui/badge"

export function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" variant="outline">
            <Bell />
            <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white">10</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Latest Transactions</h4>
          </div>
          <div className="grid gap-2">
            
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
