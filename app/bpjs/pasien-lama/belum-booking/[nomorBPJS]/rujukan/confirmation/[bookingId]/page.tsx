import { Layout } from "@/components/organisms"
import { executeQuery } from "@/lib/utils"
import { getSession } from "@/lib/session"

async function getBookingData(bookingId: string, nomorBPJS: string) {
  const [booking]: any[] = await executeQuery(
    `SELECT b.*, p.nama as poli_nama, d.nama as dokter_nama
     FROM booking b
     JOIN poli p ON b.poli_id = p.id
     LEFT JOIN dokter d ON b.dokter_id = d.id
     JOIN pasien pas ON b.pasien_id = pas.id
     WHERE b.id = ? AND pas.nomor_bpjs = ?`,
    [bookingId, nomorBPJS]
  )

  return booking
}

export default async function BookingConfirmation({ params }: { params: { bookingId: string, nomorBPJS: string } }) {
  const booking = await getBookingData(params.bookingId, params.nomorBPJS)

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Konfirmasi Booking</h1>
      {booking ? (
        <div className="space-y-2">
          <p>Kode Booking: {booking.kode_booking}</p>
          <p>Tanggal: {new Date(booking.tanggal_booking).toLocaleDateString()}</p>
          <p>Jam: {booking.jam_booking}</p>
          <p>Poli: {booking.poli_nama}</p>
          <p>Dokter: {booking.dokter_nama || 'Belum dipilih'}</p>
          <p>Status: {booking.status}</p>
        </div>
      ) : (
        <p className="text-red-500">Booking tidak ditemukan</p>
      )}
    </Layout>
  )
}