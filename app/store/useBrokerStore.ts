import { create } from "zustand";

interface Broker {
  name: string;
  deals: number;
  approval_rate: string;
  pending: number;
}

interface BrokerStore {
  broker: Broker | null;
  setBroker: (broker: Broker) => void;
}

export const useBrokerStore = create<BrokerStore>((set) => ({
  broker: null,
  setBroker: (broker) => set({ broker }),
}));
