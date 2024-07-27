"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/atoms"

const Header = () => {
  const pathname = usePathname()
  
  // Fungsi untuk mengecek apakah rute saat ini adalah halaman utama atau halaman sukses
  const isMainOrSuccessPage = () => {
    return pathname === '/' || pathname?.startsWith('/success/')
  }

  return (
    <div>
      {isMainOrSuccessPage() ? (
        // Logo besar untuk halaman utama dan halaman sukses
        <div className="flex gap-4 items-center mb-5">
          <Logo className="h-10 md:h-12 lg:h-24" />
          <div>
            <p className="text-[24px] font-medium">Rumah Sakit Umum</p>
            <h1 className="-mt-3 text-[48px] font-bold tracking-tight">St. Elisabeth Purwokerto</h1>
          </div>
        </div>
      ) : (
        // Logo kecil untuk halaman lainnya
        <div className="flex gap-2 items-center">
          <Logo className="h-8 md:h-10 lg:h-12" />
          <div>
            <small>Rumah Sakit Umum</small>
            <p className="-mt-1 font-bold text-[20px]">St. Elisabeth Purwokerto</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header