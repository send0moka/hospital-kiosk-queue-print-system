"use client"
import { useState } from "react"
import { Button } from "@/components/atoms"
import { Layout } from "@/components/organisms"
import { ConfirmModal } from "@/components/molecules"
import { useRouter } from "next/navigation"

interface VerifikasiDataCheckInProps {
  patientData: PatientData;
  isExistingBooking: boolean;
}

type PatientData = {
  nomor_bpjs: string
  nomor_rekam_medis: string
  nama: string
  tanggal_lahir: string
  alamat: string
  poli_nama: string
  dokter_nama: string
  tanggal_booking: string
  jam_booking: string
  booking_id: number
  jadwal_dokter_id: number
}

export default function VerifikasiDataCheckIn({ patientData, isExistingBooking }: VerifikasiDataCheckInProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  // Format tanggal lahir
  const formatTanggalLahir = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("id-ID", options)
  }

  // Format jadwal kunjungan
  const formatJadwalKunjungan = (dateString: any, timeString: any) => {
    if (typeof dateString !== "string" || typeof timeString !== "string") {
      console.error("Invalid date or time format:", { dateString, timeString })
      return "Format tanggal atau waktu tidak valid"
    }

    try {
      const [year, month, day] = dateString.split("-").map(Number)
      const [hour, minute] = timeString.split(":").map(Number)

      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hour) ||
        isNaN(minute)
      ) {
        throw new Error("Invalid date or time components")
      }

      const date = new Date(year, month - 1, day, hour, minute)

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date")
      }

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }

      const time = date.toLocaleTimeString("id-ID", timeOptions)
      const formattedDate = date.toLocaleDateString("id-ID", dateOptions)

      return `${time} | ${formattedDate}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Gagal memformat tanggal dan waktu"
    }
  }

  const handleConfirm = async () => {
    try {
      console.log('Patient data before sending:', patientData);

      if (isExistingBooking && (!patientData.booking_id || !patientData.jadwal_dokter_id)) {
        throw new Error("Invalid booking ID or jadwal dokter ID");
      }
      
      const endpoint = isExistingBooking 
        ? "/api/bookings/confirm-existing"
        : "/api/bookings/confirm";

      const body = isExistingBooking
        ? {
            bookingId: patientData.booking_id,
            jadwalDokterId: patientData.jadwal_dokter_id,
            nomorBpjs: patientData.nomor_bpjs,
          }
        : {
            bookingId: patientData.booking_id,
            jadwalDokterId: patientData.jadwal_dokter_id,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: isExistingBooking ? 'omit' : 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to confirm booking");
      }

      const data = await response.json();
      router.push(`/bpjs/pasien-lama/cetak-antrian/${data.antrianId}`);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">
          Verifikasi Data dan Check-in
        </h1>
        <div className="flex items-center gap-2">
          <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            BPJS
          </p>
          |
          <p className="bg-Pasien Lama h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Pasien Lama
          </p>
          |
          <p className="bg-Sudah Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Sudah Booking
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-grow font-bold text-black bg-gradient-to-b from-white/70 to-blue-200/50 py-6 px-10 rounded-3xl shadow-lg">
        <h2 className="text-3xl">Mohon periksa kembali data Anda:</h2>
        <div className="bg-white/80 text-black text-[24px] p-6 rounded-lg">
          <table>
            <tbody>
              <tr>
                <td>Nomor BPJS</td>
                <td>:</td>
                <td>{patientData.nomor_bpjs}</td>
              </tr>
              <tr>
                <td>Nomor Rekam Medis</td>
                <td>:</td>
                <td>{patientData.nomor_rekam_medis}</td>
              </tr>
              <tr>
                <td>Nama Lengkap</td>
                <td>:</td>
                <td>{patientData.nama}</td>
              </tr>
              <tr>
                <td>Tanggal Lahir</td>
                <td>:</td>
                <td>{formatTanggalLahir(patientData.tanggal_lahir)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{patientData.alamat}</td>
              </tr>
              <tr>
                <td>Poliklinik</td>
                <td>:</td>
                <td>{patientData.poli_nama}</td>
              </tr>
              <tr>
                <td>Dokter</td>
                <td>:</td>
                <td>{patientData.dokter_nama}</td>
              </tr>
              <tr>
                <td>Jadwal Kunjungan</td>
                <td>:</td>
                <td>
                  {formatJadwalKunjungan(
                    patientData.tanggal_booking,
                    patientData.jam_booking
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
            Konfirmasi
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        onCancel={() => router.push("/bpjs/pasien-lama/sudah-booking")}
      />
    </Layout>
  )
}