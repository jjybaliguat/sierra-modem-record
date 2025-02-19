"use client"

import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BackButton = () => {
    const router = useRouter()

  return (
    <Button variant="outline" className='w-fit' onClick={()=>router.back()}><ArrowLeft /> Back</Button>
  )
}

export default BackButton