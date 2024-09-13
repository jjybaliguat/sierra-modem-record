import { getEntries } from '@/app/actions';
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
        <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
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
        {/* <RandomNamePicker data={data} /> */}
        <RaffleDrawVersion2 />
      </div>
    </div>
    </>
  )
}

export default Raffle