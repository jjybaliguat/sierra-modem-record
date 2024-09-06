import { getEntries } from '@/app/actions';
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
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
        <div className='flex items-center gap-2'>
          <Image
            src="/sierra-logo.png"
            alt='logo'
            height={100}
            width={150}
          />
          <h1 className='text-3xl font-bold'>RAFFLE DRAW</h1>
        </div>
        <RandomNamePicker data={data} />
      </div>
    </div>
    </>
  )
}

export default Raffle