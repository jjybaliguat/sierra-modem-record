'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus, LucideTrash2, PencilIcon } from 'lucide-react'

interface FloatingActionsProps {
  setOpenAdd: (value: boolean) => void
//   setOpenAssign?: (value: boolean) => void
  setOpenAdjustment: (value: boolean) => void
}

export function FloatingActions({ setOpenAdd, setOpenAdjustment }: FloatingActionsProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const actions = [
    { label: 'Add Modem', icon: <Plus className="w-4 h-4" />, onClick: () => setOpenAdd(true) },
    { label: 'Make Adjustment', icon: <PencilIcon className="w-4 h-4" />, onClick: () => setOpenAdjustment(true) },
  ]

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.button
              key={action.label}
              onClick={() => {
                action.onClick()
                setOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md bg-white text-sm hover:bg-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
      </AnimatePresence>

      <Button
        onClick={() => setOpen(prev => !prev)}
        className="rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <Plus className={`transition-transform ${open ? 'rotate-45' : ''}`} />
      </Button>
    </div>
  )
}
