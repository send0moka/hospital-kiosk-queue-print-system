import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET(
  request: Request,
  { params }: { params: { kodeBooking: string } }
) {
  try {
    const [booking]: Array<any> = await executeQuery(
      `SELECT * FROM booking WHERE kode_booking = ?`,
      [params.kodeBooking]
    )
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}