"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { Layout } from "@/components/organisms"
import { Spinner } from "@radix-ui/themes"
import { DokterCard } from "@/components/molecules"

interface Doctor {
  id: number
  nama: string
  spesialisasi: string
  foto: string
}

export default function PilihDokter() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const poliId = searchParams.get("poli_id")
  const bookingId = searchParams.get("bookingId")
  const nomorBPJS = params.nomorBPJS as string

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!poliId) {
        setError("Missing required parameters")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/dokter/list-by-poli?poli_id=${poliId}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }
        const data = await response.json()
        setDoctors(data)
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data dokter")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [poliId])

  const handlePilihDokter = async (dokterId: number) => {
    try {
      const response = await fetch(`/api/bookings/update-doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, dokterId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update booking")
      }

      // Redirect to the jadwal selection page (not yet created)
      router.push(
        `/bpjs/pasien-lama/belum-booking/${nomorBPJS}/pilih-jadwal?bookingId=${bookingId}&dokterId=${dokterId}`
      )
    } catch (err) {
      setError("Terjadi kesalahan saat memilih dokter")
      console.error(err)
    }
  }

  if (isLoading) return <Spinner />
  if (error) return <div>{error}</div>

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
        </div>
      </div>

      <div className="flex-grow flex flex-wrap justify-center items-center gap-4">
        {doctors.map((doctor) => (
          <DokterCard
            key={doctor.id}
            nama={doctor.nama}
            foto={doctor.foto}
            spesialisasi={doctor.spesialisasi}
            onClick={() => handlePilihDokter(doctor.id)}
          />
        ))}
      </div>
    </Layout>
  )
}
