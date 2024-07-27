import { getPatientDataByBooking } from "@/lib/serverUtils"
import { Layout, VerifikasiDataCheckIn } from "@/components/organisms"

export async function generateMetadata({
  params,
}: {
  params: { kodeBooking: string }
}) {
  return {
    title: `Verifikasi Data dan Check-in - ${params.kodeBooking}`,
  }
}

export default async function Page({
  params,
}: {
  params: { kodeBooking: string }
}) {
  console.log("Received kodeBooking:", params.kodeBooking);
  if (!params.kodeBooking) {
    console.error("kodeBooking is undefined");
    return <div>Error: Kode booking tidak ditemukan</div>;
  }
  const patientData = await getPatientDataByBooking(params.kodeBooking)
  console.log("Patient data:", patientData);
  if (!patientData) {
    return (
      <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">
          Verifikasi Data dan Check-in
        </h1>
        <div className="flex items-center gap-2">
          <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            BPJS
          </p>
          |
          <p className="bg-Pasien Lama h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Pasien Lama
          </p>
          |
          <p className="bg-Sudah Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide">
            Sudah Booking
          </p>
        </div>
      </div>
      <div className="flex-grow flex justify-center items-center">
          <strong className="text-3xl">Data tidak ditemukan</strong>
        </div>
    </Layout>
    )
  }
  console.log("Patient data:", patientData);
  return <VerifikasiDataCheckIn patientData={patientData} isExistingBooking={true} />
}