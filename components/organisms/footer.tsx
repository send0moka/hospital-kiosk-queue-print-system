"use client"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/atoms"
import { ArrowLeft, LogOut } from "lucide-react"

const Footer = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000) // Update setiap 1 detik

    return () => {
      clearInterval(timer) // Membersihkan interval ketika komponen unmount
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const handleBack = () => {
    router.back()
  }

  const handleExit = () => {
    router.push('/')
  }

  const isHomePage = pathname === '/'
  const isLoketPage = pathname === '/loket'

  return (
    <div className="flex justify-between items-center text-[24px]">
      {isHomePage ? (
        // Footer untuk halaman utama
        <>
          <p>{formatTime(currentDateTime)} | {formatDate(currentDateTime)}</p>
          <span>Self Service Application</span>
          <a href="bantuan">Bantuan & Informasi</a>
        </>
      ) : isLoketPage ? (
        // Footer untuk halaman loket
        <>
          <Button variant="secondary" className="gap-1 p-7" onClick={handleBack}>
            <ArrowLeft size={24} />
            Kembali
          </Button>
          <p>{formatTime(currentDateTime)} | {formatDate(currentDateTime)}</p>
          <Button variant="destructive" className="gap-1 p-7" onClick={handleExit}>
            <LogOut size={24} />
            Keluar
          </Button>
        </>
      ) : (
        // Footer untuk halaman lainnya
        <>
          <Button variant="secondary" className="gap-1 p-7" onClick={handleBack}>
            <ArrowLeft size={24} />
            Kembali
          </Button>
          <p>{formatTime(currentDateTime)} | {formatDate(currentDateTime)}</p>
          <a href="bantuan">Bantuan & Informasi</a>
        </>
      )}
    </div>
  )
}

export default Footer