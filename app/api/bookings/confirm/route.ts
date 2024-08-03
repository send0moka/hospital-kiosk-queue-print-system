import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { bookingId, jadwalDokterId } = await req.json()
    const [existingAntrian]: any[] = await executeQuery(
      `SELECT id, nomor_antrian FROM antrian WHERE booking_id = ?`,
      [bookingId]
    )
    if (existingAntrian) {
      await executeQuery(
        `UPDATE antrian SET created_at = NOW() WHERE id = ?`,
        [existingAntrian.id]
      )
      await executeQuery(
        `UPDATE booking SET jadwal_dokter_id = ?, status = 'Selesai' WHERE id = ?`,
        [jadwalDokterId, bookingId]
      )
      return NextResponse.json({
        success: true,
        antrianId: existingAntrian.id,
        nomorAntrian: existingAntrian.nomor_antrian,
      })
    } else {
      const [bookingData]: any[] = await executeQuery(
        `SELECT tanggal_booking FROM booking WHERE id = ?`,
        [bookingId]
      )
      const [lastAntrian]: any[] = await executeQuery(
        `SELECT MAX(CAST(nomor_antrian AS UNSIGNED)) as last_number 
        FROM antrian 
        WHERE DATE(created_at) = CURDATE()
        AND jadwal_dokter_id = ?`,
        [jadwalDokterId]
      )
      let newAntrianNumber = 1
      if (lastAntrian && lastAntrian.last_number) {
        newAntrianNumber = parseInt(lastAntrian.last_number, 10) + 1
      }
      const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")
      const { insertId: antrianId } = await executeQuery<any>(
        `INSERT INTO antrian (booking_id, nomor_antrian, created_at, jadwal_dokter_id) 
        VALUES (?, ?, NOW(), ?)`,
        [bookingId, formattedAntrianNumber, jadwalDokterId]
      )
      await executeQuery(
        `UPDATE booking SET jadwal_dokter_id = ?, status = 'Selesai' WHERE id = ?`,
        [jadwalDokterId, bookingId]
      )
      return NextResponse.json({
        success: true,
        antrianId,
        nomorAntrian: formattedAntrianNumber,
      })
    }
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
