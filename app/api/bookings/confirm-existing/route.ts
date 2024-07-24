import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json()
    if (typeof bookingId !== "number") {
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    const [booking]: any[] = await executeQuery(
      `SELECT * FROM booking WHERE id = ?`,
      [bookingId]
    )

    if (!booking) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })
    }

    const [bookingData]: any[] = await executeQuery(
      `SELECT tanggal_booking FROM booking WHERE id = ?`,
      [bookingId]
    )
    const [lastAntrian]: any[] = await executeQuery(
      `SELECT MAX(nomor_antrian) as last_number FROM antrian 
       WHERE DATE(created_at) = ? AND booking_id IN (SELECT id FROM booking WHERE tanggal_booking = ?)`,
      [bookingData.tanggal_booking, bookingData.tanggal_booking]
    )
    let newAntrianNumber = 1
    if (lastAntrian && lastAntrian.last_number) {
      newAntrianNumber = lastAntrian.last_number + 1
    }
    const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")
    const result = await executeQuery<any>(
      `INSERT INTO antrian (booking_id, nomor_antrian) VALUES (?, ?)`,
      [bookingId, formattedAntrianNumber]
    )
    if (!result || !result.insertId) {
      throw new Error("Failed to insert new antrian")
    }
    return NextResponse.json({
      success: true,
      antrianId: result.insertId,
      nomorAntrian: formattedAntrianNumber,
    })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 })
  }
}
