"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Confetti from 'react-confetti'
import WinnerDialog from './dialog/WinnerDialog';

function RaffleDrawVersion2() {
    const [bgAudio, setBgAudio] = useState<any>(null)
    const [drawAudio, setDrawAudio] = useState<any>(null)
    const [isStarted, setIsStarted] = useState(false)
    const [randomNumber, setRandomNumber] = useState<string>('0000');
    const [windowDimension, setWindowDimension] = useState<any | null>()
    const [showConfetti, setShowConfetti] = useState(false)
    const [showWinner, setShowWinner] = useState(false)

    useEffect(()=>{
        setBgAudio(new Audio('/raffle-draw.mp3'))
        setDrawAudio(new Audio('/draw.mp3'))
        if(window !== undefined){
            setWindowDimension({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
    }, [])

    useEffect(()=>{
        if(bgAudio){
            bgAudio.play()
        }
    }, [bgAudio])

    const handleGetRandomNumber = () => {
        bgAudio.pause()
        drawAudio.play()
        setIsStarted(true)
        const interval = setInterval(() => {
            const number = Math.floor(1 + Math.random() * 2000);
            const paddedNumber = number.toString().padStart(4, '0'); // Pad to 4 digits
            setRandomNumber(paddedNumber);
          }, 50); // Update every 100ms
      
          const timeout = setTimeout(() => {
            clearInterval(interval); // Stop after 8 seconds
            setIsStarted(false)
            setShowConfetti(true)
            setShowWinner(true)
          }, 5000);

      
          return () => {
            clearInterval(interval);
            clearTimeout(timeout);
          };
    }

  return (
    <>
    {<WinnerDialog setShowWinner={setShowWinner} />}
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
                onClick={()=>bgAudio.pause()}>Pause Music</button>
                <button
                className='rounded-full p-6 bg-primary'
                onClick={()=>{
                    if(bgAudio.paused){
                        bgAudio.play()
                    }
                }}>Play Music</button>
            </div>
        </div>
    </>
  )
}

export default RaffleDrawVersion2