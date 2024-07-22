import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId, dokterId } = await req.json()

    // Update booking dengan dokter yang dipilih
    await executeQuery(
      `UPDATE booking SET dokter_id = ? WHERE id = ? AND pasien_id = ?`,
      [dokterId, bookingId, session.user.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating booking with doctor:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}