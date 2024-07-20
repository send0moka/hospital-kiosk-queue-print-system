"use client"

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Layout } from "@/components/organisms"
import { PoliCard } from "@/components/molecules"

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
  const [poliList, setPoliList] = useState([])

  useEffect(() => {
    if (params.kodeBooking) {
      setIdentifier(params.kodeBooking as string)
    } else if (params.nomorRM) {
      setIdentifier(params.nomorRM as string)
    }
    fetchPoliList()
  }, [params])

  const fetchPoliList = async () => {
    try {
      const response = await fetch('/api/poli/list')
      const data = await response.json()
      setPoliList(data)
    } catch (error) {
      console.error('Error fetching poli list:', error)
    }
  }

  const handlePoliSelection = (poliId: number) => {
    // Implement the next step after poli selection
    console.log(`Selected poli ${poliId} for ${identifier}`)
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
        {poliList.map((poli: any) => (
          <PoliCard
            key={poli.id}
            nama={poli.nama}
            jumlahDokter={poli.jumlah_dokter}
            icon={poli.icon}
            onClick={() => handlePoliSelection(poli.id)}
          />
        ))}
      </div>
    </Layout>
  )
}

export default PilihPoli