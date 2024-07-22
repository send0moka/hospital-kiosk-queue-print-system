import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const poliId = searchParams.get('poli_id')

  if (!poliId) {
    return NextResponse.json({ error: "Poli ID is required" }, { status: 400 })
  }

  try {
    const dokterList = await executeQuery(`
      SELECT DISTINCT d.id, d.nama, d.foto, d.spesialisasi
      FROM dokter d
      JOIN jadwal_dokter jd ON d.id = jd.dokter_id
      WHERE jd.poli_id = ?
      ORDER BY d.nama
    `, [poliId]);
    return NextResponse.json(dokterList)
  } catch (error) {
    console.error("Error fetching dokter list:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}