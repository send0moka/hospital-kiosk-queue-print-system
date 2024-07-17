import { NextResponse } from "next/server"
import { searchUmumPatient } from "@/lib/serverUtils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const nomorRekamMedis = searchParams.get('nomor')

  if (!nomorRekamMedis) {
    return NextResponse.json({ error: "Nomor rekam medis is required" }, { status: 400 })
  }

  try {
    const patient = await searchUmumPatient(nomorRekamMedis)
    if (patient) {
      return NextResponse.json(patient)
    } else {
      return NextResponse.json({ error: "Pasien Umum tidak ditemukan" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error searching Umum patient:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}