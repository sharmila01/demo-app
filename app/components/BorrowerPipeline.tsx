"use client";

import { useEffect, useState } from "react";
import { Borrower } from "@/app/types/borrower";
import { fetcher } from "@/app/utils/api";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

export default function BorrowerPipeline() {
  const setActiveBorrower = useDashboardStore(
    (state) => state.setActiveBorrower
  );
  const activeBorrower = useDashboardStore((state) => state.activeBorrower);

  const [loading, setLoading] = useState(true);
  const [newBorrowers, setNewBorrowers] = useState<Borrower[]>([]);
  const [inReviewBorrowers, setInReviewBorrowers] = useState<Borrower[]>([]);
  const [approvedBorrowers, setApprovedBorrowers] = useState<Borrower[]>([]);
  const [activeSanitized, setActiveSanitized] = useState<string>("yes");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetcher<{
          new: Borrower[];
          in_review: Borrower[];
          approved: Borrower[];
        }>("/api/borrowers/pipeline");

        setNewBorrowers(data.new);
        setInReviewBorrowers(data.in_review);
        setApprovedBorrowers(data.approved);
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

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2
        data-cy="pipeline-header"
        className="text-lg font-semibold mb-4 text-gray-500"
      >
        Borrower Pipeline
      </h2>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in_review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <BorrowerList
            borrowers={newBorrowers}
            setActiveBorrower={setActiveBorrower}
            activeBorrower={activeBorrower}
          />
        </TabsContent>

        <TabsContent value="in_review">
          <BorrowerList
            borrowers={inReviewBorrowers}
            setActiveBorrower={setActiveBorrower}
            activeBorrower={activeBorrower}
          />
        </TabsContent>

        <TabsContent value="approved">
          <BorrowerList
            borrowers={approvedBorrowers}
            setActiveBorrower={setActiveBorrower}
            activeBorrower={activeBorrower}
          />
        </TabsContent>
      </Tabs>

      {/* Radio Section */}
      <div className="mt-6">
        <Label className="text-gray-600 uppercase font-semibold mb-2 block">
          F-SANATISED ACTIVE
        </Label>
        <RadioGroup
          value={activeSanitized}
          onValueChange={setActiveSanitized}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="sanitized-yes" />
            <Label htmlFor="sanitized-yes" className="text-gray-700">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="sanitized-no" />
            <Label htmlFor="sanitized-no" className="text-gray-700">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

interface BorrowerListProps {
  borrowers: Borrower[];
  setActiveBorrower: (b: Borrower) => void;
  activeBorrower: Borrower | null;
}

function BorrowerList({
  borrowers,
  setActiveBorrower,
  activeBorrower,
}: BorrowerListProps) {
  if (borrowers.length === 0)
    return <div className="text-gray-500 py-4">No borrowers found</div>;

  const getStatusVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "default";
      case "in review":
        return "secondary";
      case "approved":
        return "secondary";
      case "renew":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <ul className="space-y-2">
      {borrowers.map((b) => {
        const isActive = activeBorrower?.id === b.id;
        return (
          <li
            key={b.id}
            data-cy={`borrower-item-${b.id}`}
            className={`flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-100 ${
              isActive ? "ring-2 ring-blue-400 bg-blue-50" : ""
            }`}
            onClick={() => setActiveBorrower(b)}
          >
            <div>
              <div className="font-medium text-gray-500">{b.name}</div>
              <div className="text-sm text-gray-600">{b.loan_type}</div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <div className="text-gray-500">
                ${b.amount?.toLocaleString() ?? 0}
              </div>
              <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
