"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms"
import { Spinner } from "@radix-ui/themes"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Rujukan {
  id: number
  nomor_rujukan: string
  tanggal_rujukan: string
  faskes_perujuk: string
  diagnosis: string
  poli: string
}

const RujukanList: React.FC = () => {
  const [rujukan, setRujukan] = useState<Rujukan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchRujukan = async () => {
      if (status === "loading") return
      if (status === "unauthenticated") {
        router.push("/bpjs/pasien-lama/belum-booking")
        return
      }

      try {
        const response = await fetch("/api/rujukan")
        if (!response.ok) {
          throw new Error("Failed to fetch rujukan")
        }
        const data = await response.json()
        setRujukan(data)
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data rujukan")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRujukan()
  }, [status, router])

  const handlePilihRujukan = async (rujukanId: number) => {
    try {
      const response = await fetch("/api/bookings/create-bpjs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rujukanId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const data = await response.json()
      router.push(
        `/bpjs/pasien-lama/belum-booking/rujukan/confirmation/${data.bookingId}`
      )
    } catch (err) {
      setError("Terjadi kesalahan saat membuat booking")
      console.error(err)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="flex-grow flex flex-col gap-4 justify-center">
      {rujukan.length === 0 ? (
        <p>Tidak ada rujukan yang tersedia</p>
      ) : (
        rujukan.map((r) => (
          <div key={r.id} className="bg-white text-black p-4 rounded-lg">
            <div className="grid grid-cols-6 items-center">
              <div>
                <strong>Nomor Rujukan:</strong>
                <p>{r.nomor_rujukan}</p>
              </div>
              <div>
                <strong>Tanggal:</strong>
                <p>{new Date(r.tanggal_rujukan).toLocaleDateString()}</p>
              </div>
              <div>
                <strong>Faskes Perujuk:</strong>
                <p>{r.faskes_perujuk}</p>
              </div>
              <div>
                <strong>Diagnosis:</strong>
                <p>{r.diagnosis}</p>
              </div>
              <div>
                <strong>Poli Tujuan:</strong>
                <p>{r.poli}</p>
              </div>
              <Button
              onClick={() => handlePilihRujukan(r.id)}
              variant="primary"
            >
              Pilih
            </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default RujukanList