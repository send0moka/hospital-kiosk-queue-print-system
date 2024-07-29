import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const poliId = searchParams.get('poli_id')
  const tanggal = searchParams.get('tanggal')
  if (!poliId || !tanggal) {
    return NextResponse.json({ error: "Poli ID and tanggal are required" }, { status: 400 })
  }
  try {
    const hari = new Date(tanggal).toLocaleString('id-ID', { weekday: 'long' })
    const jenis_layanan = searchParams.get('jenis_layanan') || 'Umum';
    const dokterList = await executeQuery(`
      SELECT DISTINCT 
        d.id, 
        d.nama, 
        d.foto, 
        d.spesialisasi, 
        jd.jam_mulai, 
        jd.jam_selesai,
        CASE WHEN jd.id IS NOT NULL THEN TRUE ELSE FALSE END as has_schedule
      FROM dokter d
      LEFT JOIN jadwal_dokter jd ON d.id = jd.dokter_id AND jd.hari = ? AND (jd.layanan = 'Semua' OR jd.layanan = ?)
      WHERE jd.poli_id = ? OR d.id IN (SELECT DISTINCT dokter_id FROM jadwal_dokter WHERE poli_id = ?)
      ORDER BY has_schedule DESC, d.nama
    `, [hari, jenis_layanan, poliId, poliId]);
    return NextResponse.json(dokterList)
  } catch (error) {
    console.error("Error fetching dokter list:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}