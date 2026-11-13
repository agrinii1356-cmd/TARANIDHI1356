import { create } from "zustand";
import { persist } from "zustand/middleware";

export const STARTER_CREDITS = 25;

export const PACKS = [
  { id: "nidhi-25", credits: 25, label: "25 queries", note: "Daily asks" },
  { id: "nidhi-100", credits: 100, label: "100 queries", note: "Work month" },
  { id: "nidhi-300", credits: 300, label: "300 queries", note: "Studio / office" },
] as const;

export type LedgerEntry = {
  id: string;
  at: string;
  delta: number;
  reason: string;
};

type Wallet = {
  credits: number;
  ledger: LedgerEntry[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  spend: (n: number, reason: string) => boolean;
  topup: (n: number, reason: string) => void;
};

function entry(delta: number, reason: string): LedgerEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    delta,
    reason,
  };
}

export const useWallet = create<Wallet>()(
  persist(
    (set, get) => ({
      credits: STARTER_CREDITS,
      ledger: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      spend: (n, reason) => {
        if (n <= 0) return true;
        if (get().credits < n) return false;
        set({
          credits: get().credits - n,
          ledger: [entry(-n, reason), ...get().ledger].slice(0, 40),
        });
        return true;
      },
      topup: (n, reason) => {
        set({
          credits: get().credits + n,
          ledger: [entry(n, reason), ...get().ledger].slice(0, 40),
        });
      },
    }),
    {
      name: "taranidhi-wallet",
      partialize: (s) => ({ credits: s.credits, ledger: s.ledger }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
