"use client"
import { Layout } from "@/components/organisms"
import { RujukanList } from "@/components/molecules"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const BPJSRujukanPage = ({ params }: { params: { nomorBPJS: string } }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/bpjs/pasien-lama/belum-booking")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <Layout>
      <div className="flex justify-between">
      <h1 className="text-4xl font-bold mb-4">Pilih Rujukan</h1>
      <div className="flex items-center gap-2">
        <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          BPJS
        </p>
        |
        <p className="bg-Pasien Lama h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          Pasien Lama
        </p>
        |
        <p className="bg-Belum Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          Belum Booking
        </p>
        |
        <p className="bg-Rujukan h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          Rujukan
        </p>
      </div>
      </div>
      <RujukanList nomorBPJS={params.nomorBPJS} />
    </Layout>
  )
}

export default BPJSRujukanPage