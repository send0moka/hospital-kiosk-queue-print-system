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
    const { bookingId, jadwalId } = await req.json()
    const [jadwal]: any[] = await executeQuery(
      `SELECT * FROM jadwal_dokter WHERE id = ?`,
      [jadwalId]
    )
    if (!jadwal) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 })
    }
    await executeQuery(
      `UPDATE booking SET tanggal_booking = CURDATE(), jam_booking = ? WHERE id = ? AND pasien_id = ?`,
      [jadwal.jam_mulai, bookingId, session.user.id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating booking with jadwal:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}