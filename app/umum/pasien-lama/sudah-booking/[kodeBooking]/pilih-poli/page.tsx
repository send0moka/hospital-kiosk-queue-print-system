"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Layout } from "@/components/organisms"
import { PoliCard } from "@/components/molecules"
import { createSlug } from "@/lib/utils"

interface Poli {
  id: number
  nama: string
  icon: string
  jumlah_dokter: number
}

const PilihPoli = () => {
  const router = useRouter()
  const params = useParams()
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [poliList, setPoliList] = useState<Poli[]>([])

  useEffect(() => {
    if (params.nomorRM) {
      setIdentifier(params.nomorRM as string)
    } else if (params.kodeBooking) {
      setIdentifier(params.kodeBooking as string)
    }
    fetchPoliList()
  }, [params])

  const fetchPoliList = async () => {
    try {
      const response = await fetch("/api/poli/list")
      const data = await response.json()
      setPoliList(data)
    } catch (error) {
      console.error("Error fetching poli list:", error)
    }
  }

  const handlePoliSelection = (poliId: number, poliNama: string) => {
    const poliSlug = createSlug(poliNama);
    if (params.nomorRM) {
      router.push(`/umum/pasien-lama/sudah-booking/${params.kodeBooking}/${poliSlug}`)
    } else if (params.kodeBooking) {
      router.push(`/umum/pasien-lama/belum-booking/${params.nomorRM}/${poliSlug}`)
    }
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Pilih Poliklinik</h1>
        <div className="flex items-center gap-2">
          <p className="bg-Umum h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Umum
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
      <div className="flex flex-wrap flex-grow justify-center gap-4">
        {poliList.map((poli: Poli) => (
          <PoliCard
            key={poli.id}
            nama={poli.nama}
            jumlahDokter={poli.jumlah_dokter}
            icon={poli.icon}
            onClick={() => handlePoliSelection(poli.id, poli.nama)}
          />
        ))}
      </div>
    </Layout>
  )
}

export default PilihPoli
