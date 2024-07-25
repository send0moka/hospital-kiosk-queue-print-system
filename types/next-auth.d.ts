import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      nomor_bpjs?: string
      nomor_rekam_medis?: string
      fingerprint_status?: boolean
      bpjs_status?: boolean
      patientType?: "BPJS" | "Umum"
    }
  }
}