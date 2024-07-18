import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  try {
    console.log("Mencoba mendapatkan sesi...")
    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session) {
      console.log("Tidak ada sesi")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user) {
      console.log("Tidak ada user dalam sesi")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.nomor_bpjs) {
      console.log("Tidak ada nomor BPJS dalam sesi user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [pasien]: any[] = await executeQuery(
      "SELECT id FROM pasien WHERE nomor_bpjs = ?",
      [session.user.nomor_bpjs]
    )

    if (!pasien) {
      return NextResponse.json({ error: "Pasien tidak ditemukan" }, { status: 404 })
    }

    const rujukan = await executeQuery(
      `SELECT r.id, r.nomor_rujukan, r.tanggal_rujukan, r.faskes_perujuk, r.diagnosis, p.nama as poli
       FROM rujukan r
       JOIN poli p ON r.poli_id = p.id
       WHERE r.pasien_id = ?
       AND r.id NOT IN (SELECT IFNULL(rujukan_id, 0) FROM booking WHERE rujukan_id IS NOT NULL)`,
      [pasien.id]
    )

    return NextResponse.json(rujukan)
  } catch (error) {
    console.error("Error fetching rujukan:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}