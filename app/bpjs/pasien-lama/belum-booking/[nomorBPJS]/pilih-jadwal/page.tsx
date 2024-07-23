"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { Layout } from "@/components/organisms"
import { Spinner } from "@radix-ui/themes"
import { Button } from "@/components/atoms"
import { ConfirmModal } from "@/components/molecules"

interface Jadwal {
  id: number
  hari: string
  jam_mulai: string
  jam_selesai: string
}

export default function PilihJadwal() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const bookingId = searchParams.get("bookingId")
  const dokterId = searchParams.get("dokterId")
  const nomorBPJS = params.nomorBPJS as string

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | null>(null)

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!dokterId) {
        setError("Missing required parameters")
        setIsLoading(false)
        return
      }
  
      try {
        const response = await fetch(`/api/jadwal/list?dokter_id=${dokterId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch jadwal")
        }
        const data = await response.json()
        console.log("Received jadwal data:", data)
        setJadwalList(data)
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data jadwal")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchJadwal()
  }, [dokterId])

  console.log("Current jadwalList:", jadwalList)

  const handlePilihJadwal = async (jadwalId: number) => {
    setSelectedJadwalId(jadwalId)
    setIsConfirmModalOpen(true)
  }

  const isJadwalAvailable = (jamMulai: string) => {
    const now = new Date()
    const [hour, minute] = jamMulai.split(":").map(Number)

    // Buat objek Date untuk jadwal hari ini
    const jadwalTime = new Date(now)
    jadwalTime.setHours(hour, minute, 0, 0)

    // Jika jadwal sudah lewat untuk hari ini, anggap untuk besok
    if (jadwalTime < now) {
      jadwalTime.setDate(jadwalTime.getDate() + 1)
    }

    // Tambahkan buffer 15 menit
    const bufferTime = new Date(now.getTime() + 15 * 60000)

    console.log(`Checking jadwal: ${jamMulai}`)
    console.log(
      `Current time: ${now.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })}`
    )
    console.log(
      `Jadwal time: ${jadwalTime.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })}`
    )
    console.log(
      `Buffer time: ${bufferTime.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })}`
    )

    const isAvailable = jadwalTime > bufferTime
    console.log(`Is available: ${isAvailable}`)

    return isAvailable
  }

  const handleConfirmBooking = async () => {
    setIsConfirmModalOpen(false)
    if (selectedJadwalId === null) return

    try {
      const response = await fetch(`/api/bookings/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, jadwalDokterId: selectedJadwalId }),
      })

      if (!response.ok) {
        throw new Error("Failed to confirm booking")
      }

      const data = await response.json()

      // Redirect ke halaman cetak antrian
      router.push(`/bpjs/pasien-lama/cetak-antrian/${data.antrianId}`)
    } catch (err) {
      setError("Terjadi kesalahan saat konfirmasi jadwal")
      console.error(err)
    }
  }

  const handleCancelBooking = async () => {
    setIsConfirmModalOpen(false)
    try {
      const response = await fetch(`/api/bookings/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      router.push(`/bpjs/pasien-lama/belum-booking/`)
    } catch (err) {
      setError("Terjadi kesalahan saat membatalkan booking")
      console.error(err)
    }
  }

  if (isLoading) return <Spinner />
  if (error) return <div>{error}</div>

  const today = new Date()
  const currentTime = today.getHours() * 60 + today.getMinutes()

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Pilih Jadwal</h1>
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
      {jadwalList.length === 0 ? (
        <p>Tidak ada jadwal tersedia untuk hari ini</p>
      ) : (
        <div className="flex flex-grow flex-wrap justify-center items-center gap-4">
          {jadwalList.map((jadwal) => {
            const isAvailable = isJadwalAvailable(jadwal.jam_mulai)
            return (
              <Button
                key={jadwal.id}
                onClick={() => handlePilihJadwal(jadwal.id)}
                variant="primary"
                className="p-8"
                disabled={!isAvailable}
              >
                {jadwal.jam_mulai} - {jadwal.jam_selesai}
                {!isAvailable && " (Tidak tersedia)"}
              </Button>
            )
          })}
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
    </Layout>
  )
}