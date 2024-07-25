import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();
    await executeQuery(`DELETE FROM booking WHERE id = ?`, [bookingId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}