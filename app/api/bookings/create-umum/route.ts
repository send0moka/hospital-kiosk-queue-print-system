import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    console.log("Received body:", body)
    const { poliId, dokterId } = body
    console.log("Extracted poliId:", poliId, "dokterId:", dokterId);
    if (!poliId) {
      return NextResponse.json({ error: "poliId is required" }, { status: 400 })
    }
    if (!dokterId) {
      return NextResponse.json({ error: "dokterId is required" }, { status: 400 })
    }
    const kodeBooking = Math.random().toString(36).substring(2, 8).toUpperCase()
    console.log("Generated kodeBooking:", kodeBooking)
    const insertQuery = `
      INSERT INTO booking (kode_booking, pasien_id, tanggal_booking, jam_booking, jenis_layanan, poli_id, dokter_id)
      VALUES (?, ?, CURDATE(), CURTIME(), 'Umum', ?, ?)
    `
    const insertParams = [kodeBooking, session.user.id, poliId, dokterId]
    console.log("Executing insert query:", insertQuery)
    console.log("Insert params:", insertParams)
    const result: { insertId: number } = await executeQuery(insertQuery, insertParams)
    console.log("Insert result:", result)
    const bookingId = result.insertId
    console.log("New booking created with ID:", bookingId)
    return NextResponse.json({ bookingId, kodeBooking })
  } catch (error) {
    console.error("Error in create-umum:", error)
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 })
  }
}