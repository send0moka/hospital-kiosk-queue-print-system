import { NextResponse } from "next/server"
import { searchUmumBooking } from "@/lib/serverUtils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const kodeBooking = searchParams.get('kode')

  if (!kodeBooking) {
    return NextResponse.json({ error: "Kode booking is required" }, { status: 400 })
  }

  try {
    const booking = await searchUmumBooking(kodeBooking)
    if (booking) {
      return NextResponse.json({
        ...booking,
        redirect: `/umum/pasien-lama/sudah-booking/${kodeBooking}/poli`
      })
    } else {
      return NextResponse.json({ error: "Booking Umum tidak ditemukan" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error searching Umum booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}