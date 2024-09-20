"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EntryProps } from '@/types'
import Image from 'next/image'
import React, { useState } from 'react'
import { searchEntriesByName } from '../actions'
import { usePDF } from 'react-to-pdf'

function SearchEntries() {
    const [entries, setEntries] = useState<EntryProps[] | null>()
    const [number, setNumber] = useState('')
    const { toPDF, targetRef } = usePDF({filename: 'raffle-entries.pdf'});
    const [searching, setSearching] = useState(false)
    const phoneRegex = /^09\d{9}$/

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if(phoneRegex.test(number.trim())){
            setSearching(true)
            try {
                const response: any = await searchEntriesByName(number.trim())
                setSearching(false)
                setEntries(response)
            } catch (error) {
                console.log(error)
            }
        }else{
            alert("Invalid Phone Number!")
        }
    }

  return (
    <>
        <div className='container mx-auto min-h-screen py-12 px-4'>
            <div className="flex flex-col items-center gap-6">
                <div className='flex items-center gap-2 justify-center'>
                    <Image
                        src="/sierra-logo.png"
                        alt='sierra-logo'
                        height={60}
                        width={80}
                    />
                    <h1 className='text-center text-2xl font-bold uppercase'>Raffle Entries</h1>
                </div>
                <form onSubmit={handleSubmit} className='p-5 rounded-md w-[350px]'>
                    <Label htmlFor='searchEntry'>Search Raffle Ticket</Label>
                    <div className='flex items-center'>
                        <Input
                            id='searchEntry'
                            placeholder='Type your registered phone number'
                            type='text'
                            value={number}
                            onChange={(e)=>setNumber(e.target.value)}
                            required
                        />
                        <Button type='submit'>{searching ? "Searching..." : "Search"}</Button>
                    </div>
                </form>
                <div className='mt-12'>
                    {entries?.length == 0 && <h1>No Results Found!</h1>}
                    {entries && entries.length > 0 &&
                        <>
                            <h1 className='text-center'>Results</h1>
                            <div ref={targetRef} className='flex flex-wrap gap-2 p-8 justify-center'>
                                {entries.map((entry: EntryProps)=>(
                                    <div key={entry.id} className='relative w-[300px] h-[100px]'>
                                        <Image 
                                        src="/raffleticket.png"
                                        alt='raffle-ticket-layout'
                                        fill
                                        style={{
                                            objectFit: "cover",
                                            objectPosition: "center"
                                        }}
                                        className='w-full h-full'
                                        />
                                        <p className='absolute top-4 left-2 text-[8px]'>{entry.clientName}</p>
                                        <p className='absolute top-1/2 transform -translate-y-1 left-2 text-[8px]'>{entry.phone}</p>
                                        <p className='absolute bottom-3 left-2 text-[8px]'>{entry.address}</p>
                                        <p className='absolute bottom-1 left-1/2 right-1/2 text-[10px] transform text-black font-bold'>{entry.raffleCode}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default SearchEntries