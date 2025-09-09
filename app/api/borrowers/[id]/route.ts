import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    name: "Sarah Dunn",
    email: "sarah.dunn@example.com",
    phone: "(355)123-4557",
    loan_amount: 300000,
    status: "In Review",
    employment: "At Tech Company",
    income: 120000,
    existing_loan: 240000,
    credit_score: 720,
    source_of_funds: "Declared",
    risk_signal: "Missing Source of Funds declaration",
    ai_flags: [
      "Income Inconsistent with Bank statements",
      "High Debt-to-Income Ratio detected",
    ],
  });
}
