"use client";

import { useEffect, useState } from "react";
import { Borrower } from "@/app/types/borrower";
import { fetcher } from "@/app/utils/api";
import { useDashboardStore } from "@/app/store/useDashboardStore";

export default function BorrowerPipeline() {
  const setActiveBorrower = useDashboardStore(
    (state) => state.setActiveBorrower
  );
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetcher<{
          new: Borrower[];
          in_review: Borrower[];
          approved: Borrower[];
        }>("/api/borrowers/pipeline");
        setBorrowers([...data.new, ...data.in_review, ...data.approved]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <div data-cy="loading-borrowers">Loading borrowers...</div>;
  if (borrowers.length === 0)
    return <div data-cy="no-borrowers">No borrowers found</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2
        data-cy="pipeline-header"
        className="text-lg font-semibold mb-4 text-gray-500"
      >
        Borrower Pipeline
      </h2>
      <ul className="space-y-2">
        {borrowers.map((b) => (
          <li
            key={b.id}
            data-cy={`borrower-item-${b.id}`}
            className="flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setActiveBorrower(b)}
          >
            <div>
              <div className="font-medium text-gray-500">{b.name}</div>
              <div className="text-sm text-gray-600">{b.loan_type}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500">
                ${b.amount?.toLocaleString() ?? 0}
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {b.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
