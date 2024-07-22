"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { Layout } from "@/components/organisms"
import { Button } from "@/components/atoms"
import { Spinner } from "@radix-ui/themes"
import Image from 'next/image'
import { DokterCard } from '@/components/molecules'

interface Doctor {
  id: number;
  nama: string;
  spesialisasi: string;
  foto: string;
  jam_mulai: string;
  jam_selesai: string;
}

export default function PilihDokter() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const poliId = searchParams.get('poli_id')
  const tanggal = searchParams.get('tanggal')
  const bookingId = searchParams.get('bookingId')
  const nomorBPJS = params.nomorBPJS as string

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!poliId || !tanggal) {
        setError('Missing required parameters')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/dokter/list?poli_id=${poliId}&tanggal=${tanggal}&jenis_layanan=BPJS`)
        if (!response.ok) {
          throw new Error('Failed to fetch doctors')
        }
        const data = await response.json()
        setDoctors(data)
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data dokter')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [poliId, tanggal])

  const handlePilihDokter = async (dokterId: number) => {
    try {
      const response = await fetch(`/api/bookings/update-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, dokterId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      router.push(`/bpjs/pasien-lama/belum-booking/${nomorBPJS}/rujukan/confirmation/${bookingId}`)
    } catch (err) {
      setError('Terjadi kesalahan saat memilih dokter')
      console.error(err)
    }
  }

  if (isLoading) return <Spinner />
  if (error) return <div>{error}</div>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pilih Dokter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          // <div key={doctor.id} className="bg-white text-black p-4 rounded-lg shadow">
          //   <Image src={`/icons/dokter/${doctor.foto}.svg`}  alt={doctor.nama} className="w-full h-48 object-cover mb-2 rounded" width={300} height={300} />
          //   <h2 className="text-xl font-semibold">{doctor.nama}</h2>
          //   <p>{doctor.spesialisasi}</p>
          //   <p>Jam Praktek: {doctor.jam_mulai} - {doctor.jam_selesai}</p>
          //   <Button onClick={() => handlePilihDokter(doctor.id)} variant="primary" className="mt-2">
          //     Pilih Dokter
          //   </Button>
          // </div>
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