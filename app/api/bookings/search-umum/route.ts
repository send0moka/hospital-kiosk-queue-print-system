import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kodeBooking = searchParams.get('kode');
  if (!kodeBooking) {
    return NextResponse.json({ error: "Kode booking is required" }, { status: 400 });
  }
  try {
    const booking = await executeQuery(
      `SELECT b.*, p.nama, p.nomor_rekam_medis 
       FROM booking b 
       JOIN pasien p ON b.pasien_id = p.id 
       WHERE b.kode_booking = ?`,
      [kodeBooking]
    );
    if (Array.isArray(booking) && booking.length > 0) {
      return NextResponse.json(booking[0]);
    } else {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error searching booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
