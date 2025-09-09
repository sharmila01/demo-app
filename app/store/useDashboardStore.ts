import { create } from "zustand";
import { Borrower } from "../types/borrower";

interface DashboardState {
  activeBorrower: Borrower | null;
  setActiveBorrower: (b: Borrower) => void;

  borrowerDetails: Borrower | null;
  setBorrowerDetails: (b: Borrower) => void;

  broker: {
    name: string;
    deals: number;
    approval_rate: string;
    pending: number;
  } | null;
  setBroker: (b: {
    name: string;
    deals: number;
    approval_rate: string;
    pending: number;
  }) => void;

  onboardingSteps: string[];
  setOnboardingSteps: (steps: string[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeBorrower: null,
  setActiveBorrower: (b) => set({ activeBorrower: b }),
  borrowerDetails: null,
  setBorrowerDetails: (b) => set({ borrowerDetails: b }),
  broker: null,
  setBroker: (b) => set({ broker: b }),
  onboardingSteps: [],
  setOnboardingSteps: (steps) => set({ onboardingSteps: steps }),
}));
