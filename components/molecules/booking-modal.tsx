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
} from "@/components/atoms"

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
            <button onClick={onClose}>Tutup</button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default BookingModal
