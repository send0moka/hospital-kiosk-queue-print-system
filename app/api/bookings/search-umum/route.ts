import { searchUmumBooking } from "@/lib/serverUtils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kodeBooking = searchParams.get('kode');
  if (!kodeBooking) {
    return NextResponse.json({ error: "Kode booking is required" }, { status: 400 });
  }
  try {
    const booking = await searchUmumBooking(kodeBooking)
    if (booking) {
      if (booking.status === "Selesai") {
        return NextResponse.json({ error: "Booking Umum sudah selesai" }, { status: 400 });
      }
      return NextResponse.json(booking)
    } else {
      return NextResponse.json({ error: "Booking Umum tidak ditemukan" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error searching booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
