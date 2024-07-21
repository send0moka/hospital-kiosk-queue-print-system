import { NextResponse } from "next/server"
import { searchUmumBooking } from "@/lib/serverUtils"
import { createSlug } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const kodeBooking = searchParams.get('kode')

  if (!kodeBooking) {
    return NextResponse.json({ error: "Kode booking is required" }, { status: 400 })
  }

  try {
    const booking = await searchUmumBooking(kodeBooking)
    if (booking) {
      const poliSlug = createSlug(booking.poli_nama)
      return NextResponse.json({
        ...booking,
        poli_slug: poliSlug,
        redirect: `/umum/pasien-lama/sudah-booking/${kodeBooking}/${poliSlug}`
      })
    } else {
      return NextResponse.json({ error: "Booking Umum tidak ditemukan" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error searching Umum booking:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}