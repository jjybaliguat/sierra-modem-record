import React from 'react'
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ThemeToggle } from '@/components/ThemeToggler'
import { Notifications } from '@/components/popover/Notifications'
import HeaderBreadCrumb from '@/components/layout/HeaderBreadCrumb'
import DateTime from '@/components/DateTime'
import { AppSidebar } from '@/components/layout/app-sidebar'

const RootLayout = ({
    children
}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <SidebarInset className='overflow-hidden'>
        <div className='sticky top-0 bg-background'>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-50">
            <div className="w-full pr-4 flex justify-between items-center">
              <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  {/* <DateTime /> */}
              </div>
              <div className='flex items-center gap-4'>
                <Notifications />
                <ThemeToggle />
              </div>
            </div>
          </header>
        </div>
        <div className='py-6 px-2 bg-slate-100 dark:bg-neutral-800 min-h-screen'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default RootLayout