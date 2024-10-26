import React, { useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import { Input } from '../ui/input';
import { useSettingsStore } from '@/lib/store/settings';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { DialogDescription } from '@radix-ui/react-dialog';
import { toast } from 'sonner';

function SettingsDialog() {

    const buttonRef = useRef<HTMLButtonElement>(null);
    const delay = useSettingsStore((state) => state.randomizerDelay)
    const {testMode, setRandomizerDelay, toggleTestMode} = useSettingsStore()

    const [settings, setSettings] = useState({
        delay,
        testMode
    })

    const handleSave = () => {
        setRandomizerDelay(settings.delay)
        toggleTestMode(settings.testMode)
        toast.success(`Settings saved! Activated ${settings.testMode ? "test mode" : "live mode"}`);
        buttonRef.current?.click()
    }

    return (
      <>
          <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <GearIcon className='h-4 w-4 mr-2' /> Settings
                </Button>
            </DialogTrigger>
              <DialogClose ref={buttonRef} asChild>
                  <Button type="button" variant="secondary" className='hidden'>
                  Close
                  </Button>
              </DialogClose>
            <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Raffle Settings</DialogTitle>
                  <DialogDescription>
                      
                  </DialogDescription>
                  </DialogHeader>
                  
                  <div className='flex flex-col gap-4 mt-4'>
                    <div className='grid grid-cols-3 items-center'><h1 className='col-span-2'>Randomizer delay in secs. </h1> <Input placeholder='' value={settings.delay} onChange={(e)=>{setSettings({...settings, delay: Number(e.target.value)})}} /></div>
                    <div className='grid grid-cols-3 items-center'><h1 className='col-span-2'>Raffle Mode </h1> 
                    <Select onValueChange={(value)=>setSettings({...settings, testMode: (value === "true"? true : false)})}>
                        <SelectTrigger>
                            <SelectValue placeholder={settings.testMode? "Test" : "Live"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="true">Test</SelectItem>
                            <SelectItem value="false">Live</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                  </div>
                <DialogFooter>
                <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
      </>
    )
}

export default SettingsDialog