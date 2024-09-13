"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Confetti from 'react-confetti'

function RaffleDrawVersion2() {
    const bgMusic = new Audio('/raffle-draw.mp3');
    const drawMusic = new Audio('/draw.mp3');
    const [isStarted, setIsStarted] = useState(false)
    const [randomNumber, setRandomNumber] = useState<string>('0000');
    const [windowDimension, setWindowDimension] = useState<any | null>()
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(()=>{
        bgMusic.play()
        if(window !== undefined){
            setWindowDimension({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
    }, [])

    const handleGetRandomNumber = () => {
        bgMusic.pause()
        drawMusic.play()
        setIsStarted(true)
        const interval = setInterval(() => {
            const number = Math.floor(1 + Math.random() * 1000);
            const paddedNumber = number.toString().padStart(4, '0'); // Pad to 4 digits
            setRandomNumber(paddedNumber);
          }, 100); // Update every 100ms
      
          const timeout = setTimeout(() => {
            clearInterval(interval); // Stop after 8 seconds
            setIsStarted(false)
            setShowConfetti(true)
          }, 5000);

      
          return () => {
            clearInterval(interval);
            clearTimeout(timeout);
          };
    }

  return (
    <>
    {showConfetti && <Confetti width={windowDimension?.width} height={windowDimension?.height} />}
        <div className='flex flex-col gap-12 mt-12 items-center'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{randomNumber[0]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{randomNumber[1]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{randomNumber[2]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{randomNumber[3]}</h1>
                    </div>
                </div>
                <button className='rounded-full p-6 bg-primary' onClick={()=>{handleGetRandomNumber(); setShowConfetti(false)}} disabled={isStarted}>Start</button>
            </div>
            <div className='flex items-center gap-4'>
                <button 
                className='rounded-full p-6 bg-muted'
                onClick={()=>bgMusic.pause()}>Pause Music</button>
                <button
                className='rounded-full p-6 bg-primary'
                onClick={()=>{
                    if(bgMusic.paused){
                        bgMusic.play()
                    }
                }}>Play Music</button>
            </div>
        </div>
    </>
  )
}

export default RaffleDrawVersion2