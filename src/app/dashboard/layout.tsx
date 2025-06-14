import React from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ThemeToggle } from '@/components/ThemeToggler'
import Image from 'next/image'
import LogoutBtn from '@/components/buttons/LogoutBtn'

const RootLayout = async({
    children
}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      <Toaster position='top-right' />
      {/* <AppSidebar /> */}
      <SidebarInset className='overflow-hidden'>
        <div className='sticky top-0 bg-background'>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-50">
            <div className="w-full pr-4 flex justify-between items-center">
              <div className="flex aspect-square size-20 items-center justify-center rounded-lg">
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
              {/* <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <DateTime />
              </div> */}
              <div className='flex items-center gap-4'>
                {/* <Notifications /> */}
                <LogoutBtn />
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