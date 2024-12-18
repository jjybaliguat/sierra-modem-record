"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import Confetti from 'react-confetti'
import WinnerDialog from './dialog/WinnerDialog';
import { getCounter, getEntriesCount, getWinner } from '@/app/actions';
import { EntryProps } from '@/types';
import IntroVideoDialog from './dialog/IntroVideoDialog';
import { GearIcon } from '@radix-ui/react-icons';
import { useSettingsStore } from '@/lib/store/settings';
import SettingsDialog from './dialog/SettingsDialog';
import { useWinnersStore, WinType } from '@/lib/store/winners';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import WinnersDialog from './dialog/WinnersDialog';

function RaffleDrawVersion2({
    entries
} : { entries : EntryProps[] }) {
    const [bgAudio, setBgAudio] = useState<any>(null)
    const [drawAudio, setDrawAudio] = useState<any>(null)
    const [applauseAudio, setApplauseAdio] = useState<any>(null)
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
    const [digits, setDigits] = useState([0, 0, 0, 0])
    const [completed, setCompleted] = useState<boolean>(false);


    const {randomizerDelay} = useSettingsStore()
    const {addWinner, drawType, setDrawType} = useWinnersStore()

    useEffect(()=>{
        setApplauseAdio(new Audio('/applause.mp3'))
        setDrawAudio(new Audio('/draw.mp3'))
        setBgAudio(new Audio('/raffle-draw.mp3'))
        getCount()

        // if(videoBtnRef){
        //     videoBtnRef.current.click()
        // }
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

    const getRandomNumbers = () => {
        setIsStarted(true)
        const startTime = Date.now()
        
        const timeouts = [
            setTimeout(() => clearInterval(intervals[0]), (randomizerDelay/4)*1000),
            setTimeout(() => clearInterval(intervals[1]), (randomizerDelay/2)*1000),
            setTimeout(() => clearInterval(intervals[2]), (randomizerDelay/1.2)*1000),
            setTimeout(() => clearInterval(intervals[3]),(randomizerDelay*1000)),
          ];
    
          const intervals = [
            setInterval(() => {
                const number = Math.floor(Math.random() * 10);
                setDigits((d)=>[number, d[1], d[2], d[3]]);
            }, 50), 
            setInterval(() => {
                    const number = Math.floor(Math.random() * 10);
                    setDigits((d)=>[d[0], number, d[2], d[3]]);
            }, 100), 
            setInterval(() => {
                const number = Math.floor(Math.random() * 10);
                setDigits((d)=>[d[0], d[1], number, d[3]]);
            }, 150), 
            setInterval(() => {
                const number = Math.floor(Math.random() * 10);
                setDigits((d)=>[d[0], d[1], d[2], number]);
                if((randomizerDelay)*1000 - (Date.now() - startTime) < 5000){
                    drawAudio?.play()
                }
                setTimeout(()=>{
                    if(((Date.now() - startTime)) >= (randomizerDelay)*1000){
                        setCompleted(true);
                        setIsStarted(false)
                        console.log("ok")
                    }
                }, 300)
            }, 200), 
        ]
        if(totalEntries && counter){
            return () => [
                timeouts.map((timeout)=>clearTimeout(timeout)),
                intervals.map((interval)=>clearInterval(interval))
            ]
        }

        // if(isRunning){
        //         if(totalEntries && counter){
        //             // Cleanup intervals on component unmount
        //             return () => [
        //                 timeouts.map((timeout)=>clearTimeout(timeout)),
        //                 intervals.map((interval)=>clearInterval(interval))
        //             ]
        //         }
        // }else{
        //     return () => timeouts.map((_, id)=> {
        //         clearTimeout(id)
        //         setCompleted(true)
        //     })
        // }

        }
        // const randomDigit = () => Math.floor(Math.random() * 10);
    // const handleGetRandomNumber = () => {
    //     if(totalEntries && counter){
    //         // bgAudio?.pause()
    //         // drawAudio?.play()
    //         setIsStarted(true)

            // const interval = setInterval(() => {
            //     const number = Math.floor(1 + Math.random() * counter);
            //     const paddedNumber = number.toString().padStart(4, '0'); // Pad to 4 digits
            //     setRandomNumber(paddedNumber);
            //   }, 50); // Update every 50ms

    //         //   if(randomNumber !== "0000" && !isStarted){
    //         //     clearInterval(interval); // Stop after 8 seconds
    //         //     bgAudio?.play()
    //         //     applauseAudio?.play()
    //         //     setIsStarted(false)
    //         //     setShowConfetti(true)
    //         //   }
        
    //           const timeout = setTimeout(() => {
    //             clearInterval(interval); // Stop after 8 seconds
    //             bgAudio?.play()
    //             applauseAudio?.play()
    //             setIsStarted(false)
    //             setShowConfetti(true)
    //           }, (randomizerDelay*1000));
    
          
    //           return () => {
    //             clearInterval(interval);
    //             clearTimeout(timeout);
    //           };
    //     }
    // }

    useEffect(()=>{
        const randomNumbers = digits.join('')
        if(completed){
            getSingleEntry(randomNumbers)
        }
    }, [completed])

    const getSingleEntry = async(code: string) => {
        try {
            const entry: any = await getWinner(code)
            setWinner(entry)
            if(entry?.id){
                addWinner({
                    name: entry.clientName,
                    raffleCode: entry.raffleCode,
                    branch: entry.branch.branchName,
                    phone: entry.phone,
                    address: entry.address,
                    winningType: drawType
                })
                bgAudio?.play()
                applauseAudio?.play()
                setIsStarted(false)
                setCompleted(false)
                setShowConfetti(true)
            }
            if(winnerBtnRef){
                setTimeout(()=>{
                    winnerBtnRef?.current.click()
                }, 1000)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const getCount = async() => {
        const count: any = await getEntriesCount()
        const counter: any = await getCounter()
        setTotalEntries(count)
        setCounter(counter)
    }

  return (
    <>
    {/* <audio ref={bgAudio} controls autoPlay className='hidden'>
        <source src="/raffle-draw.mp3" type="audio/mp3" />
    </audio>
    <audio ref={drawAudio} controls className='hidden'>
        <source src="/draw.mp3" type="audio/mp3" />
    </audio>
    <audio ref={applauseAudio} controls className='hidden'>
        <source src="/applause.mp3" type="audio/mp3" />
    </audio> */}
    <IntroVideoDialog btnRef={videoBtnRef} />
    {<WinnerDialog winner={winner} btnRef={winnerBtnRef} />}
    {showConfetti && <Confetti className='z-50' width={windowDimension?.width} height={windowDimension?.height} />}
            <h1>{totalEntries? totalEntries : "..."} Total Entries</h1>
            <Select onValueChange={(value)=>setDrawType(value as WinType)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={drawType} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Draw Type</SelectLabel>
                        {Object.values(WinType).map((winType) => (
                            <SelectItem key={winType} value={winType}>{winType}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        <div className='flex flex-col gap-12 mt-6 items-center'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{digits[0]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{digits[1]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{digits[2]}</h1>
                    </div>
                    <div className='h-[100px] w-[80px] p-4 bg-white flex items-center justify-center rounded-md'>
                        <h1 className='text-6xl font-bold text-black'>{digits[3]}</h1>
                    </div>
                </div>
                <button disabled={!counter || !totalEntries || isStarted} className='rounded-full p-6 bg-primary' onClick={()=>{getRandomNumbers(); setShowConfetti(false)}}>{(!counter || !totalEntries) ? "Please Wait" : "Start"}</button>
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
            <div className='flex items-center gap-2'>
                <WinnersDialog />
                <SettingsDialog />
            </div>
        </div>
    </>
  )
}

export default RaffleDrawVersion2