"use client"

import Image from "next/image"
import { Footer, Header } from "@/components/organisms"

const Loket = () => {
  return (
    <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
      <Header />

      <div className="flex flex-col gap-6 flex-grow w-full">
        <h1 className="text-5xl font-bold text-center">
          Silakan Registrasi di Loket
        </h1>
        <div className="flex flex-col justify-center items-center flex-grow bg-gradient-to-b from-white/70 to-blue-200/50 p-4 lg:px-40 rounded-3xl shadow-lg">
          <Image src="/icons/sorry.svg" width={350} height={200} alt="sorry" className="-mt-12" />
          <p className="font-semibold text-center text-xl">
            Mohon maaf, pendaftaran pasien baru tidak dapat dilakukan pada layanan aplikasi ini.
            <br />
            Silakan menuju ke <span className="bg-red-500/50 font-bold">LOKET PENDAFTARAN</span> untuk         melakukan registrasi sebagai pasien baru.
            <br />
            Setelah proses registrasi selesai, Anda dapat menggunakan layanan aplikasi ini untuk kunjungan berikutnya.
            <br />
            Terima kasih atas pengertian Anda.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Loket
