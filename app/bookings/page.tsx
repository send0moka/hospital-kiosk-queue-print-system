import { executeQuery } from "@/lib/utils"

async function getBookings(): Promise<any[]> {
  const bookings: any[] = await executeQuery("SELECT * FROM booking")
  return bookings
}

export default async function BookingsPage() {
  const bookings: any[] = await getBookings()

  return (
    <div>
      <h1>Bookings</h1>
      <ul>
        {bookings.map((booking: any) => (
          <li key={booking.id}>{booking.kode_booking}</li>
        ))}
      </ul>
    </div>
  )
}