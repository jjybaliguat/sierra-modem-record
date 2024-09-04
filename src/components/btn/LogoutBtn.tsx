"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'

function LogoutBtn() {
  return (
    <Button variant="destructive" onClick={async()=>await signOut()}>LogOut</Button>
  )
}

export default LogoutBtn