import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const { bookingId, jadwalDokterId, nomorBpjs } = await req.json()
    console.log("Received data:", { bookingId, jadwalDokterId, nomorBpjs })
    // Validasi tipe data yang diterima
    if (
      typeof bookingId !== "number" ||
      typeof jadwalDokterId !== "number" ||
      typeof nomorBpjs !== "string"
    ) {
      console.error("Invalid data types:", {
        bookingId,
        jadwalDokterId,
        nomorBpjs,
      })
      return NextResponse.json({ error: "Invalid data types" }, { status: 400 })
    }
    // Verifikasi booking berdasarkan nomor BPJS dan booking ID
    const [booking]: any[] = await executeQuery(
      `SELECT b.*, p.id as pasien_id FROM booking b
       JOIN pasien p ON b.pasien_id = p.id
       WHERE b.id = ? AND p.nomor_bpjs = ? AND b.jenis_layanan = 'BPJS'`,
      [bookingId, nomorBpjs]
    )
    console.log("Booking search result:", booking)

    if (!booking) {
      console.error(
        "Booking not found with bookingId:",
        bookingId,
        "and nomorBpjs:",
        nomorBpjs
      )
      return NextResponse.json(
        { error: "Booking tidak ditemukan" },
        { status: 404 }
      )
    }

    // Proses konfirmasi booking
    await executeQuery(
      `UPDATE booking b
       JOIN jadwal_dokter jd ON jd.id = ?
       SET b.jadwal_dokter_id = ?, b.dokter_id = jd.dokter_id, b.status = 'Terkonfirmasi'
       WHERE b.id = ?`,
      [jadwalDokterId, jadwalDokterId, bookingId]
    )

    // Ambil tanggal booking
    const [bookingData]: any[] = await executeQuery(
      `SELECT tanggal_booking FROM booking WHERE id = ?`,
      [bookingId]
    )

    // Cek nomor antrian terakhir untuk tanggal tersebut
    const [lastAntrian]: any[] = await executeQuery(
      `SELECT MAX(nomor_antrian) as last_number FROM antrian 
       WHERE DATE(created_at) = ? AND booking_id IN (SELECT id FROM booking WHERE tanggal_booking = ?)`,
      [bookingData.tanggal_booking, bookingData.tanggal_booking]
    )

    // Generate nomor antrian baru
    let newAntrianNumber = 1
    if (lastAntrian && lastAntrian.last_number) {
      newAntrianNumber = lastAntrian.last_number + 1
    }

    // Format nomor antrian menjadi 3 digit
    const formattedAntrianNumber = newAntrianNumber.toString().padStart(3, "0")

    // Insert nomor antrian baru
    const { insertId: antrianId } = await executeQuery<any>(
      `INSERT INTO antrian (booking_id, nomor_antrian) VALUES (?, ?)`,
      [bookingId, formattedAntrianNumber]
    )

    return NextResponse.json({
      success: true,
      antrianId,
      nomorAntrian: formattedAntrianNumber,
    })
  } catch (error) {
    console.error("Error confirming existing booking:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
