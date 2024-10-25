import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            randomizerDelay: 10,
            deleteAfterPicked: false,
            setRandomizerDelay: (delay: number) => set(()=> ({randomizerDelay: delay})),
            setDeleteAfterPicked: (value: boolean) => set(()=> ({deleteAfterPicked: value}))
        }),
        {
            name: 'settings-storage'
        }
    )
)