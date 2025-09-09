import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    steps: [
      "Deal Intake",
      "IDV & Credit Check",
      "Document Upload",
      "AI Validation",
      "Credit Committee",
      "Approval & Docs",
      "Funder Syndication",
    ],
  });
}
