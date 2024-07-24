import { getPatientDataByBPJS } from "@/lib/serverUtils"
import { VerifikasiDataCheckIn } from "@/components/organisms"

export async function generateMetadata({
  params,
}: {
  params: { nomorBpjs: string }
}) {
  return {
    title: `Verifikasi Data dan Check-in - ${params.nomorBpjs}`,
  }
}

export default async function Page({
  params,
}: {
  params: { nomorBpjs: string }
}) {
  const patientData = await getPatientDataByBPJS(params.nomorBpjs)

  if (!patientData) {
    return <div>Data pasien tidak ditemukan</div>
  }

  return <VerifikasiDataCheckIn patientData={patientData} isExistingBooking={true} />
}