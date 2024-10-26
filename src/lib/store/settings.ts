import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
    randomizerDelay: number;
    testMode: boolean;
    setRandomizerDelay: (delay: number) => void;
    toggleTestMode: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            randomizerDelay: 10,
            testMode: true,
            setRandomizerDelay: (delay) => set(()=> ({randomizerDelay: delay})),
            toggleTestMode: (value) => set((state)=> ({testMode: !state.testMode}))
        }),
        {
            name: 'settings-storage'
        }
    )
)