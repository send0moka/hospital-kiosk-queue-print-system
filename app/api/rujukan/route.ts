import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const nomorBPJS = searchParams.get('nomor_bpjs')
    if (!nomorBPJS) {
      return NextResponse.json({ error: "Nomor BPJS is required" }, { status: 400 })
    }
    const [pasien]: any[] = await executeQuery(
      "SELECT id FROM pasien WHERE nomor_bpjs = ?",
      [nomorBPJS]
    )
    if (!pasien) {
      return NextResponse.json({ error: "Pasien tidak ditemukan" }, { status: 404 })
    }
    const rujukan = await executeQuery(
      `SELECT r.id, r.nomor_rujukan, r.tanggal_rujukan, r.faskes_perujuk, r.diagnosis, p.nama as poli, p.id as poli_id
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