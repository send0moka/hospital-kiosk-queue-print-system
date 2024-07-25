import CredentialsProvider from "next-auth/providers/credentials"
import { searchBPJSPatient, searchUmumPatient } from "@/lib/serverUtils"

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'bpjs-credentials',
      name: "BPJS",
      credentials: {
        nomor_bpjs: { label: "Nomor BPJS", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.nomor_bpjs) {
          return null
        }
        console.log(
          "Searching for BPJS patient with nomor_bpjs:",
          credentials.nomor_bpjs
        )
        const patient = await searchBPJSPatient(credentials.nomor_bpjs)
        console.log("Search result:", patient)
        if (patient) {
          console.log("Patient found. BPJS status:", patient.bpjs_status);
          console.log("Fingerprint status:", patient.fingerprint_status);
          if (!patient.fingerprint_status) {
            throw new Error('FINGERPRINT_NOT_REGISTERED');
          }
          if (patient.bpjs_status !== true && patient.bpjs_status !== 1) {
            throw new Error('BPJS_NOT_ACTIVE');
          }
          return {
            id: patient.id.toString(),
            name: patient.nama,
            nomor_bpjs: patient.nomor_bpjs,
            fingerprint_status: patient.fingerprint_status,
            bpjs_status: patient.bpjs_status,
            patientType: "BPJS",
          }
        }
        return null
      },
    }),
    CredentialsProvider({
      id: 'umum-credentials',
      name: "Umum",
      credentials: {
        nomor_rekam_medis: { label: "Nomor Rekam Medis", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.nomor_rekam_medis) {
          return null
        }
        console.log(
          "Searching for Umum patient with nomor_rekam_medis:",
          credentials.nomor_rekam_medis
        )
        const patient = await searchUmumPatient(credentials.nomor_rekam_medis)
        console.log("Search result:", patient)
        if (patient) {
          return {
            id: patient.id,
            name: patient.nama,
            nomor_rekam_medis: patient.nomor_rekam_medis,
            patientType: "Umum",
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub
        session.user.nomor_bpjs = token.nomor_bpjs
        session.user.nomor_rekam_medis = token.nomor_rekam_medis
        session.user.fingerprint_status = token.fingerprint_status
        session.user.bpjs_status = token.bpjs_status
        session.user.patientType = token.patientType
      }
      console.log("Session callback called. Session:", session);
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.nomor_bpjs = user.nomor_bpjs
        token.nomor_rekam_medis = user.nomor_rekam_medis
        token.fingerprint_status = user.fingerprint_status
        token.bpjs_status = user.bpjs_status
        token.patientType = user.patientType
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}