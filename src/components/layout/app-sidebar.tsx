"use client"

import * as React from "react"
import {
  Boxes,
    ChartColumnIncreasing,
  ChevronsUpDown,
  HandCoins,
  House,
  Logs,
  Server,
  Settings,
  Settings2,
  TrendingUpDown,
  User,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useSession } from "next-auth/react"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import { NavMain } from "./nav-main"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Modems",
      url: "/modems",
      icon: House,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useSession(authOptions)
    const user = session.data?.user
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-20 items-center justify-center rounded-lg bg-white">
            <Image
                src="/logo.png"
                alt="logo"
                height={100}
                width={100}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              Modem Records
            </span>
            <span className="truncate text-xs">Dashboard</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
