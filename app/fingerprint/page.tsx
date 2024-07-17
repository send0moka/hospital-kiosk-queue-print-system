"use client"

import Image from "next/image"
import { Footer, Header } from "@/components/organisms"

const Fingerprint = () => {
  return (
    <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
      <Header />

      <div className="flex flex-col gap-6 flex-grow w-full">
        <h1 className="text-5xl font-bold text-center">
          Verifikasi Sidik Jari
        </h1>
        <div className="flex justify-center items-center flex-grow text-black bg-gradient-to-b from-white/70 to-blue-200/50 p-4 lg:px-20 rounded-3xl shadow-lg">
          <div className="space-y-8 text-[24px]">
            <p className="font-bold text-3xl">
              Untuk melanjutkan proses pendaftaran, Anda perlu melakukan verifikasi sidik jari.
            </p>
            <p>Langkah selanjutnya:</p>
            <div className="space-y-4 font-semibold">
            <p>
              1. Silakan menuju ke alat fingerprint yang tersedia di dekat area ini.
            </p>
            <p>
              2. Ikuti petunjuk pada alat fingerprint untuk melakukan verifikasi sidik jari Anda.
            </p>
            <p>
              3. Setelah verifikasi sidik jari selesai, Anda dapat kembali ke aplikasi ini.
            </p>
            </div>
            <p>Terima kasih telah menggunakan layanan kami.</p>
          </div>
          <Image src="/icons/fp.svg" width={500} height={200} alt="fp" className="" />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Fingerprint
