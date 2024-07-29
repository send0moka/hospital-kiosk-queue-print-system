"use client";
import { Layout } from "@/components/organisms"
import { Button } from "@/components/atoms"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BookingInvalidPage({ params }: { params: { kodeBooking: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  console.log("Kode Booking:", params.kodeBooking);
  const handleDeleteBooking = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: params.kodeBooking })
      })
      const data = await response.json()
      if (response.ok) {
        router.push('/bpjs/pasien-lama')
      } else {
        throw new Error(data.error || 'Failed to delete booking')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleEditBooking = () => {
    router.push(`/bpjs/pasien-lama/sudah-booking/${params.kodeBooking}/pilih-dokter`)
  }
  return (
    <Layout>
      <div className="flex flex-col flex-grow items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-4">Booking Tidak Valid</h1>
        <p className="text-xl mb-8">
          Maaf, booking Anda tidak valid untuk hari ini. Silakan pilih opsi di bawah ini:
        </p>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleDeleteBooking}
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : 'Hapus Booking'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleEditBooking}
          >
            Edit Booking
          </Button>
        </div>
      </div>
    </Layout>
  )
}