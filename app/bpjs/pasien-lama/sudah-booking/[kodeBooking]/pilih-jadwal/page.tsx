"use client";
import { useState, useEffect } from "react"
import { Layout } from "@/components/organisms"
import { Button } from "@/components/atoms"
import { useRouter } from "next/navigation"

type Schedule = {
  id: number
  hari: string
  jam_mulai: string
  jam_selesai: string
  poli_id: number
}

export default function PilihJadwalPage({ params }: { params: { kodeBooking: string } }) {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/jadwal/list?dokter_id=1`) // Replace 1 with the actual doctor ID
        if (response.ok) {
          const data = await response.json()
          setSchedules(data)
        } else {
          throw new Error('Failed to fetch schedules')
        }
      } catch (error) {
        console.error('Error fetching schedules:', error)
        alert('Failed to load schedules. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSchedules()
  }, [])
  const handleSelectSchedule = async (scheduleId: number) => {
    try {
      const response = await fetch('/api/bookings/update-jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: params.kodeBooking, jadwalId: scheduleId })
      })
      if (response.ok) {
        router.push(`/bpjs/pasien-lama/sudah-booking/${params.kodeBooking}`)
      } else {
        throw new Error('Failed to update schedule')
      }
    } catch (error) {
      console.error('Error updating schedule:', error)
      alert('Failed to select schedule. Please try again.')
    }
  }
  const isScheduleAvailable = (schedule: Schedule) => {
    const now = new Date()
    const [hours, minutes] = schedule.jam_selesai.split(':').map(Number)
    const scheduleEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    return now < scheduleEnd
  }
  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>
  }
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-4">Pilih Jadwal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-bold">{schedule.hari}</h2>
              <p>Jam: {schedule.jam_mulai} - {schedule.jam_selesai}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSelectSchedule(schedule.id)}
                disabled={!isScheduleAvailable(schedule)}
                className={`mt-2 ${!isScheduleAvailable(schedule) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isScheduleAvailable(schedule) ? 'Pilih Jadwal' : 'Tidak Tersedia'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}