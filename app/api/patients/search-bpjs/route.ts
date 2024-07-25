import { NextResponse } from "next/server"
import { searchBPJSPatient } from "@/lib/serverUtils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const nomorBPJS = searchParams.get('nomor')

  if (!nomorBPJS) {
    return NextResponse.json({ error: "Nomor BPJS is required" }, { status: 400 })
  }

  try {
    const patient = await searchBPJSPatient(nomorBPJS)
    console.log("Patient data in route handler:", patient)
    if (patient) {
      console.log("Fingerprint status:", patient.fingerprint_status)
      console.log("BPJS status:", patient.bpjs_status)
      console.log("BPJS status type:", typeof patient.bpjs_status)
      if (patient.fingerprint_status === true) {
        if (patient.bpjs_status === true) {
          console.log("Redirecting to rujukan")
          return NextResponse.json({ redirect: "/bpjs/pasien-lama/belum-booking/rujukan" })
        } else {
          console.log("Redirecting to aktivasi")
          return NextResponse.json({ redirect: "/aktivasi" })
        }
      } else {
        console.log("Redirecting to fingerprint")
        return NextResponse.json({ redirect: "/fingerprint" })
      }
    } else {
      return NextResponse.json({ error: "Pasien BPJS tidak ditemukan" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error searching BPJS patient:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}