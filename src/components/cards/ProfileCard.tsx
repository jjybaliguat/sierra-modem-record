"use client"

import React from 'react'
import { useSession } from 'next-auth/react'

const ProfileCard = () => {
    const session = useSession()

    // console.log(session)
  return (
    <>

    </>
  )
}

export default ProfileCard