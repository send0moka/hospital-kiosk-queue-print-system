import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId, jadwalDokterId } = await req.json()

    // Update booking dengan jadwal yang dipilih
    // await executeQuery(
    //   `UPDATE booking SET jadwal_dokter_id = ?, status = 'Terkonfirmasi' WHERE id = ? AND pasien_id = ?`,
    //   [jadwalDokterId, bookingId, session.user.id]
    // )
    await executeQuery(
      `UPDATE booking b
       JOIN jadwal_dokter jd ON jd.id = ?
       SET b.jadwal_dokter_id = ?, b.dokter_id = jd.dokter_id, b.status = 'Terkonfirmasi'
       WHERE b.id = ? AND b.pasien_id = ?`,
      [jadwalDokterId, jadwalDokterId, bookingId, session.user.id]
    )

    // Ambil tanggal booking
    const [bookingData]: any[] = await executeQuery(
      `SELECT tanggal_booking FROM booking WHERE id = ?`,
      [bookingId]
    )

    // Cek nomor antrian terakhir untuk tanggal tersebut
    const [lastAntrian]: any[] = await executeQuery(
      `SELECT MAX(nomor_antrian) as last_number FROM antrian 
       WHERE DATE(created_at) = ? AND booking_id IN (SELECT id FROM booking WHERE tanggal_booking = ?)`,
      [bookingData.tanggal_booking, bookingData.tanggal_booking]
    )

    // Generate nomor antrian baru
    let newAntrianNumber = 1
    if (lastAntrian && lastAntrian.last_number) {
      newAntrianNumber = lastAntrian.last_number + 1
    }

    // Format nomor antrian menjadi 3 digit
    const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")

    // Insert nomor antrian baru
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
