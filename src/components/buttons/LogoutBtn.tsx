"use client"
import React from 'react'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

const LogoutBtn = () => {
  return (
    <Button variant="destructive" onClick={async()=>{
        await signOut()
    }}>
      <LogOut />
    </Button>
  )
}

export default LogoutBtn