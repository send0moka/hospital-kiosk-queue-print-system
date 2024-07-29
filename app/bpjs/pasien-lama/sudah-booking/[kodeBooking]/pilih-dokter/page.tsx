"use client"
import { useState, useEffect } from "react"
import { Layout } from "@/components/organisms"
import { Button } from "@/components/atoms"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Doctor = {
  id: number
  nama: string
  foto: string
  spesialisasi: string
  jam_mulai: string | null
  jam_selesai: string | null
  has_schedule: boolean
}

type Booking = {
  id: number
  poli_id: number
}

export default function PilihDokterPage({
  params,
}: {
  params: { kodeBooking: string }
}) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const bookingResponse = await fetch(`/api/bookings/${params.kodeBooking}`)
        if (!bookingResponse.ok) {
          throw new Error('Failed to fetch booking data')
        }
        const bookingData: Booking = await bookingResponse.json()
        setBooking(bookingData)
        const doctorsResponse = await fetch(`/api/dokter/list?poli_id=${bookingData.poli_id}&tanggal=${new Date().toISOString().split('T')[0]}&jenis_layanan=BPJS`)
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors')
        }
        const doctorsData: Doctor[] = await doctorsResponse.json()
        setDoctors(doctorsData)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        alert("Failed to load doctors. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDoctors()
  }, [params.kodeBooking])
  const handleSelectDoctor = async (doctorId: number) => {
    if (!booking) {
      alert('Booking data not available')
      return
    }
    try {
      const response = await fetch("/api/bookings/update-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          dokterId: doctorId,
        }),
      })
      if (response.ok) {
        router.push(
          `/bpjs/pasien-lama/sudah-booking/${params.kodeBooking}/pilih-jadwal`
        )
      } else {
        throw new Error("Failed to update doctor")
      }
    } catch (error) {
      console.error("Error updating doctor:", error)
      alert("Failed to select doctor. Please try again.")
    }
  }
  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Pilih Dokter</h1>
        <div className="flex items-center gap-2">
          <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            BPJS
          </p>
          |
          <p className="bg-Pasien Lama h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Pasien Lama
          </p>
          |
          <p className="bg-Belum Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Belum Booking
          </p>
          |
          <p className="bg-Rujukan h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Rujukan
          </p>
        </div>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex flex-col items-center gap-3 cursor-pointer bg-white min-w-[560px] px-3 py-2 rounded-lg transition-transform hover:scale-105">
              <div className="flex items-center gap-4">
              <Image
                src={`/icons/dokter/${doctor.foto}.svg`}
                alt={doctor.nama}
                className='rounded-full h-fit'
                width={65}
                height={65}
              />
              <div className="text-black">
                <h3 className="font-bold text-xl">{doctor.nama}</h3>
                <p>{doctor.spesialisasi}</p>
                {doctor.has_schedule ? (
                  <p>Jadwal: {doctor.jam_mulai} - {doctor.jam_selesai}</p>
                ) : (
                  <p className="text-red-500">Tidak ada jadwal hari ini</p>
                )}
              </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectDoctor(doctor.id)}
                disabled={!doctor.has_schedule}
                className={`w-full mt-2 ${!doctor.has_schedule ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {doctor.has_schedule ? 'Pilih Dokter' : 'Tidak Tersedia'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
