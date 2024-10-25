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
    const delay = useSettingsStore((state: any) => state.randomizerDelay)
    const deleteAfterPicked = useSettingsStore((state: any) => state.deleteAfterPicked)
    const setRandomizerDelay = useSettingsStore((state: any) => state.setRandomizerDelay)
    const setDeleteAfterPicked = useSettingsStore((state: any) => state.setDeleteAfterPicked)

    const [settings, setSettings] = useState({
        delay,
        deleteAfterPicked
    })

    const handleSave = () => {
        setRandomizerDelay(settings.delay)
        setDeleteAfterPicked(settings.deleteAfterPicked)
        toast.success("Settings saved!");
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
                    <div className='grid grid-cols-3 items-center'><h1 className='col-span-2'>Randomizer delay in secs. </h1> <Input placeholder='' value={settings.delay} onChange={(e)=>{setSettings({...settings, delay: e.target.value})}} /></div>
                    <div className='grid grid-cols-3 items-center'><h1 className='col-span-2'>Prevent Entry from multiple wins? </h1> 
                    <Select onValueChange={(value)=>setSettings({...settings, deleteAfterPicked: (value === "true"? true : false)})}>
                        <SelectTrigger>
                            <SelectValue placeholder={settings.deleteAfterPicked? "True" : "False"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
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