"use client"

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

function CustomLink({
    href,
    spa
}: {href: string, spa: boolean}) {
  return (
    <>
    {spa? (
      <Link href={href}><Button onClick={()=>window.location.href = "/dashboard"}>Back to Dashboard</Button></Link>
    ) : (
      <Button onClick={()=>window.location.href = "/dashboard"}>Back to Dashboard</Button>
    )
    }
    </>
  )
}

export default CustomLink