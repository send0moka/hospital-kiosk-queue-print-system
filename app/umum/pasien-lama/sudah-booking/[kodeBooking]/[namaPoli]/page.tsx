"use client"

import { useRouter, useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Layout } from "@/components/organisms"
import { DokterCard } from "@/components/molecules"
import { createSlug } from "@/lib/utils"

interface Dokter {
  id: number
  nama: string
  foto: string
  spesialisasi: string
}

const PilihDokter = () => {
  const router = useRouter()
  const params = useParams()
  const [dokterList, setDokterList] = useState<Dokter[]>([])
  const [error, setError] = useState<string | null>(null)

  // Add this at the top of your component, after the useState declarations
  const fetchDokterList = useCallback(async () => {
    try {
      const poliSlug = params.namaPoli as string;
      const poliId = await getPoliId(poliSlug);
      if (!poliId) {
        setError("Poli tidak ditemukan");
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      const jenis_layanan = 'Umum'; // atau 'BPJS' tergantung konteks
      const response = await fetch(`/api/dokter/list?poli_id=${poliId}&tanggal=${today}&jenis_layanan=${jenis_layanan}`);
      const data = await response.json();
      setDokterList(data);
    } catch (error) {
      console.error("Error fetching dokter list:", error);
      setError("Gagal mengambil daftar dokter");
    }
  }, [params.namaPoli]);

  useEffect(() => {
    fetchDokterList()
  }, [params.namaPoli, fetchDokterList])

  const getPoliId = async (poliSlug: string) => {
    try {
      const response = await fetch(`/api/poli/get-id?slug=${encodeURIComponent(poliSlug)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch poli ID');
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Error fetching poli ID:", error);
      return null;
    }
  }

  const handleDokterSelection = (dokterId: number) => {
    router.push(`/umum/pasien-lama/sudah-booking/${params.kodeBooking}/konfirmasi?dokter=${dokterId}&poli=${params.namaPoli}`)
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Pilih Dokter</h1>
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
      <div className="flex-grow flex justify-center items-center">
      {dokterList.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {dokterList.map((dokter: Dokter) => (
            <DokterCard
              key={dokter.id}
              nama={dokter.nama}
              foto={dokter.foto}
              spesialisasi={dokter.spesialisasi}
              onClick={() => handleDokterSelection(dokter.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-2xl mt-8">Tidak ada dokter yang tersedia hari ini.</p>
      )}
      </div>
    </Layout>
  )
}

export default PilihDokter