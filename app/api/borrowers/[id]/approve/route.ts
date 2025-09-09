import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    message: `Loan for borrower ${params.id} approved.`,
  });
}
