"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/atoms"
import Image from "next/image"
import { useEffect, useState } from 'react'

export default function CetakAntrianClient({ antrian }: { antrian: any }) {
  const router = useRouter()
  const [isPrinting, setIsPrinting] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState('')
  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        const response = await fetch('/api/bookings/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: antrian.booking_id, status: 'Selesai' })
        })
        if (!response.ok) {
          throw new Error('Failed to update booking status')
        }
      } catch (error) {
        console.error('Error updating booking status:', error)
      }
    }
    updateBookingStatus()
    const timer = setInterval(() => {
      const now = new Date()
      const jakartaTime = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now)
      setCurrentDateTime(jakartaTime)
    }, 1000)
    return () => clearInterval(timer)
  }, [antrian.booking_id])
  const handlePrint = async () => {
    setIsPrinting(true)
    try {
      const response = await fetch('/api/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ antrian })
      })
      if (response.ok) {
        const successPage = antrian.jenis_pasien === 'BPJS' 
          ? '/bpjs/pasien-lama/sukses'
          : '/umum/pasien-lama/sukses'
        router.push(successPage)
      } else {
        throw new Error('Failed to print')
      }
    } catch (error) {
      console.error('Error printing:', error)
      setIsPrinting(false)
    }
  }
  return (
    <div className="flex flex-col gap-4 w-fit mx-auto flex-grow">
      <div id="receipt" className="text-black bg-white shadow-lg flex flex-col justify-center items-center p-8">
        <Image
          src="/images/logo.png"
          className="mb-1"
          alt="Logo RS"
          width={50}
          height={50}
        />
        <p className="text-sm">Rumah Sakit Umum</p>
        <strong>St. Elisabeth Purwokerto</strong>
        <small>Jalan Dokter Angka No. 40 Purwokerto, 53116</small>
        <p className="text-2xl text-center my-4">
          SELAMAT DATANG
          <br /> NO. ANTRIAN ANDA
        </p>
        <p className="text-7xl font-black">{antrian.nomor_antrian}</p>
        <div className="my-5 text-center">
          <p>{antrian.nama_pasien}</p>
          <p>{antrian.nama_poli}</p>
          <p>{antrian.nama_dokter}</p>
          <p>{antrian.hari}, {antrian.jam_mulai} - {antrian.jam_selesai}</p>
        </div>
        <p className="text-2xl text-center mb-2">
          TERIMA KASIH
          <br />
          ANDA TELAH MENUNGGU
        </p>
        <small>{currentDateTime}</small>
      </div>
      <Button variant="primary" onClick={handlePrint} disabled={isPrinting}>
        {isPrinting ? 'Mencetak...' : 'Cetak'}
      </Button>
    </div>
  )
}
