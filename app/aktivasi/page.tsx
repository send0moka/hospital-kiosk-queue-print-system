"use client"

import Image from "next/image"
import { Footer, Header } from "@/components/organisms"

const Aktivasi = () => {
  return (
    <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
      <Header />

      <div className="flex flex-col gap-6 flex-grow w-full">
        <h1 className="text-5xl font-bold text-center">
          Silakan Aktivasi BPJS
        </h1>
        <div className="flex flex-col justify-center items-center gap-10 flex-grow text-black bg-gradient-to-b from-white/70 to-blue-200/50 p-4 lg:px-20 rounded-3xl shadow-lg">
          <Image
            src="/icons/inbpjs.svg"
            width={500}
            height={200}
            alt="inbpjs"
          />
          <div className="font-semibold text-xl space-y-2 text-center">
            <p>Mohon maaf, status kepesertaan BPJS Anda saat ini tidak aktif.</p>
            <p>Untuk dapat menggunakan layanan BPJS, Anda perlu mengaktifkan kembali
            kepesertaan BPJS Anda.</p>
            <p>Langkah-langkah yang dapat Anda lakukan:</p>
            <p>1. Kunjungi kantor BPJS Kesehatan terdekat.</p>
            <p>2. Hubungi call center BPJS Kesehatan di 1500400.</p>
            <p>3. Akses aplikasi Mobile JKN untuk informasi lebih lanjut.</p>
            <p>Untuk saat ini, Anda dapat melanjutkan pendaftaran
            sebagai pasien umum di loket pendaftaran.</p>
            <p>Terima kasih atas pengertian Anda.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Aktivasi
