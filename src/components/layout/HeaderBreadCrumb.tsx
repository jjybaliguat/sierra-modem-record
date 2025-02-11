"use client"

import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'

type Props = {}

const HeaderBreadCrumb = (props: Props) => {
    const pathname = usePathname()
    const paths = pathname.split("/").slice(1)
    
  return (
    <>
    <Breadcrumb>
        <BreadcrumbList>
            {paths.map((path, index)=> (
                <div key={path}>
                    <BreadcrumbItem className="">
                        <BreadcrumbLink href={`/${index == 0 ? path : `dashboard/${path}`}`} className='capitalize'>
                            {path}
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                    {index < (paths.length - 1) && (<BreadcrumbSeparator className="" />) }
                </div>
            ))}
        </BreadcrumbList>
    </Breadcrumb>
    </>
  )
}

export default HeaderBreadCrumb