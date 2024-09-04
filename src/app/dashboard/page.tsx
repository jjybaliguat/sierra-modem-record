import CreateEntriesForm from '@/components/CreateEntriesForm'
import { EntriesTable } from '@/components/Table/EntriesTable'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { getEntries, getEntriesCount } from '../actions'
import LogoutBtn from '@/components/btn/LogoutBtn'

async function Dashboard() {
    const user: any = await getServerSession(authOptions)
    // console.log(user)
    const entries: any = await getEntries()
    const entriesCount: any = await getEntriesCount()
    // console.log(entriesCount)
    // console.log(entries)
  return (
    <div className='min-h-screen'>
        <div className='container mx-auto md:py-12 py-4 px-4'>
            <div className='flex items-center gap-2 justify-center'>
                <Image
                    src="/sierra-logo.png"
                    alt='sierra-logo'
                    height={60}
                    width={80}
                />
                <h1 className='text-center text-2xl font-bold uppercase'>Raffle Entries</h1>
            </div>
            <div className='mt-4 flex justify-center'>
                <h1 className='text-xl tracking-wide'>Welcome Sierra <span className='text-[#0eb0c2] font-bold'>{user.user.branchName}</span></h1>
            </div>
            <div className='flex justify-center mt-4'>
                <LogoutBtn />
            </div>
            {/* <div className='flex justify-center mt-10'>
                <div className='flex items-center gap-2'>
                    <Button size="sm">Generate Raffle Tickets</Button>
                </div>
            </div> */}
            <div className='grid grid-cols-12 mt-10 gap-8'>
                <div className='block lg:hidden col-span-12 lg:col-span-4'>
                    <CreateEntriesForm />
                </div>
                <div className='col-span-12 lg:col-span-8'>
                    <EntriesTable entriesCount={entriesCount} data={entries} />
                </div>
                <div className='hidden lg:block col-span-12 lg:col-span-4'>
                    <CreateEntriesForm />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard