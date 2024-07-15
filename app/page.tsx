import H1 from "@/components/atoms/h1"
import Footer from "@/components/organisms/footer"
import Header from "@/components/organisms/header"
import Image from "next/image"
import Small from "@/components/atoms/small"
import TextLow from "@/components/atoms/text-low"
import TextHigh from "@/components/atoms/text-high"
import Highlight from "@/components/atoms/highlight"
import { Button } from "@/components/atoms/button"

const Home = () => {
  return (
    <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
      <Header />

      <div className="flex text-black flex-grow bg-gradient-to-b from-white/70 to to-blue-200/50 w-full p-4 lg:px-10 lg:pt-10 rounded-3xl shadow-lg">
        <div className="flex flex-col justify-between bg-white/50 p-4 lg:px-10 lg:py-6 lg:mb-10 flex-grow rounded-xl shadow-lg">
          <div>
            <H1>Selamat Datang!</H1>
            <Small>
              Self Service Application v1.1.0.
            </Small>
          </div>
          <div className="space-y-10">
            <TextLow>Sebelum memulai, pastikan Anda telah menyiapkan:</TextLow>
            <div className="space-y-4">
              <TextHigh>1. Kartu identitas (KTP/SIM/Paspor)</TextHigh>
              <TextHigh>2. Nomor Rekam Medis (untuk pasien lama)</TextHigh>
              <TextHigh>3. Kartu BPJS (jika menggunakan BPJS)</TextHigh>
              <TextHigh>4. Kode booking (jika sudah melakukan reservasi)</TextHigh>
            </div>
            <TextLow>
              Untuk pasien BPJS, harap siap melakukan verifikasi {" "}
              <Highlight>SIDIK JARI</Highlight>. Jika Anda pasien baru, silakan menuju {" "}
              <Highlight>LOKET PENDAFTARAN</Highlight> {" "}
              terlebih dahulu.
            </TextLow>
          </div>
          <div className="flex justify-end">
            <a href="penjamin">
              <Button variant="primary" size="lg">Mulai</Button>
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
