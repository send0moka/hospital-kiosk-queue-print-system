import { NextResponse } from "next/server"
import { searchBPJSBooking } from "@/lib/serverUtils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const kodeBooking = searchParams.get("kode")
  if (!kodeBooking) {
    return NextResponse.json(
      { error: "Kode booking is required" },
      { status: 400 }
    )
  }
  try {
    const booking = await searchBPJSBooking(kodeBooking)
    if (booking) {
      if (booking.status === "Selesai") {
        return NextResponse.json(
          { error: "Booking BPJS sudah selesai" },
          { status: 400 }
        )  
      } else if (booking.fingerprint_status) {
        return NextResponse.json({ nomor_bpjs: booking.nomor_bpjs })
      } else {
        return NextResponse.json({ redirect: "/fingerprint" })
      }
    } else {
      return NextResponse.json(
        { error: "Booking BPJS tidak ditemukan" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error searching BPJS booking:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
