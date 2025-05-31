import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "LOGPAY | Check Attendance",
  description: "Check your attendance logs with ease.",
};

const Layout = ({children} : {children: ReactNode}) => {
  return (
    <>
    {children}
    </>
  )
}

export default Layout