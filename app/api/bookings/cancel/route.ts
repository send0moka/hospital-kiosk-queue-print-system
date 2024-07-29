import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();
    console.log("Attempting to delete booking with ID:", bookingId);
    const result: { affectedRows: number } = await executeQuery(`DELETE FROM booking WHERE kode_booking = ?`, [bookingId]);
    console.log("Delete query result:", result);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}