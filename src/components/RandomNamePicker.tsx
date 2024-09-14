"use client"

import { EntryProps } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import RandomRoller from 'react-random-roller';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import WinnerDialog from './dialog/WinnerDialog';

function RandomNamePicker({
    data
}: {data: EntryProps[]}) {
    const bgMusic = new Audio('/raffle-draw.mp3');
    // const [names, setNames] = useState<string[]>()
    const randomizerRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()
    const [message, setMessage] = useState("Click here to start")
    const [showWinner, setShowWinner] = useState(false)

    useEffect(()=>{
        bgMusic.play()
    }, [])

    // console.log(names)
  return (
    <>
        <div className='flex flex-col gap-4 bg-secondary py-9 px-6 rounded-lg'>
            <button onClick={()=>bgMusic.pause()}>Pause</button>
            <button onClick={()=>bgMusic.play()}>Play</button>
            <Button ref={randomizerRef} variant="secondary" className='text-[18px] lg:text-3xl p-16'>
                <RandomRoller duration={30000} list={data.map((item)=>{
                let names = []
                names.push(
                <pre>
                    <h1>{`${item.clientName} - ${item.raffleCode}`}</h1>
                    <p>{item.address}</p>
                    <p>Branch: {item.branch.branchName}</p>
                </pre>)
                return names
                })} message={message} />
            </Button>
            {/* <Button variant="default" className='p-6' onClick={()=>{
                if(randomizerRef.current){
                    alert("ok")
                    randomizerRef.current?.click()
                }
            }}>Start</Button> */}
            <Button variant="outline" onClick={()=>window.location.href = "/dashboard/raffle"}>Reset</Button>
        </div>
    </>
  )
}

export default RandomNamePicker