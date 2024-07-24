import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dokterId = searchParams.get('dokter_id')
  if (!dokterId) {
    return NextResponse.json({ error: "Dokter ID is required" }, { status: 400 })
  }
  try {
    const [result]: { poli_id: string }[] = await executeQuery(`
      SELECT DISTINCT poli_id
      FROM jadwal_dokter
      WHERE dokter_id = ?
    `, [dokterId]);
    if (!result) {
      return NextResponse.json({ error: "Poli not found for this doctor" }, { status: 404 })
    }
    return NextResponse.json({ poliId: result.poli_id })
  } catch (error) {
    console.error("Error fetching poli for dokter:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}