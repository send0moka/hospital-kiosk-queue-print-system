import Image from "next/image"
import { Button } from "@/components/atoms"
import { Footer, Header } from "@/components/organisms"

const Home = () => {
  return (
    <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
      <Header />

      <div className="flex flex-grow bg-gradient-to-b from-white/70 to to-blue-200/50 w-full p-4 lg:px-10 lg:pt-10 rounded-3xl shadow-lg">
        <div className="text-black text-[24px] flex flex-col justify-between bg-white/50 p-4 lg:px-10 lg:py-6 lg:mb-10 flex-grow rounded-xl shadow-lg">
          <div>
            <h1 className="text-[48px] font-bold tracking-tight">Selamat Datang!</h1>
            <small className="text-[20px] opacity-70">Self Service Application v1.1.0.</small>
          </div>
          <div className="space-y-10">
            <p className="opacity-70">Sebelum memulai, pastikan Anda telah menyiapkan:</p>
            <div className="space-y-4 font-bold">
              <p>1. Kartu identitas (KTP/SIM/Paspor)</p>
              <p>2. Nomor Rekam Medis (untuk pasien lama)</p>
              <p>3. Kartu BPJS (jika menggunakan BPJS)</p>
              <p>
                4. Kode booking (jika sudah melakukan reservasi)
              </p>
            </div>
            <div>
              <span className="opacity-70">Untuk pasien BPJS, harap siap melakukan verifikasi</span>{" "}
              <span className="bg-yellow-500/50 font-bold">SIDIK JARI</span>.
              <br />
              <span className="opacity-70">Jika Anda pasien baru, silakan
              menuju </span>{" "}
              <span className="bg-yellow-500/50 font-bold">LOKET PENDAFTARAN</span>{" "}
              <span className="opacity-70"> terlebih dahulu.</span>
            </div>
          </div>
          <div className="flex justify-end">
            <a href="penjamin">
              <Button variant="primary" size="lg">
                Mulai
              </Button>
            </a>
          </div>
        </div>
        <Image
          src="/images/home.png"
          alt="Hero"
          width={540}
          height={737}
          className="hidden lg:flex"
        />
      </div>

      <Footer />
    </div>
  )
}

export default Home
