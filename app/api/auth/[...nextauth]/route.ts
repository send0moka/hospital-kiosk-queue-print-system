import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/utils"
import { searchBPJSPatient } from "@/lib/serverUtils"

export const authOptions = {
  providers: [
    CredentialsProvider({
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
          return {
            id: patient.id,
            name: patient.nama,
            nomor_bpjs: patient.nomor_bpjs,
            fingerprint_status: patient.fingerprint_status,
            bpjs_status: patient.bpjs_status,
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
        session.user.fingerprint_status = token.fingerprint_status
        session.user.bpjs_status = token.bpjs_status
      }
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.nomor_bpjs = user.nomor_bpjs
        token.fingerprint_status = user.fingerprint_status
        token.bpjs_status = user.bpjs_status
      }
      return token
    },
  },
  pages: {
    signIn: "/bpjs/pasien-lama/belum-booking",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
