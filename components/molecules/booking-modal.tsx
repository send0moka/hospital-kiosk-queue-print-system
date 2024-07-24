"use client"
import React from "react"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Button,
} from "@/components/atoms"
import { useRouter } from "next/navigation"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any | null
  error: string | null
  type: "bpjs-sudah-booking" | "umum-sudah-booking" | "bpjs-belum-booking" | "umum-belum-booking"
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  error,
  type,
}) => {
  const router = useRouter()
  const handleContinue = async () => {
    if (booking) {
      try {
        const response = await fetch('/api/bookings/confirm-existing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: booking.id }),
        })
        const data = await response.json()
        if (response.ok && data.antrianId) {
          router.push(`/umum/pasien-lama/cetak-antrian/${data.antrianId}`)
        } else {
          console.error('Failed to confirm booking:', data.error)
        }
      } catch (error) {
        console.error('Error confirming booking:', error)
      }
    }
  }
  const handleCancel = async () => {
    if (booking) {
      try {
        const response = await fetch('/api/bookings/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: booking.id }),
        })
        if (response.ok) {
          router.back()
        } else {
          console.error('Failed to cancel booking')
        }
      } catch (error) {
        console.error('Error cancelling booking:', error)
      }
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="text-black">
          <DialogHeader>
            <DialogTitle>{booking ? "Data Pasien" : "Error"}</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            {booking ? (
              <div>
                <div>Nama: {booking.nama}</div>
                {type.includes("bpjs") ? (
                  <div>Nomor BPJS: {booking.nomor_bpjs}</div>
                ) : (
                  <div>Nomor Rekam Medis: {booking.nomor_rekam_medis}</div>
                )}
                {type.includes("sudah-booking") && (
                  <>
                    <div>Kode Booking: {booking.kode_booking}</div>
                    <div>
                      Tanggal Booking:{" "}
                      {new Date(booking.tanggal_booking).toLocaleDateString()}
                    </div>
                    <div>Jam Booking: {booking.jam_booking}</div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-red-500">{error}</div>
            )}
          </DialogDescription>
          <DialogFooter>
            {booking && (
              <>
                <Button variant="destructive" onClick={handleCancel}>Hapus Booking</Button>
                <Button variant="primary" onClick={handleContinue}>Lanjut</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default BookingModal