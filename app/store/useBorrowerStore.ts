import { create } from "zustand";
import { Borrower } from "@/app/types/borrower";

interface BorrowerState {
  activeBorrower: Borrower | null;
  setActiveBorrower: (borrower: Borrower) => void;
  details: Borrower | null;
  setDetails: (details: Borrower) => void;
}

export const useBorrowerStore = create<BorrowerState>((set) => ({
  activeBorrower: null,
  setActiveBorrower: (borrower) => set({ activeBorrower: borrower }),
  details: null,
  setDetails: (details) => set({ details }),
}));
