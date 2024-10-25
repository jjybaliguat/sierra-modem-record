import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WinnnersState {
    winners: WinnerState[],
    addWinner: (winner: WinnerState) => void,
    removeWinner: (raffleCode: string) => void,
    clearWinners: () => void
}
interface WinnerState {
    name: string,
    raffleCode: string,
    phone: string,
    address: string,
    winningType: winType
}

enum winType {
    GrandPrize = "GrandPrize",
    SecondPrize = "SecondPrize",
    ThirdPrize = "ThirdPrize",
    ConsolationRice = "ConsolationRice",
    ConsolationInternet = "ConsolationInternet",
    ConsolationNocheBuena = "ConsolationNocheBuena"
}

const useWinnersStore = create<WinnnersState>()(
    persist(
        (set, get) => ({
            winners: [],
            addWinner: (winner) => set((state)=>({winners: [...state.winners, winner]})),
            removeWinner: (raffleCode) => set((state) => ({ winners: state.winners.filter((winner) => winner.raffleCode !== raffleCode) })),
            clearWinners: () => set({ winners: [] }),
        }),
        {
            name: 'winners-storage'
        }
    )
)

export {winType, useWinnersStore}