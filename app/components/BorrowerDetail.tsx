"use client";

import { useEffect } from "react";
import { AlertTriangle, FileText, UserCheck, Send } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import { fetcher } from "@/app/utils/api";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import { Borrower } from "@/app/types/borrower";

export default function BorrowerDetail() {
  const { activeBorrower, borrowerDetails, setBorrowerDetails } =
    useDashboardStore();

  useEffect(() => {
    if (!activeBorrower) return;

    fetcher<Borrower>(`/api/borrowers/${activeBorrower.id}`)
      .then((data) => setBorrowerDetails(data))
      .catch(console.error);
  }, [activeBorrower, setBorrowerDetails]);

  const postAction = async (
    borrowerId: string,
    action: "request-documents" | "send-valuer" | "approve" | "escalate"
  ) => {
    try {
      const res = await fetch(`/api/borrowers/${borrowerId}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!borrowerDetails)
    return (
      <div
        data-cy="select-borrower"
        className="p-4 bg-white rounded-xl shadow text-gray-400"
      >
        Select a borrower
      </div>
    );

  const details = borrowerDetails;
  const canEscalate = !!details.risk_signal; // Escalate only if risk_signal exists

  return (
    <div
      data-cy="borrower-details"
      className="bg-white rounded-xl shadow p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2
            data-cy="borrower-name"
            className="font-bold text-gray-700 text-xl"
          >
            {details.name}
          </h2>
          <p data-cy="borrower-email" className="text-gray-500">
            {details.email ?? "N/A"}
          </p>
          <p data-cy="borrower-phone" className="text-gray-500">
            {details.phone ?? "N/A"}
          </p>
          <p
            data-cy="borrower-loan"
            className="text-gray-700 font-semibold mt-1"
          >
            Loan: ${details.loan_amount?.toLocaleString() ?? "0"}
          </p>
        </div>
        <div
          data-cy="borrower-status"
          className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-blue-600"
        >
          {details.status ?? "N/A"}
        </div>
      </div>

      {/* AI Explainability */}
      <Accordion type="single" collapsible className="border rounded">
        <AccordionItem value="ai-flags" data-cy="ai-accordion">
          <AccordionTrigger>AI Explainability</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {details.ai_flags?.length ? (
              details.ai_flags.map((flag, idx) => (
                <div
                  key={idx}
                  data-cy="ai-flag"
                  className="flex items-center gap-2 text-red-600 font-medium"
                >
                  <AlertTriangle size={20} /> {flag}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No AI flags</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          data-cy="btn-request-documents"
          variant="default"
          className="flex items-center gap-1"
          onClick={() =>
            details.id && postAction(details.id, "request-documents")
          }
        >
          <FileText size={16} /> Request Documents
        </Button>

        <Button
          data-cy="btn-send-valuer"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => details.id && postAction(details.id, "send-valuer")}
        >
          <Send size={16} /> Send to Valuer
        </Button>

        <Button
          data-cy="btn-approve"
          variant="default"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => details.id && postAction(details.id, "approve")}
        >
          <UserCheck size={16} /> Approve
        </Button>
      </div>

      {/* Loan Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-500">
            <span className="font-semibold">Employment:</span>{" "}
            {details.employment ?? "N/A"}
          </div>
          <div className="text-gray-500">
            <span className="font-semibold">Existing Loan:</span> $
            {details.existing_loan?.toLocaleString() ?? "0"}
          </div>
          <div className="text-gray-500">
            <span className="font-semibold">Credit Score:</span>{" "}
            {details.credit_score?.toString() ?? "N/A"}
          </div>
          <div className="text-gray-500">
            <span className="font-semibold">Source of Funds:</span>{" "}
            {details.source_of_funds ?? "N/A"}
          </div>
        </div>

        {details.risk_signal && (
          <div
            data-cy="risk-signal"
            className="flex items-center gap-2 text-yellow-700 font-medium mt-2"
          >
            <AlertTriangle size={20} /> {details.risk_signal}
          </div>
        )}

        {/* Escalate Button */}
        <Button
          data-cy="btn-escalate"
          variant="destructive"
          disabled={!canEscalate}
          className="bg-purple text-black p-2 rounded mt-2"
          onClick={() => details.id && postAction(details.id, "escalate")}
        >
          Escalate to Credit Committee
        </Button>

        {!canEscalate && (
          <p className="text-xs text-gray-500 mt-1">
            Cannot escalate: No risk signal present
          </p>
        )}
      </div>
    </div>
  );
}
