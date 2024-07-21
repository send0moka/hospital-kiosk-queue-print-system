import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dokterId = searchParams.get('dokter_id')

  if (!dokterId) {
    return NextResponse.json({ error: "Dokter ID is required" }, { status: 400 })
  }

  try {
    const today = new Date()
    const dayOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][today.getDay()]
    
    const jadwalList = await executeQuery(`
      SELECT id, hari, jam_mulai, jam_selesai
      FROM jadwal_dokter
      WHERE dokter_id = ? AND hari = ?
      ORDER BY jam_mulai
    `, [dokterId, dayOfWeek]);
    
    return NextResponse.json(jadwalList)
  } catch (error) {
    console.error("Error fetching jadwal list:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}