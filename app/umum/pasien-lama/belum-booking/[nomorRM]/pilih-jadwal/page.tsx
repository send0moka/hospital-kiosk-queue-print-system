"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { Layout } from "@/components/organisms"
import { Spinner } from "@radix-ui/themes"
import { Button } from "@/components/atoms"
import { ConfirmModal } from "@/components/molecules"
import { useSession } from "next-auth/react"

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
  const poliSlug = searchParams.get("poli")
  const nomorRM = params.nomorRM as string
  const [poliId, setPoliId] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | null>(null)
  const { data: session, status } = useSession()
  console.log("Session in PilihJadwal:", session)
  console.log("Session status:", status)
  useEffect(() => {
    console.log("Current poliId:", poliId);
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
        console.log("Fetched jadwal data:", data)
        setJadwalList(data)
        if (data.length > 0) {
          console.log("Setting poliId to:", data[0].poli_id)
          setPoliId(data[0].poli_id)
        } else {
          console.error("No poli_id found in jadwal data")
          setError("Tidak ada jadwal tersedia untuk hari ini")
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data jadwal")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJadwal()
  }, [dokterId, poliId])
  const handlePilihJadwal = async (jadwalId: number) => {
    setSelectedJadwalId(jadwalId)
    setIsConfirmModalOpen(true)
  }
  const handleConfirmBooking = async () => {
    setIsConfirmModalOpen(false)
    console.log("Selected jadwal ID:", selectedJadwalId)
    console.log("Current poliId:", poliId)
    console.log("Current dokterId:", dokterId)
    if (selectedJadwalId === null || poliId === null || !dokterId) {
      console.error("Missing required data for booking")
      setError("Data yang dibutuhkan tidak lengkap")
      return
    }
    try {
      console.log("Attempting to create booking with poliId:", poliId, "and dokterId:", dokterId)
      const createBookingResponse = await fetch(`/api/bookings/create-umum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poliId: poliId, dokterId: dokterId }),
        credentials: "include",
      })
      console.log("Create booking response status:", createBookingResponse.status);
      const responseData = await createBookingResponse.json();
      console.log("Create booking response data:", responseData);
      if (!createBookingResponse.ok) {
        console.error(
          "Create booking response not OK:",
          createBookingResponse.status,
          responseData
        )
        throw new Error(responseData.error || "Failed to create booking")
      }
      const { bookingId } = responseData
      console.log("Booking created successfully with ID:", bookingId)
      console.log(
        "Attempting to confirm booking with jadwalDokterId:",
        selectedJadwalId
      )
      const confirmResponse = await fetch(`/api/bookings/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, jadwalDokterId: selectedJadwalId }),
      })
      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json()
        console.error(
          "Confirm booking response not OK:",
          confirmResponse.status,
          errorData
        )
        throw new Error("Failed to confirm booking")
      }
      const data = await confirmResponse.json()
      router.push(`/umum/pasien-lama/cetak-antrian/${data.antrianId}`)
    } catch (err) {
      console.error("Error in handleConfirmBooking:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat membuat dan konfirmasi jadwal")
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
      router.push(`/umum/pasien-lama/belum-booking/`)
    } catch (err) {
      setError("Terjadi kesalahan saat membatalkan booking")
      console.error(err)
    }
  }
  if (status === "loading") {
    return <Spinner />;
  }
  if (isLoading) return <Spinner />
  const isJadwalAvailable = (jamMulai: string, jamSelesai: string) => {
    const now = new Date()
    const [hourMulai, minuteMulai] = jamMulai.split(":").map(Number)
    const [hourSelesai, minuteSelesai] = jamSelesai.split(":").map(Number)
    const jadwalMulai = new Date(now)
    jadwalMulai.setHours(hourMulai, minuteMulai, 0, 0)
    const jadwalSelesai = new Date(now)
    jadwalSelesai.setHours(hourSelesai, minuteSelesai, 0, 0)
    console.log(`Checking jadwal: ${jamMulai} - ${jamSelesai}`)
    console.log(`Current time: ${now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`)
    console.log(`Jadwal mulai: ${jadwalMulai.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`)
    console.log(`Jadwal selesai: ${jadwalSelesai.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`)
    const isAvailable = jadwalMulai.getDate() === now.getDate() && now <= jadwalSelesai
    console.log(`Is available: ${isAvailable}`)
    return isAvailable
  }
  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Pilih Jadwal</h1>
        <div className="flex items-center gap-2">
          <p className="bg-Umum h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Umum
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
      <div className="flex flex-grow flex-wrap justify-center items-center gap-4">
        {error ? (
          <div className="text-red-500 text-2xl">{error}</div>
        ) : (
          <>
            {jadwalList.length === 0 ? (
              <p className="text-2xl">Tidak ada jadwal tersedia untuk hari ini</p>
            ) : (
              <>
                {jadwalList.map((jadwal) => {
                  const isAvailable = isJadwalAvailable(jadwal.jam_mulai, jadwal.jam_selesai)
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
              </>
            )}
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
    </Layout>
  )
}
