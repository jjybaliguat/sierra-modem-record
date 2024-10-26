import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the type for individual winners
interface WinnerState {
  name: string;
  raffleCode: string;
  phone: string;
  address: string;
  branch: string;
  winningType: WinType;
}

// Enum for prize types
enum WinType {
  GrandPrize = "GrandPrize",
  SecondPrize = "SecondPrize",
  ThirdPrize = "ThirdPrize",
  ConsolationRice = "ConsolationRice",
  ConsolationInternet = "ConsolationInternet",
  ConsolationNocheBuena = "ConsolationNocheBuena",
}

// Define the main state type with actions
interface WinnersState {
  winners: WinnerState[];
  drawType: WinType;
  getWinnerByWinType: (winType: WinType) => WinnerState[];
  setDrawType: (type: WinType) => void;
  addWinner: (winner: WinnerState) => void;
  removeWinner: (raffleCode: string) => void;
  clearWinners: () => void;
}

const useWinnersStore = create<WinnersState>()(
  persist(
    (set, get) => ({
      winners: [],
      drawType: WinType.ConsolationNocheBuena,

      getWinnerByWinType: (type) => get().winners.filter((winner) => winner.winningType === type),
      setDrawType: (type) => set(() => ({ drawType: type })),
      addWinner: (winner) =>
        set((state) => ({ winners: [...state.winners, winner] })),
      removeWinner: (raffleCode) =>
        set((state) => ({
          winners: state.winners.filter(
            (winner) => winner.raffleCode !== raffleCode
          ),
        })),
      clearWinners: () => set({ winners: [] }),
    }),
    {
      name: 'winners-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { WinType, useWinnersStore };