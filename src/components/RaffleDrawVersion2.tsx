"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import Confetti from 'react-confetti'
import WinnerDialog from './dialog/WinnerDialog';
import { getCounter, getEntriesCount, getWinner } from '@/app/actions';
import { EntryProps } from '@/types';
import IntroVideoDialog from './dialog/IntroVideoDialog';

function RaffleDrawVersion2({
    entries
} : { entries : EntryProps[] }) {
    // const [bgAudio, setBgAudio] = useState<any>(null)
    // const [drawAudio, setDrawAudio] = useState<any>(null)
    // const [applause, setApplauseAdio] = useState<any>(null)
    const winnerBtnRef = useRef<any>(null)
    const videoBtnRef = useRef<any>(null)
    const [isStarted, setIsStarted] = useState(false)
    const [randomNumber, setRandomNumber] = useState<string>('0000');
    const [windowDimension, setWindowDimension] = useState<any | null>()
    const [showConfetti, setShowConfetti] = useState(false)
    const [showWinner, setShowWinner] = useState(false)
    const [winner, setWinner] = useState<EntryProps | null>()
    const [totalEntries, setTotalEntries] = useState<number | null>()
    const [counter, setCounter] = useState<number | null>()
    let bgAudio = null
    let drawAudio = null
    let applauseAudio = null
    if(document !== undefined){
        bgAudio = document?.getElementById('bg-audio') as HTMLAudioElement
        drawAudio = document?.getElementById('draw-audio') as HTMLAudioElement
        applauseAudio = document?.getElementById('applause-audio') as HTMLAudioElement
    }

    useEffect(()=>{
        // setApplauseAdio(new Audio('/applause.mp3'))
        if(bgAudio?.paused){
            bgAudio.play()
        }
        if(videoBtnRef){
            videoBtnRef.current.click()
        }
        if(window !== undefined){
            setWindowDimension({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
    }, [])

    // useEffect(()=>{
    //     if(bgAudio){
    //         bgAudio.play()
    //     }
    // }, [bgAudio])

    const handleGetRandomNumber = () => {
        if(totalEntries && counter){
            bgAudio?.pause()
            drawAudio?.play()
            setIsStarted(true)

            const interval = setInterval(() => {
                const number = Math.floor(1 + Math.random() * counter);
                const paddedNumber = number.toString().padStart(4, '0'); // Pad to 4 digits
                setRandomNumber(paddedNumber);
              }, 50); // Update every 100ms
        
              const timeout = setTimeout(() => {
                clearInterval(interval); // Stop after 8 seconds
                bgAudio?.play()
                applauseAudio?.play()
                setIsStarted(false)
                setShowConfetti(true)
              }, 5000);
    
          
              return () => {
                clearInterval(interval);
                clearTimeout(timeout);
              };
        }
    }

    
    useEffect(()=>{
        if(!isStarted && randomNumber !== '0000'){
            getSingleEntry(randomNumber)
        }
    }, [randomNumber])

    const getSingleEntry = async(code: string) => {
        try {
            const entry: any = await getWinner(code)
            setWinner(entry)
            if(winnerBtnRef){
                setTimeout(()=>{
                    winnerBtnRef?.current.click()
                }, 1000)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getCount = async() => {
            const count: any = await getEntriesCount()
            const counter: any = await getCounter()
            setTotalEntries(count)
            setCounter(counter)
        }

        return () => {
            getCount()
        }
    }, [])

  return (
    <>
    <audio id="bg-audio" controls autoPlay className='hidden'>
        <source src="/raffle-draw.mp3" type="audio/mp3" />
    </audio>
    <audio id="draw-audio" controls className='hidden'>
        <source src="/draw.mp3" type="audio/mp3" />
    </audio>
    <audio id="applause-audio" controls className='hidden'>
        <source src="/applause.mp3" type="audio/mp3" />
    </audio>
    <IntroVideoDialog btnRef={videoBtnRef} />
    {<WinnerDialog winner={winner} btnRef={winnerBtnRef} />}
    {showConfetti && <Confetti className='z-50' width={windowDimension?.width} height={windowDimension?.height} />}
            <h1>{totalEntries? totalEntries : "..."} Total Entries</h1>
        <div className='flex flex-col gap-12 mt-6 items-center'>
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
                <button disabled={!counter || !totalEntries || isStarted} className='rounded-full p-6 bg-primary' onClick={()=>{handleGetRandomNumber(); setShowConfetti(false)}}>{(!counter || !totalEntries) ? "Please Wait" : "Start"}</button>
            </div>
            <div className='flex items-center gap-4'>
                <button 
                className='rounded-full p-6 bg-muted'
                onClick={()=>bgAudio?.pause()}>Pause Music</button>
                <button
                className='rounded-full p-6 bg-primary'
                onClick={()=>{
                    bgAudio?.play()
                }}>Play Music</button>
            </div>
        </div>
    </>
  )
}

export default RaffleDrawVersion2