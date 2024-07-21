import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET() {
  try {
    const poliList = await executeQuery(`
      SELECT p.id, p.nama, p.icon, COUNT(DISTINCT jd.dokter_id) as jumlah_dokter
      FROM poli p
      LEFT JOIN jadwal_dokter jd ON p.id = jd.poli_id
      GROUP BY p.id, p.nama, p.icon
    `)
    return NextResponse.json(poliList)
  } catch (error) {
    console.error("Error fetching poli list:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}