import { NextResponse } from "next/server"
import { updateBookingStatus } from "@/lib/serverUtils"

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json()
    if (typeof bookingId !== "number" || !['Menunggu', 'Selesai'].includes(status)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    await updateBookingStatus(bookingId, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}