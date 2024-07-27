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
    await executeQuery(
      `UPDATE booking b
       JOIN jadwal_dokter jd ON jd.id = ?
       SET b.jadwal_dokter_id = ?, b.dokter_id = jd.dokter_id, b.status = 'Selesai'
       WHERE b.id = ? AND b.pasien_id = ?`,
      [jadwalDokterId, jadwalDokterId, bookingId, session.user.id]
    )
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
      newAntrianNumber = parseInt(lastAntrian.last_number, 10) + 1
    }
    const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")
    const { insertId: antrianId } = await executeQuery<any>(
      `INSERT INTO antrian (booking_id, nomor_antrian) VALUES (?, ?)`,
      [bookingId, formattedAntrianNumber]
    )
    return NextResponse.json({
      success: true,
      antrianId,
      nomorAntrian: formattedAntrianNumber,
    })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
