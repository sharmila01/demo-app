"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import { fetcher } from "@/app/utils/api";
import OnboardingWorkflow from "../OnboardingWorkflow";

export default function BrokerOverview() {
  const broker = useDashboardStore((state) => state.broker);
  const setBroker = useDashboardStore((state) => state.setBroker);

  useEffect(() => {
    fetcher<{ name: string; deals: number; approval_rate: string; pending: number }>("/api/broker/1")
      .then((data) => setBroker(data)) // now correctly typed
      .catch(console.error);
  }, [setBroker]);

  if (!broker)
    return (
      <div className="bg-white rounded-xl shadow p-4 text-gray-400">
        Loading broker info...
      </div>
    );

  return (
    <>
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-500">{broker.name}</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-semibold">{broker.deals}</div>
          <div className="text-gray-500 text-sm">Deals</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{broker.approval_rate}</div>
          <div className="text-gray-500 text-sm">Approval Rate</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">${broker.pending.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Pending</div>
        </div>
      </div>
       
    </div>

    <OnboardingWorkflow/>
</>
    
  );
}
