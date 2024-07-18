import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rujukanId } = await req.json()

    // Generate kode booking
    const kodeBooking = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Ambil informasi rujukan
    const [rujukan]: any[] = await executeQuery(
      `SELECT * FROM rujukan WHERE id = ? AND pasien_id = ?`,
      [rujukanId, session.user.id]
    )

    if (!rujukan) {
      return NextResponse.json({ error: "Rujukan tidak ditemukan" }, { status: 404 })
    }

    // Buat booking baru
    const result: { insertId: number } = await executeQuery(
      `INSERT INTO booking (kode_booking, pasien_id, tanggal_booking, jam_booking, jenis_layanan, poli_id, rujukan_id)
       VALUES (?, ?, CURDATE(), CURTIME(), 'BPJS', ?, ?)`,
      [kodeBooking, session.user.id, rujukan.poli_id, rujukanId]
    )
    
    const bookingId = result.insertId

    return NextResponse.json({ bookingId, kodeBooking })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}