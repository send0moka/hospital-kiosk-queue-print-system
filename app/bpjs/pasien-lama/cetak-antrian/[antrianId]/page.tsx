import { CetakAntrianClient, Layout } from "@/components/organisms"
import { executeQuery } from "@/lib/utils"

async function getAntrianData(antrianId: string) {
  const [antrian]: any[] = await executeQuery(
    `SELECT a.*, b.kode_booking, p.nama as nama_pasien, po.nama as nama_poli, d.nama as nama_dokter
     FROM antrian a
     JOIN booking b ON a.booking_id = b.id
     JOIN pasien p ON b.pasien_id = p.id
     JOIN poli po ON b.poli_id = po.id
     LEFT JOIN dokter d ON b.dokter_id = d.id
     WHERE a.id = ?`,
    [antrianId]
  )

  return antrian
}

export default async function CetakAntrianPage({
  params,
}: {
  params: { antrianId: string }
}) {
  const antrian = await getAntrianData(params.antrianId)

  if (!antrian) {
    return <p className="text-red-500">Data antrian tidak ditemukan</p>
  }

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Cetak Nomor Antrian</h1>
        <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          BPJS
        </p>
      </div>
      <CetakAntrianClient antrian={antrian} />
    </Layout>
  )
}
