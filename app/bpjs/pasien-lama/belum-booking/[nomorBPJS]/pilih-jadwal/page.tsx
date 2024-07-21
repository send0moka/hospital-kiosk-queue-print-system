"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { Layout } from "@/components/organisms"
import { Spinner } from "@radix-ui/themes"
import { Button } from "@/components/atoms"

interface Jadwal {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

export default function PilihJadwal() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const bookingId = searchParams.get('bookingId')
  const dokterId = searchParams.get('dokterId')
  const nomorBPJS = params.nomorBPJS as string

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!dokterId) {
        setError('Missing required parameters')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/jadwal/list?dokter_id=${dokterId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch jadwal')
        }
        const data = await response.json()
        setJadwalList(data)
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data jadwal')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJadwal()
  }, [dokterId])

  const handlePilihJadwal = async (jadwalId: number) => {
    try {
      const response = await fetch(`/api/bookings/update-jadwal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, jadwalId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      router.push(`/bpjs/pasien-lama/belum-booking/${nomorBPJS}/rujukan/confirmation/${bookingId}`)
    } catch (err) {
      setError('Terjadi kesalahan saat memilih jadwal')
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
            const [jamMulai, menitMulai] = jadwal.jam_mulai.split(':').map(Number)
            const jadwalMulai = jamMulai * 60 + menitMulai
            const isAvailable = jadwalMulai > currentTime

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
    </Layout>
  )
}