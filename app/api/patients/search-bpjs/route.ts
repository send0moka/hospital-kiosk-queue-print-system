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
    if (patient) {
      if (patient.fingerprint_status) {
        return NextResponse.json(patient)
      } else {
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