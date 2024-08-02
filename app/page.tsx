import Image from "next/image"
import { Button } from "@/components/atoms"
import { Layout } from "@/components/organisms"

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-8 flex-grow items-center">
        <div
          id="container"
          className="flex items-stretch pt-10 px-10 bg-gradient-to-b from-white/70 to to-blue-200/50 w-full h-full rounded-3xl shadow-lg"
        >
          <div
            id="message"
            className="text-black text-xl flex flex-col justify-between bg-white/50 p-4 lg:px-10 lg:py-6 lg:mb-10 flex-grow rounded-xl shadow-lg"
          >
            <div className="mb-8">
              <h1 className="text-5xl font-bold tracking-tight">
                Selamat Datang!
              </h1>
              <small className="opacity-70">
                Sistem Cetak Antrian versi 1.0
              </small>
            </div>
            <div className="space-y-8 flex-grow">
              <p className="opacity-70">
                Sebelum memulai, pastikan Anda telah menyiapkan:
              </p>
              <div className="space-y-4 font-bold">
                <p>1. Kartu identitas (KTP/SIM/Paspor)</p>
                <p>2. Nomor Rekam Medis (untuk pasien lama)</p>
                <p>3. Kartu BPJS (jika menggunakan BPJS)</p>
                <p>4. Kode booking (jika sudah melakukan reservasi)</p>
              </div>
              <div className="space-y-3">
                <p>
                  <span className="opacity-70">
                  Untuk pasien BPJS, harap siap melakukan verifikasi
                </span>{" "}<span className="bg-yellow-500/50 font-bold">SIDIK JARI</span>.
                </p>
                <p>
                <span className="opacity-70">
                  Jika Anda pasien baru, silakan menuju{" "}
                </span>{" "}
                <span className="bg-yellow-500/50 font-bold">
                  LOKET PENDAFTARAN
                </span>{" "}
                <span className="opacity-70"> terlebih dahulu.</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
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
            className="hidden lg:flex max-h-[40rem] w-fit"
          />
        </div>
        <div className="bg-emerald-800 text-xl font-medium w-full rounded-md p-3 overflow-hidden">
          <div className="marquee">
            <div className="marquee-content">
              <span>
                Selamat datang di Rumah Sakit Umum St. Elisabeth Purwokerto • Jam Pelayanan: Setiap Hari 08.00-20.00 • Nomor Darurat/IGD: (0281) 634005 • Jalan Dokter Angka No. 40 Purwokerto, 53116
              </span>
              <span>
                Kami menerapkan protokol kesehatan ketat • Mohon selalu gunakan masker dan jaga jarak • Kesehatan Anda adalah prioritas kami • Terima kasih atas kerjasamanya
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
