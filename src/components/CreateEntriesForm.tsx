"use client"

import React, { ReactElement, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { createEntry } from '@/app/actions'
import { useSession } from 'next-auth/react'
import { authOptions } from '@/lib/auth'

function CreateEntriesForm() {
    const session = useSession(authOptions)
    const user = session.data?.user
    const [formData, setFormData] = useState({
        clientName: '',
        address: '',
        phone: ''
    })
    const [numEntries, setNumEntries] = useState(0)

   async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const data = await createEntry({
                ...formData,
                branchId: user?.id,
                numEntries
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-full p-4 rounded-md'>
        <div className='flex justify-center'>
            <h1 className='text-xl font-bold'>Create New Entry</h1>
        </div>
        <div className='bg-black py-6 px-4 rounded-lg mt-4'>
            <form onSubmit={handleSubmit}>
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='clientName'>Client Name</Label>
                        <Input
                            name='clientName'
                            // placeholder='Client Name'
                            type='text'
                            value={formData.clientName}
                            onChange={(e)=>setFormData({...formData, clientName: e.target.value})}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='address'>Client Address</Label>
                        <Input
                            name='address'
                            // placeholder='Client Address'
                            type='text'
                            value={formData.address}
                            onChange={(e)=>setFormData({...formData, address: e.target.value})}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <Input
                            name='phone'
                            // placeholder='Client Name'
                            type='text'
                            value={formData.phone}
                            onChange={(e)=>setFormData({...formData, phone: e.target.value})}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='phone'>Number of Entries</Label>
                        <Input
                            
                            // placeholder='Client Name'
                            type='number'
                            value={numEntries}
                            onChange={(e)=>setNumEntries(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div className='flex justify-end'>
                        <Button type='submit'>Submit</Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateEntriesForm