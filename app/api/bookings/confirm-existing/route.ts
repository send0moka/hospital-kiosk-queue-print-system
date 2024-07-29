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
    const [lastAntrian]: any[] = await executeQuery(
      `SELECT MAX(CAST(nomor_antrian AS UNSIGNED)) as last_number FROM antrian 
       WHERE DATE(created_at) = CURDATE() AND booking_id IN (SELECT id FROM booking WHERE tanggal_booking = CURDATE())`,
      [booking.tanggal_booking, booking.tanggal_booking]
    )
    let newAntrianNumber = 1
    if (lastAntrian && lastAntrian.last_number) {
      newAntrianNumber = parseInt(lastAntrian.last_number, 10) + 1
    }
    const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")
    const result = await executeQuery<any>(
      `INSERT INTO antrian (booking_id, nomor_antrian, created_at) VALUES (?, ?, NOW())`,
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
