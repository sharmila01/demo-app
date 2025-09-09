import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    name: "Robert Turner",
    deals: 16,
    approval_rate: "75%",
    pending: 7660,
  });
}
