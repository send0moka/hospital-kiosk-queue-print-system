import { Layout } from "@/components/organisms"
import { executeQuery } from "@/lib/utils"
import { getSession } from "@/lib/session"

async function getBookingData(bookingId: string) {
  const session = await getSession()
  if (!session || !session.user || !session.user.id) {
    return null
  }

  const [booking]: any[] = await executeQuery(
    `SELECT b.*, p.nama as poli_nama
     FROM booking b
     JOIN poli p ON b.poli_id = p.id
     WHERE b.id = ? AND b.pasien_id = ?`,
    [bookingId, session.user.id]
  )

  return booking
}

export default async function BookingConfirmation({ params }: { params: { bookingId: string } }) {
  const booking = await getBookingData(params.bookingId)

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Konfirmasi Booking</h1>
      {booking ? (
        <div className="space-y-2">
          <p>Kode Booking: {booking.kode_booking}</p>
          <p>Tanggal: {new Date(booking.tanggal_booking).toLocaleDateString()}</p>
          <p>Jam: {booking.jam_booking}</p>
          <p>Poli: {booking.poli_nama}</p>
          <p>Status: {booking.status}</p>
        </div>
      ) : (
        <p className="text-red-500">Booking tidak ditemukan</p>
      )}
    </Layout>
  )
}