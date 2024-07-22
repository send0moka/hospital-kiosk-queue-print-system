"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/atoms"
import Image from "next/image"

export default function CetakAntrianClient({ antrian }: { antrian: any }) {
  const router = useRouter()

  const handlePrint = () => {
    router.push('/bpjs/pasien-lama/sukses')
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
        <p className="text-2xl text-center my-4">
          SELAMAT DATANG
          <br /> NO. ANTRIAN ANDA
        </p>
        <p className="text-7xl font-black">{antrian.nomor_antrian}</p>
        <table className="my-5">
          <tbody>
            <tr>
              <td>Nama</td>
              <td className="!px-3">:</td>
              <td>{antrian.nama_pasien}</td>
            </tr>
            <tr>
              <td>Poliklinik</td>
              <td className="!px-3">:</td>
              <td>{antrian.nama_poli}</td>
            </tr>
            <tr>
              <td>Dokter</td>
              <td className="!px-3">:</td>
              <td>{antrian.nama_dokter || "Belum ditentukan"}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-2xl text-center">
          TERIMA KASIH
          <br />
          ANDA TELAH MENUNGGU
        </p>
      </div>
      <Button variant="primary" onClick={handlePrint}>
        Cetak
      </Button>
    </div>
  )
}
