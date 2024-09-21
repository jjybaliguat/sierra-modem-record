import { getEntries } from '@/app/actions';
import CustomLink from '@/components/btn/CustomLink';
import Prizes from '@/components/dialog/Prizes';
import RaffleDrawVersion2 from '@/components/RaffleDrawVersion2';
import RandomNamePicker from '@/components/RandomNamePicker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RandomRoller from 'react-random-roller';

async function Raffle() {
  const data: any = await getEntries()
  return (
    <>
    {/* <div>Raffle</div> */}
    <div className='py-8 flex flex-col min-h-screen'>
      <div className='flex flex-col items-center gap-4'>
        <CustomLink href='/dashboard' spa={false} />
        <h1 className='text-3xl font-bold'>Welcome To</h1>
        <div className='flex items-center gap-2'>
          <Image
            src="/sierra-logo.png"
            alt='logo'
            height={100}
            width={150}
          />
          <h1 className='text-3xl font-bold'>RAFFLE DRAW</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Prizes label='Grand Prize' img='/e-bike.png' alt='e-bike-image' title='Grand Price - E-Bike' />
          <Prizes label='2nd Prize' img='/smart-tv.png' alt='smart-tv-image' title='2nd Price - 43" Smart TV' />
          <Prizes label='3rd Prize' img='/washing-machine.png' alt='washing-machine-image' title='3rd Price - Washing Machine' />
        </div>
        {/* <RandomNamePicker data={data} /> */}
        <RaffleDrawVersion2 entries={data} />
      </div>
    </div>
    </>
  )
}

export default Raffle