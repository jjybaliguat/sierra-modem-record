import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
    randomizerDelay: number;
    deleteAfterPicked: boolean;
    setRandomizerDelay: (delay: number) => void;
    setDeleteAfterPicked: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            randomizerDelay: 10,
            deleteAfterPicked: false,
            setRandomizerDelay: (delay) => set(()=> ({randomizerDelay: delay})),
            setDeleteAfterPicked: (value) => set(()=> ({deleteAfterPicked: value}))
        }),
        {
            name: 'settings-storage'
        }
    )
)